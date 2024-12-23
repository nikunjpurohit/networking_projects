const net = require('net');
const crypto = require('crypto');

const PORT = 12345; // Port for the VPN server

// Encryption key and algorithm
const ENCRYPTION_KEY = crypto.randomBytes(32); // Must be 32 bytes
const ALGORITHM = 'aes-256-ctr';

// Function to encrypt data
function encrypt(data) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
    const encrypted = Buffer.concat([iv, cipher.update(data), cipher.final()]);
    return encrypted;
}

// Function to decrypt data
function decrypt(data) {
    const iv = data.slice(0, 16);
    const encryptedText = data.slice(16);
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decrypted;
}

// Create the VPN server
const server = net.createServer((clientSocket) => {
    console.log('Client connected');

    // Handle data from the client
    clientSocket.on('data', (data) => {
        const decryptedData = decrypt(data);
        console.log(`Received from client: ${decryptedData.toString()}`);

        // Echo back the decrypted data
        const responseData = Buffer.from(`Server response: ${decryptedData.toString()}`);
        const encryptedResponse = encrypt(responseData);
        clientSocket.write(encryptedResponse);
    });

    // Handle client disconnect
    clientSocket.on('end', () => {
        console.log('Client disconnected');
    });

    // Handle errors
    clientSocket.on('error', (err) => {
        console.error(`Client error: ${err.message}`);
    });
});

// Start the VPN server
server.listen(PORT, () => {
    console.log(`VPN Server running on port ${PORT}`);
});
