var message = require('../utils/message');

var type = 'W'.charCodeAt(0);

exports.build = function (x, y) {
    var arr = new Uint8Array(8);
    var b = 0;
    b += message.writeInt8(b, arr, 0);
    b += message.writeInt8(b, arr, 0);
    b += message.writeInt8(b, arr, type);
    b += message.writeInt8(b, arr, x);
    b += message.writeInt8(b, arr, y);
    return arr;
};
