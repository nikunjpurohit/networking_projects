const net = require('net');
const EventEmitter = require('events');

class Router extends EventEmitter {
    constructor(id) {
        super();
        this.id = id;
        this.neighbors = new Map();
        this.routingTable = new Map();
    }

    // Add a neighbor router
    addNeighbor(neighbor, cost) {
        this.neighbors.set(neighbor, cost);
        this.routingTable.set(neighbor.id, { nextHop: neighbor, cost });
    }

    // Send routing table to neighbors (simplified OSPF)
    sendRoutingTable() {
        for (const [neighbor, cost] of this.neighbors) {
            neighbor.receiveRoutingTable(this.id, this.routingTable);
        }
    }

    // Receive routing table from a neighbor
    receiveRoutingTable(neighborId, neighborTable) {
        let updated = false;
        for (const [dest, { nextHop, cost }] of neighborTable) {
            const newCost = this.neighbors.get(this.getRouterById(neighborId)) + cost;
            if (!this.routingTable.has(dest) || newCost < this.routingTable.get(dest).cost) {
                this.routingTable.set(dest, { nextHop: this.getRouterById(neighborId), cost: newCost });
                updated = true;
            }
        }
        if (updated) {
            this.sendRoutingTable();
        }
    }

    // Helper method to get router by ID
    getRouterById(id) {
        for (const [neighbor, cost] of this.neighbors) {
            if (neighbor.id === id) {
                return neighbor;
            }
        }
        return null;
    }

    // Display the routing table
    displayRoutingTable() {
        console.log(`Router ${this.id} Routing Table:`);
        for (const [dest, { nextHop, cost }] of this.routingTable) {
            console.log(`Destination: ${dest}, Next Hop: ${nextHop.id}, Cost: ${cost}`);
        }
    }
}

// Create routers
const routerA = new Router('A');
const routerB = new Router('B');
const routerC = new Router('C');

// Establish neighbor relationships
routerA.addNeighbor(routerB, 1);
routerA.addNeighbor(routerC, 5);
routerB.addNeighbor(routerC, 1);

// Initialize routing tables
routerA.sendRoutingTable();
routerB.sendRoutingTable();
routerC.sendRoutingTable();

// Display routing tables
setTimeout(() => {
    routerA.displayRoutingTable();
    routerB.displayRoutingTable();
    routerC.displayRoutingTable();
}, 1000);
