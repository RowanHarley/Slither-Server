var message = require('../utils/message');

var type = 'F'.charCodeAt(0);

exports.build = function (foods) {
    var arr = new Uint8Array(3 + (6 * foods.length));
    var b = 0;
    b += message.writeInt8(b, arr, 0);
    b += message.writeInt8(b, arr, 0);
    b += message.writeInt8(b, arr, type);
    var i = 0;
    while (i < foods.length) {
        var food = foods[i];
        b += message.writeInt8(b, arr, food.color);
        b += message.writeInt16(b, arr, food.position.x);
        b += message.writeInt16(b, arr, food.position.y);
        b += message.writeInt8(b, arr, food.size);
        i++;
    }
    return arr;
};
