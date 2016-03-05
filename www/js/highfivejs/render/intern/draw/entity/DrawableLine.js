H5.DrawableLine = (function () {
    "use strict";

    function DrawableLine(length, color, lineWidth) {
        this.length = length;
        this.color = color;
        this.lineWidth = lineWidth;
    }

    return DrawableLine;
})();