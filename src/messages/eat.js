var message = require('../utils/message');

var type = 'h'.charCodeAt(0);

exports.build = function (id, fam) {
    var arr = new Uint8Array(8);
    var b = 0;
    b += message.writeInt8(b, arr, 0);
    b += message.writeInt8(b, arr, 0);
    b += message.writeInt8(b, arr, type);
    b += message.writeInt16(b, arr, id);
    b += message.writeInt24(b, arr, fam);
    return arr;
};
