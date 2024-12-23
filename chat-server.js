const net = require("net");

let clients = [];

const server = net.createServer((socket) => {
  console.log("Client connected");

  //add client to list of clients
  clients.push(socket);

  socket.on("data", (data) => {
    console.log(`Received: ${data}`);

    socket.on("data", (data) => {
      console.log(`Received: ${data}`); // Broadcast the message to all clients
      clients.forEach((client) => {
        if (client !== socket) {
          client.write(data);
        }
      });
    });
  });

  socket.on("end", () => {
    console.log("Client disconnected");
    clients = clients.filter((client) => client !== socket);
  });
});

server.on("error", (err) => {
  console.error(`Server error: ${err.message}`);
});
const PORT = 12345;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
