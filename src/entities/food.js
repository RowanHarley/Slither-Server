module.exports = (function () {
 /*
 Section: Construction
 */
    function Food (id, position, size, color) {
        this.id = id;
        this.position = position;
        this.size = size;
        this.color = color;
    }

    return Food;
});
