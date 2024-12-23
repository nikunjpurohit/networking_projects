const axios = require('axios');

// List of CDN servers
const cdnServers = [
    { url: 'http://localhost:3001', distance: 5 },
    { url: 'http://localhost:3002', distance: 10 },
    { url: 'http://localhost:3003', distance: 2 }
];

// Function to fetch file from the closest server
async function fetchFromClosestServer(filePath) {
    // Sort servers by distance
    const sortedServers = cdnServers.sort((a, b) => a.distance - b.distance);

    for (const server of sortedServers) {
        try {
            const response = await axios.get(`${server.url}/${filePath}`, { responseType: 'arraybuffer' });
            console.log(`Fetched from ${server.url}`);
            return response.data;
        } catch (error) {
            console.log(`Failed to fetch from ${server.url}, trying next server...`);
        }
    }
    throw new Error('Failed to fetch file from all servers');
}

// Fetch file
fetchFromClosestServer('file1.txt')
    .then(data => {
        // Save the file locally
        const fs = require('fs');
        fs.writeFileSync('downloaded_file.txt', data);
        console.log('File saved as downloaded_file.txt');
    })
    .catch(error => {
        console.error(error.message);
    });
