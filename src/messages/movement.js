var message = require('../utils/message');

var type = 'G'.charCodeAt(0);

exports.build = function(id, x, y) {
	var arr = new Uint8Array(9);
	var b = 0;
	b += message.writeInt8(b, arr, 0);
	b += message.writeInt8(b, arr, 0);
	b += message.writeInt8(b, arr, type);
	b += message.writeInt16(b, arr, id);
	b += message.writeInt8(b, arr, x);
	b += message.writeInt8(b, arr, y);
	return arr;
};