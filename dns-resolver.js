const dgram = require('dgram');

const DNS_SERVER = '8.8.8.8';  // Google's public DNS server
const DNS_PORT = 53;           // Standard DNS port

function createQuery(domain) {
    const packet = Buffer.alloc(512); // DNS packets are usually 512 bytes
    packet.writeUInt16BE(0x1234, 0);  // Transaction ID
    packet.writeUInt16BE(0x0100, 2);  // Standard query with recursion
    packet.writeUInt16BE(1, 4);       // Questions
    packet.writeUInt16BE(0, 6);       // Answer RRs
    packet.writeUInt16BE(0, 8);       // Authority RRs
    packet.writeUInt16BE(0, 10);      // Additional RRs

    let offset = 12;

    domain.split('.').forEach(part => {
        const length = part.length;
        packet.writeUInt8(length, offset++);
        packet.write(part, offset);
        offset += length;
    });

    packet.writeUInt8(0, offset++);   // End of domain name
    packet.writeUInt16BE(1, offset);  // Type A query
    offset += 2;
    packet.writeUInt16BE(1, offset);  // Class IN
    return packet;
}

function parseResponse(response) {
    const ipStart = response.length - 4;
    const ip = response.slice(ipStart).join('.');
    return ip;
}

function resolveDomain(domain) {
    const query = createQuery(domain);
    const socket = dgram.createSocket('udp4');

    socket.on('message', (msg) => {
        const ip = parseResponse(msg);
        console.log(`IP address for ${domain}: ${ip}`);
        socket.close();
    });

    socket.send(query, 0, query.length, DNS_PORT, DNS_SERVER, (err) => {
        if (err) {
            console.error('Error sending DNS query:', err);
            socket.close();
        }
    });
}

const domain = 'facebook.com'; // Change this to any domain you want to resolve
resolveDomain(domain);
