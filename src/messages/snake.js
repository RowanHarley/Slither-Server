var message = require("../utils/message.js");
var type = 's'.charCodeAt(0);

exports.build = function(snake){
	var nameLength = snake.name.length;
	var partsLength = snake.parts.length * 2;
	var arr = new Uint8Array(27 + nameLength + 6 + partsLength);
	var b = 0;
	b += message.writeInt8(b, arr, 0);
	b += message.writeInt8(b, arr, 0);
	b += message.writeInt8(b, arr, type);
	b += message.writeInt16(b, arr, snake.id);
	b += message.writeInt24(b, arr, snake.D);
	b += message.writeInt8(b, arr, 0);
	b += message.writeInt24(b, arr, snake.X);
	b += message.writeInt16(b, arr, snake.speed);
	b += message.writeInt24(b, arr, 0);
	b += message.writeInt8(b, arr, snake.skin);
	b += message.writeInt24(b, arr, snake.body.x);
	b += message.writeInt24(b, arr, snake.body.y);
	b += message.writeInt8(b, arr, nameLength);
	b += message.writeString(b, arr, snake.name);
	b += message.writeInt24(b, arr, snake.head.x);
	b += message.writeInt24(b, arr, snake.head.y);
	
	var i = 0;
	while (i < snake.parts.length) {
		b += message.writeInt8(b, arr, snake.parts[i].x);
		b += message.writeInt8(b, arr, snake.parts[i].y);
		i++;
	}
	return arr;
}