var message = require('../utils/message');

var type = 'e'.charCodeAt(0);

exports.build = function (id, snake) {
    var arr = new Uint8Array(8);
    message.writeInt8(2, arr, type);
    message.writeInt16(3, arr, id);
    message.writeInt8(5, arr, snake.direction.angle * 256 / (2*Math.PI));
    message.writeInt8(6, arr, snake.direction.angle * 256 / (2*Math.PI));
    message.writeInt8(7, arr, snake.speed * 18);
    return arr;
};
