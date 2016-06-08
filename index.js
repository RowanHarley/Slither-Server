var config = require("./config/config.js");
//var spawn = require("./src/spawn.js");
var WebSocketServer = require("ws").Server;
var snake = require("./src/entities/snake");
var food = require("./src/entities/food");
var sector = require("./src/entities/sector");
var messages = require("./src/messages");
var message = require("./src/utils/message");
var math = require("./src/utils/math");


var counter = 0;
var clients = [];
var foods = [];
var sectors = []; // Development Code



console.log("[SERVER] Starting Server...");
var server;
server = new WebSocketServer({port: config["port"], path: "/slither"});

console.log("[SERVER] Server Started at 127.0.0.1:" + config["port"] + "! Waiting for Connections...");
server.on('error', function() {
    console.log('[DEBUG] Error while connecting!');
});
server.on("connection", handleConnection.bind(this));
function handleConnection(conn) {
    if (clients.length >= config['max-connections']) {
		console.log("[SERVER] Too many connections. Closing newest connections!");
		conn.close();
		return;
    }
    conn.id = ++counter;
    clients[conn.id] = conn;
    
    function close(id) {
        console.log("[DEBUG] Connection closed.");
		conn.send = function() {};
        //clearInterval(conn.snake.update);
        delete clients[id];
    }
    conn.on('message', handleMessage.bind(this, conn));
    conn.on('error', close.bind(conn.id));
    conn.on('close', close.bind(conn.id));
    send(conn.id, messages.initial);
};
function handleMessage(conn, data) {
    var firstByte, name, radians, secondByte, skin, speed, value, x, y;
    if (data.length === 0) {
		return;
    }
    if (data.length >= 227) {
		conn.close();
    } else if (data.length === 1) {
		value = message.readInt8(0, data);
		if (value <= 250) {
			console.log('Snake going to', value);
			if (value === conn.snake.direction.angle) {
				return;
			}
			radians = value * (Math.PI / 125);
			speed = 1;
			x = Math.cos(radians) + 1;
			y = Math.sin(radians) + 1;
			conn.snake.direction.x = x * 127 * speed;
			conn.snake.direction.y = y * 127 * speed;
			conn.snake.direction.angle = value;
		} else if (value === 253) {
			console.log("Snake in speed mode");
		} else if (value === 254) {
			console.log("Snake in speed mode");
		} else if (value === 251) {
			send(conn.id, messages.pong);
		}
    } else {
		firstByte = message.readInt8(0, data);
		secondByte = message.readInt8(1, data);
		if (firstByte === 115) {
			skin = message.readInt8(2, data);
			name = message.readString(3, data, data.byteLength);
			conn.snake = new snake(conn.id, name, {
				x: 28907.6 * 5,
				y: 21137.4 * 5
			}, skin);
			broadcast(messages.snake.build(conn.snake));
			console.log("[DEBUG] A new snake called " + conn.snake.name + " was connected!");
			spawnSnakes(conn.id);
			conn.snake.update = setInterval((function() {
				conn.snake.body.x += Math.round(Math.cos(conn.snake.direction.angle * 1.44 * Math.PI / 180) * 170);
				conn.snake.body.y += Math.round(Math.sin(conn.snake.direction.angle * 1.44 * Math.PI / 180) * 170);
				broadcast(messages.direction.build(conn.snake.id, conn.snake.direction));
				broadcast(messages.movement.build(conn.snake.id, conn.snake.direction.x, conn.snake.direction.y));
			}), 230);
			} else {
				console.log("[ERROR] Unhandled message " + (String.fromCharCode(firstByte)));
			}
			send(conn.id, messages.leaderboard.build([conn], 1, [conn]));
			send(conn.id, messages.highscore.build("Rowan", "Test Message"));
			send(conn.id, messages.minimap.build(this.foods));
	}
}

function spawnSnakes(id){
	clients.forEach((function(_this){
		return function(client){
			if(client.id !== id){
				send(id, messages.snake.build(client.snake));
			}
		};
	})(this));
}

function send(id,data){
	clients[id].send(data, {binary:true});
}

function broadcast(data){
	/* "use strict";
	for(let client in clients){
		if(client != null){
			client.send(data, {binary: true});
		}
	} */
	for(var i = 0; i < clients.length; i++){
		if(clients[i] != null || clients[i] != undefined){
			clients[i].send(data, {binary: true});
		}
	}
}
/* function broadcast(data) {
    var client, j, len, ref, results;
    ref = this.clients;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
		client = ref[j];
		results.push(client != null ? client.send(data, {
			binary: true
		}) : void 0);
    }
    return results;
}; */