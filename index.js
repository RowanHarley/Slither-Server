var config = require("./config/config.js");
var spawn = require("./src/spawn.js");
var WebSocketServer = require("ws").Server;

console.log("[SERVER] Starting Server...");
var server;
server = new WebSocketServer({port: config["port"], path: "/slither"});

console.log("[SERVER] Server Started at " + server + "! Waiting for Connections...");
server.on('error', function() {
        console.log('npm ws error');
});

server.on('open', function HandleConnections(conn){
	ws.send("test");
});

process.on('uncaughtException', function (err) {
    console.log(err);
}); 
({
  close: function() {
    return this.server.close();
  }
});
