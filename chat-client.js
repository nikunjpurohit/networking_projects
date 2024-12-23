const net = require("net");
const readline = require("readline");

const client = net.createConnection({ port: 12345 }, () => {
  console.log("Connected to server");
});

client.on("data", (data) => {
  console.log(`Message from server: ${data}`);
});

client.on("end", () => {
  console.log("Disconnected from server");
});

client.on("error", (err) => {
  console.error(`Client error: ${err.message}`);
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.on("line", (line) => {
  client.write(line);
});
