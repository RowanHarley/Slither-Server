var message = require('../utils/message');

exports.build = function(){
	var arr = new Uint8Array(4);

	var b = 0;

	b += message.writeInt8(b, arr, 0);

	b += message.writeInt8(b, arr, 0);

	b += message.writeInt8(b, arr, 'v'.charCodeAt(0));

	b += message.writeInt8(b, arr, 1);
};

