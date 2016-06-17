var config = require("./config/config.js");
//var spawn = require("./src/spawn.js");
var pkg = require("./package.json");
var WebSocket = require("ws").Server;
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
var botCount = 1;

console.log("[DEBUG] You are currently running on " + pkg.version);
console.log("[SERVER] Starting Server...");
var server;
server = new WebSocket({port: config["port"], path: "/slither"}, function(){
	console.log("[SERVER] Server Started at 127.0.0.1:" + config["port"] + "! Waiting for Connections...");
	console.log("[BOTS] Bot Status:");
	console.log("[BOTS] Creating " + config["bots"] + " bots!");
	console.log("[BOTS] Bots successfully loaded: " + botCount + (botCount == 0 ? "\n[BOTS] Reason: Bot's aren't implemented yet. Please try again later": ""));
	generateFood(config["food"]);
	generateSectors();
});
/* server.on('error', function() {
    console.log('[DEBUG] Error while connecting!');
});
console.log("[SERVER] Server Started at 127.0.0.1:" + config["port"] + "! Waiting for Connections...");
 */
if(server.readyState === server.OPEN){
	server.on("connection", handleConnection.bind(server));
}else{
	console.log(server.readyState);
}
function handleConnection(conn) {
	if(config['isDebug']){
		console.log("[DEBUG] handleConnection() has begun");
	}
    if (clients.length >= config['max-connections']) {
		console.log("[SERVER] Too many connections. Closing newest connections!");
		conn.close();
		return;
    }
	try {
		conn.id = ++counter;
		clients[conn.id] = conn;
	}catch(e){
		console.log("[ERROR] " + e);
	}
    
    function close(id) {
		console.log("[ERROR] Error!");
        console.log("[DEBUG] Connection closed.");
        //clearInterval(conn.snake.update);
        delete clients[id];
    }
    conn.on('message', handleMessage.bind(this, conn));
	//conn.on('error', close.bind(conn.id));
	conn.on('error', function(e){
		console.log(e);
		close(conn.id);
		delete clients[conn.id];
	});
    
    conn.on('close', close.bind(conn.id));
    send(conn.id, messages.initial);
}
function handleMessage(conn, data) {
    var firstByte, name, radians, secondByte, skin, speed, value, x, y;
    if (data.length === 0) {
		console.log("[SERVER] No Data to handle!");
		return;
    }
    if (data.length >= 227) {
		console.log("[SERVER] Data length less than 227!");
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
			var move = messages.movement.build(conn.id, conn.snake.direction.x, conn.snake.direction.y);
			var dir = messages.direction.build(conn.id, conn.snake.direction);
			console.log("[DEBUG] A new snake called " + conn.snake.name + " was connected!");
			spawnSnakes(conn.id);
			conn.snake.update = setInterval((function() {
				conn.snake.body.x += Math.round(Math.cos(conn.snake.direction.angle * 1.44 * Math.PI / 180) * 170);
				conn.snake.body.y += Math.round(Math.sin(conn.snake.direction.angle * 1.44 * Math.PI / 180) * 170);
				// This is where the error is coming from:
				broadcast(dir);
				broadcast(move);
			}), 230);
			} else {
				console.log("[ERROR] Unhandled message " + (String.fromCharCode(firstByte)));
			}
			send(conn.id, messages.leaderboard.build([conn], 1, [conn]));
			send(conn.id, messages.highscore.build("Rowan", "Test Message"));
			send(conn.id, messages.minimap.build(foods));
	}
}
function generateFood(amount) {
    var color, i, id, results, size, x, y;
    i = 0;
    results = [];
    while (i < amount) {
		x = math.randomInt(0, 65535);
		y = math.randomInt(0, 65535);
		id = x * config['game-radius'] * 3 + y;
		color = math.randomInt(0, config['foodColors']);
		size = math.randomInt(config['foodSize'][0], config['foodSize'][1]);
		foods.push(new food(id, {
			x: x,
			y: y
		}, size, color));
		results.push(i++);
    }
    return results;
}
function generateSectors() {
    var i, results, sectorsAmount;
    sectorsAmount = config['gameRadius'] / config['sectorSize'];
    i = 0;
    results = [];
    while (i < sectorsAmount) {
		results.push(i++);
    }
    return results;
}
function spawnSnakes(id){
	clients.forEach(function(newClient){
		if(newClient.id !== id){
			send(id, messages.snake.build(newClient.snake));
		}
	});
}

function send(id,data){
	if(clients[id]){
		clients[id].send(data, {binary:true});
	}
}

function broadcast(data){
	/* "use strict";
	for(let client in clients){
		if(client){
			client.send(data, {binary: true});
		}
	} */
	for(var i = 0; i < clients.length; i++){
		if(clients[i]){
			console.log("[TEST] " + data);
			clients[i].send(data, {binary:true});
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
function close(){
	server.close();
}