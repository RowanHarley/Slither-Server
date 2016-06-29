var message = require('../utils/message');

var type = 'm'.charCodeAt(0);

exports.build = function (text, text2) {
    var arr, b;
    arr = new Uint8Array(10 + text.length + text2.length);
 // console.log(Math.floor(15 * (14.516542058039644 + 0.7810754645511785 / 0.9249846824962366 - 1) - 5) / 1);
    b = 0;
    b += message.writeInt8(b, arr, 0);
    b += message.writeInt8(b, arr, 0);
    b += message.writeInt8(b, arr, type);
    b += message.writeInt24(b, arr, 306);
    b += message.writeInt24(b, arr, 0.7810754645511785 * 16777215);
    b += message.writeInt8(b, arr, text.length);
    b += message.writeString(b, arr, text);
    b += message.writeString(b, arr, text2);
    return arr;
};
