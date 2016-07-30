var message = require('../utils/message');

var type = 'h'.charCodeAt(0);

exports.build = function (id, fam) {
    var arr = new Uint8Array(8);
    message.writeInt8(2, arr, type);
    message.writeInt16(3, arr, id);
    message.writeInt24(5, arr, fam);
    return arr;
};
