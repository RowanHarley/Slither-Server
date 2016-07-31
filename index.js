
/*eslint-disable no-unused-vars */ // disabled some codes are stubs

var config = require('./config/config.js');
// var spawn = require("./src/spawn.js");
var pkg = require('./package.json');
var WebSocket = require('ws').Server;
var Snake = require('./src/entities/snake');
var Food = require('./src/entities/food');
var sector = require('./src/entities/sector');
var messages = require('./src/messages');
var message = require('./src/utils/message');
var math = require('./src/utils/math');

var counter = 0;
var clients = [];
var foods = [];
var sectors = []; // Development Code
var botCount = 0;
var highscoreName = "Rowan";
var highscoreMessage = "Get this project at: www.github.com/RowanHarley/Slither-Server";
var highscoreScore;
var fmlts;
var fpsls;

console.log('[DEBUG] You are currently running on ' + pkg.version);
console.log('[SERVER] Starting Server...');
var server;
server = new WebSocket({port: config['port'], path: '/slither'}, function () {
    console.log('[SERVER] Server Started at 127.0.0.1:' + config['port'] + '! Waiting for Connections...');
    console.log('[BOTS] Bot Status:');
    console.log('[BOTS] Creating ' + config['bots'] + ' bots!');
    console.log('[BOTS] Bots successfully loaded: ' + botCount + (botCount === 0 ? "\n[BOTS] Reason: Bot's aren't implemented yet. Please try again later" : ''));
    generateFood(config['food']);
    generateSectors();
});
/* server.on('error', function() {
 console.log('[DEBUG] Error while connecting!');
});
console.log("[SERVER] Server Started at 127.0.0.1:" + config["port"] + "! Waiting for Connections...");
 */
if (server.readyState === server.OPEN) {
    server.on('connection', handleConnection.bind(server));
} else {
    console.log(server.readyState);
}
function handleConnection (conn) {
    if (clients.length >= config['max-connections']) {
        console.log('[SERVER] Too many connections. Closing newest connections!');
        conn.close();
        return;
    }
    try {
        conn.id = ++counter;
        clients[conn.id] = conn;
    } catch (e) {
        console.log('[ERROR] ' + e);
    }

    function close (id) {
        console.log('[DEBUG] Connection closed.');
        clearInterval(conn.snake.update);
        delete clients[id];
    }
    conn.on('message', handleMessage.bind(this, conn));
    conn.on('error', close.bind(conn.id));
    conn.on('close', close.bind(conn.id));
    send(conn.id, messages.initial);
}
function handleMessage (conn, data) {
    var firstByte, name, radians, secondByte, skin, speed, value, x, y;
    if (data.length === 0) {
        console.log('[SERVER] No Data to handle!');
        return;
    }
    if (data.length >= 227) {
        console.log('[SERVER] Data length less than 227!');
        conn.close();
    } else if (data.length === 1) {
        value = message.readInt8(0, data);
        if (value <= 250) {
            console.log('Snake going to', value);
            if (value === conn.snake.direction.angle) {
                console.log('[DEBUG] Angle is equal to last');
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
            console.log('Snake in normal mode');
        } else if (value === 254) {
            console.log('Snake in speed mode');
 // killPlayer(conn.id, 1);
            messages.end.build(2);
        } else if (value === 251) {
            send(conn.id, messages.pong);
        }
    } else {
        firstByte = message.readInt8(0, data);
        secondByte = message.readInt8(1, data);
        if (firstByte === 115) {
 // setMscps(411);
            skin = message.readInt8(2, data);
            name = message.readString(3, data, data.byteLength);
            conn.snake = new Snake(conn.id, name, {
                x: 28907.6,
                y: 21137.4
            }, skin);
            broadcast(messages.snake.build(conn.snake));

            console.log((conn.snake.name === '' ? '[DEBUG] An unnamed snake' : '[DEBUG] A new snake called ' + conn.snake.name) + ' has connected!');
            spawnSnakes(conn.id);
            conn.snake.update = setInterval(function () {
                conn.snake.body.x += Math.cos(conn.snake.direction.angle * 1.44 * Math.PI / 180) * 170;
                conn.snake.body.y += Math.sin(conn.snake.direction.angle * 1.44 * Math.PI / 180) * 170;

                var R = config['gameRadius'];
                var r = (Math.pow((conn.snake.body.x - 0), 2)) + (Math.pow((conn.snake.body.y - 0), 2));
                if (r < Math.pow(R, 2)) {
 // console.log("[TEST] " + r + " < " + R^2);
                    console.log('[DEBUG] Outside of Radius');
                    messages.end.build(0);
                    conn.close();
                }
				
                broadcast(messages.position.build(conn.id, conn.snake));
                broadcast(messages.direction.build(conn.id, conn.snake));
                //broadcast(messages.movement.build(conn.id, conn.snake));
            }, 230);
        } // else if(firstByte === 255){
 // var message = message.readString(3, data, data.byteLength);
 // send(conn.id, messages.highscore.build(name, message));
        else {
            console.log('[ERROR] Unhandled message ' + (String.fromCharCode(firstByte)));
        }
        send(conn.id, messages.leaderboard.build([conn], clients.length, [conn]));
        send(conn.id, messages.highscore.build('Rowan', 'Test Message'));
        send(conn.id, messages.minimap.build(foods));
    }
}
function generateFood (amount) {
    var color, i, id, results, size, x, y;
    i = 0;
    results = [];
    while (i < amount) {
        x = math.randomInt(0, 65535);
        y = math.randomInt(0, 65535);
        id = x * config['gameRadius'] * 3 + y;
        color = math.randomInt(0, config['foodColors']);
        size = math.randomInt(config['foodSize'][0], config['foodSize'][1]);
        foods.push(new Food(id, {
            x: x,
            y: y
        }, size, color));
        results.push(i++);
    }
    return results;
}
function generateSectors () {
    var i, results, sectorsAmount;
    sectorsAmount = config['gameRadius'] / config['sectorSize'];
    i = 0;
    results = [];
    while (i < sectorsAmount) {
        results.push(i++);
    }
    return results;
}
function spawnSnakes (id) {
    clients.forEach(function (newClient) {
        if (newClient.id !== id) {
            send(id, messages.snake.build(newClient.snake));
        }
    });
}

function send (id, data) {
    client = clients[id];
    if (client) {
        currentTime = Date.now();
        deltaTime = client.lastTime ? currentTime - client.lastTime : 0;
        client.lastTime = currentTime;
        message.writeInt16(0, data, deltaTime);
        client.send(data, {binary: true});
    }
}

function broadcast (data) {
    for (var i = 0; i < clients.length; i++) {
        send(i, data);
    }
}

function killPlayer (playerId, endType) {
    broadcast(messages.end.build(endType));
}
function setMscps (mscps) {
    fmlts = [mscps + 1 + 2048];
    fpsls = [mscps + 1 + 2048];

    for (var i = 0; i <= mscps; i++) {
        fmlts[i] = (i >= mscps ? fmlts[i - 1] : Math.pow(1 - 1.0 * i / mscps, 2.25));
        fpsls[i] = (i === 0 ? 0 : fpsls[i - 1] + 1.0 / fmlts[i - 1]);
    }

    var fmltsFiller = fmlts[mscps];
    var fpslsFiller = fpsls[mscps];

    for (var i = 0; i < 2048; i++) {
        fmlts[mscps + 1 + i] = fmltsFiller;
        fpsls[mscps + 1 + i] = fpslsFiller;
    }
}

function close () {
    console.log('[SERVER] Server Closed');
    server.close();
}
