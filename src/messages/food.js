var message = require('../utils/message');

var type = 'F'.charCodeAt(0);

exports.build = function (foods) {
    var arr = new Uint8Array(3 + (6 * foods.length));
    message.writeInt8(2, arr, type);
    var i = 0;
    while (i < foods.length) {
        var food = foods[i];
        message.writeInt8(3 + i * 6, arr, food.color);
        message.writeInt16(4 + i * 6, arr, food.position.x);
        message.writeInt16(6 + i * 6, arr, food.position.y);
        message.writeInt8(8 + i * 6, arr, food.size);
        i++;
    }
    return arr;
};
