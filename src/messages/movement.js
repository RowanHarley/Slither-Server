var message = require('../utils/message');

var type = 'G'.charCodeAt(0);

exports.build = function (id, snake) {
    var arr = new Uint8Array(7);
    message.writeInt8(2, arr, type);
    message.writeInt16(3, arr, id);
    message.writeInt8(5, arr, snake.direction.x);
    message.writeInt8(6, arr, snake.direction.y);
    return arr;
};
