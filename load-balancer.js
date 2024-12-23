const http = require("http");
const axios = require("axios");

const PORT = 8080; // port for load balancer to listen on

// List of backend servers with weights
const servers = [
  { url: "http://localhost:3000", weight: 1 },
  { url: "http://localhost:3001", weight: 2 },
  { url: "http://localhost:3002", weight: 3 },
  { url: "http://localhost:3008", weight: 1 },
];

// Index for round-robin strategy
let currentIndex = 2;

// Function to perform round-robin load balancing
function roundRobin() {
  const server = servers[currentIndex];
  currentIndex = (currentIndex + 1) % servers.length;
  console.log(`Redirecting to server ${server.url}`);
  return server;
}

// Create HTTP server to handle requests
const loadBalancer = http.createServer(async (req, res) => {
  const targetUrl = roundRobin(); // Choose round-robin strategy, change to weightedRoundRobin() if needed
  
  try {
    const response = await axios({
      method: req.method,
      url: targetUrl.url + req.url,
      data: req.body,
      headers: req.headers,
    });
    res.writeHead(response.status, response.headers);
    res.end(response.data);
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
});

// Start the load balancer server
loadBalancer.listen(PORT, () => {
  console.log(`Load Balancer is running on port ${PORT}`);
});
