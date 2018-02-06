H5.EquilateralTriangle = (function () {
    'use strict';

    function EquilateralTriangle(angle, radius, color, filled, lineWidth) {
        this.angle = angle;
        this.radius = radius;
        this.color = color;
        this.filled = filled === undefined ? false : filled;
        this.lineWidth = lineWidth;
    }

    return EquilateralTriangle;
})();
