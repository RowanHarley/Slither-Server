exports.randomInt = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

exports.randomSpawnPoint = function() {
	return {
		x: exports.randomInt(5000 * 5, 30000 * 5),
		y: exports.randomInt(5000 * 5, 30000 * 5)
	};
};

exports.chunk = function(arr, chunkSize) {
	var R, i;
	R = [];
	i = 0;
	while (i < arr.length) {
		R.push(arr.slice(i, i + chunkSize));
		i += chunkSize;
	}
	return R;
};