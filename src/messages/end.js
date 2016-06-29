var message = require('../utils/message');

exports.build = function (endNum) {
    var arr = new Uint8Array(4);

    var b = 0;

    b += message.writeInt8(b, arr, 0);

    b += message.writeInt8(b, arr, 0);

    b += message.writeInt8(b, arr, 'v'.charCodeAt(0));
 // 0-2; 0 is normal death, 1 is new highscore of the day, 2 is unknown
    b += message.writeInt8(b, arr, endNum);

    return arr;
};

