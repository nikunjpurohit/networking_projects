const net = require('net');
const crypto = require('crypto');

const PORT = 12345; // Port to connect to VPN server
const HOST = '127.0.0.1'; // Server IP address

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

// Create the VPN client and connect to server
const client = net.createConnection({ port: PORT, host: HOST }, () => {
    console.log('Connected to VPN server');

    // Encrypt and send data to server
    const message = 'Hello from client';
    const encryptedMessage = encrypt(Buffer.from(message));
    client.write(encryptedMessage);
});

// Handle data from the server
client.on('data', (data) => {
    const decryptedData = decrypt(data);
    console.log(`Received from server: ${decryptedData.toString()}`);
});

// Handle server disconnect
client.on('end', () => {
    console.log('Disconnected from VPN server');
});

// Handle errors
client.on('error', (err) => {
    console.error(`Client error: ${err.message}`);
});
