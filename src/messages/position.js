var message = require('../utils/message');

var type = 'g'.charCodeAt(0);

exports.build = function (id, snake) {
    var arr = new Uint8Array(9);
    message.writeInt8(2, arr, type);
    message.writeInt16(3, arr, id);
    message.writeInt16(5, arr, snake.body.x);
    message.writeInt16(7, arr, snake.body.y);
    return arr;
};
