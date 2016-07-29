var message = require('../utils/message');

var math = require('../utils/math');

var type = 'l'.charCodeAt(0);

exports.build = function (rank, players, top) {
	var arr;
    var length = 0;
    for (var i = 0, len = top.length; i < len; i++) {
        var player = top[i];
        length += player.snake.name.length;
    }
    arr = new Uint8Array((8 + length) + (top.length * 7));
    var b = 0;
    b += message.writeInt8(b, arr, 0);
    b += message.writeInt8(b, arr, 0);
    b += message.writeInt8(b, arr, type);
    b += message.writeInt8(b, arr, rank > 10 ? 0 : rank);
    b += message.writeInt16(b, arr, rank);
    b += message.writeInt16(b, arr, players);
    i = 0;
    while (i < top.length) {
        b += message.writeInt16(b, arr, top[i].snake.sct);
        b += message.writeInt24(b, arr, top[i].snake.fam);
        b += message.writeInt8(b, arr, math.randomInt(0, 8));
        b += message.writeInt8(b, arr, top[i].snake.name.length);
        b += message.writeString(b, arr, top[i].snake.name);
        i++;
    }
    return arr;
};
