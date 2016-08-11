module.exports = (function () {
 /*
 Section: Construction
 */
    function Snake (id, name, body, skin) {
        this.id = id;
        this.name = name;
        this.body = body;
        this.skin = skin;
        this.speed = 5.79;
        this.head = this.body; // This is why the snake dies when it reach's half way
        this.D = 5.69941607541398 / 2 / Math.PI * 16777215;
        this.X = this.D;
        this.length = 10;
        this.sct = 2;
        this.fam = 0 * 16777215;
        this.direction = {
            x: 1,
            y: 1,
            angle: ((0.033 * 1e3) * 0 * this.scang * this.spang)
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
        this.sc = Math.min(6, 1 + (this.parts.length - 2) / 106.0);
        this.scang = 0.13 + 0.87 * Math.pow((7 - this.sc) / 6, 2);
        this.spang = Math.min(this.speed / (4.8 * 10), 1);
    }
    return Snake;
})();
