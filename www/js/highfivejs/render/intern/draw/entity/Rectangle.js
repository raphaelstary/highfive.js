H5.Rectangle = (function () {
    "use strict";

    function Rectangle(width, height, color, filled, lineWidth) {
        this.width = width;
        this.height = height;
        this.color = color;
        this.filled = filled !== undefined ? filled : false;
        this.lineWidth = lineWidth;
    }

    return Rectangle;
})();
