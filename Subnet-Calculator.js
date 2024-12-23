const readline = require("readline");
const { Netmask } = require("netmask");

// Setting up readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to calculate subnet information
function calculateSubnet(ip, mask) {
  const block = new Netmask(`${ip}/${mask}`);
  console.log(`IP Address: ${ip}`);
  console.log(`Subnet Mask: ${mask}`);
  console.log(`Network Address: ${block.base}`);
  console.log(`Broadcast Address: ${block.broadcast}`);
  console.log(`First Host: ${block.first}`);
  console.log(`Last Host: ${block.last}`);
  console.log(`Total Hosts: ${block.size}`);
}
// Asking user for IP address and subnet mask

rl.question("Enter IP address (e.g., 192.168.1.1): ", (ip) => {
  rl.question("Enter subnet mask (e.g., 255.255.255.0 or /24): ", (mask) => {
    calculateSubnet(ip, mask);
    rl.close();
  });
});
