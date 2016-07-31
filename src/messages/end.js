var message = require('../utils/message');

exports.build = function (endNum) {
    var arr = new Uint8Array(4);
    message.writeInt8(2, arr, 'v'.charCodeAt(0));
 // 0-2; 0 is normal death, 1 is new highscore of the day, 2 is unknown
    message.writeInt8(3, arr, endNum);

    return arr;
};

