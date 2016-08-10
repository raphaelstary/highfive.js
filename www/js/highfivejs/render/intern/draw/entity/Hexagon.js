H5.Hexagon = (function () {
    "use strict";

    function Hexagon(angle, radius, color, filled, lineWidth) {
        this.angle = angle;
        this.radius = radius;
        this.color = color;
        this.filled = filled !== undefined ? filled : false;
        this.lineWidth = lineWidth;
    }

    return Hexagon;
})();