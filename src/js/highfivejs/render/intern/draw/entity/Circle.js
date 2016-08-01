H5.Circle = (function () {
    "use strict";

    function Circle(radius, color, filled, lineWidth) {
        this.radius = radius;
        this.color = color;
        this.filled = filled !== undefined ? filled : false;
        this.lineWidth = lineWidth;
    }

    return Circle;
})();