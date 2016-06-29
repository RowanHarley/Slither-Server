var message = require('../utils/message');

var type = 'e'.charCodeAt(0);

exports.build = function (id, direction) {
    var arr = new Uint8Array(7);
    var b = 0;
    b += message.writeInt8(b, arr, 0);
    b += message.writeInt8(b, arr, 0);
    b += message.writeInt8(b, arr, type);
    b += message.writeInt16(b, arr, id);
    b += message.writeInt8(b, arr, direction.angle);
    b += message.writeInt8(b, arr, 104);
    b += message.writeInt8(b, arr, 1);
    return arr;
};
