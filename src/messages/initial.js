var message = require('../utils/message.js');

var config = require('../../config/config.js');

var arr = new Uint8Array(26);

var b = 0;

b += message.writeInt8(b, arr, 0);

b += message.writeInt8(b, arr, 0);

b += message.writeInt8(b, arr, 'a'.charCodeAt(0));

b += message.writeInt24(b, arr, config['gameRadius']);

b += message.writeInt16(b, arr, 411);

b += message.writeInt16(b, arr, config['sectorSize']);

b += message.writeInt16(b, arr, 144);

b += message.writeInt8(b, arr, 4.8 * 10);

b += message.writeInt16(b, arr, 5.39 * 100);

b += message.writeInt16(b, arr, 0.4 * 100);

b += message.writeInt16(b, arr, 14 * 100);

b += message.writeInt16(b, arr, 0.033 * 1e3);

b += message.writeInt16(b, arr, 0.028 * 1e3);

b += message.writeInt16(b, arr, 0.43 * 1e3);

b += message.writeInt8(b, arr, 8);

module.exports = arr;
