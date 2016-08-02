H5.EquilateralTriangle = (function () {
    "use strict";

    function EquilateralTriangle(angle, radius, color, filled, lineWidth) {
        this.angle = angle;
        this.radius = radius;
        this.color = color;
        this.filled = filled !== undefined ? filled : false;
        this.lineWidth = lineWidth;
    }

    return EquilateralTriangle;
})();