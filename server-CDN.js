const http = require('http');
const fs = require('fs');
const path = require('path');



// Function to create a server
function createServer(port, filePath) {
    http.createServer((req, res) => {
        
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('File not found');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
            res.end(data);
        });
    }).listen(port, () => {
        console.log(`Server running at http://localhost:${port}/`);
    });
}

// Paths to files on different servers
const server1Path = path.join(__dirname, '', 'file1.txt');
const server2Path = path.join(__dirname, '', 'file2.txt');
const server3Path = path.join(__dirname, '', 'file3.txt');



// Create servers on different ports

createServer(3001, server1Path);
createServer(3002, server2Path);
createServer(3003, server3Path);
