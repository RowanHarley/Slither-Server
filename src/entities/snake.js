var Snake, math;

math = require('../utils/math');

module.exports = Snake = (function() {

	/*
	Section: Construction
	*/
	function Snake(id, name, body, skin) {
		this.id = id;
		this.name = name;
		this.body = body;
		this.skin = skin;
		this.speed = 5.79 * 1e3;
		this.head = this.body;
		this.D = 5.69941607541398 / 2 / Math.PI * 16777215;
		this.X = this.D;
		this.length = 10;
		this.J = 306;
		this.I = 0.7810754645511785 * 16777215;
		this.direction = {
			x: 0.1,
			y: 0.1,
			angle: 0
		};
		this.parts = [];
		var i = 0;
		while (i < 20) {
			this.parts.push({
				x: i + 1,
				y: i + 2
			});
			i += 2;
		}
	}

	return Snake;

});