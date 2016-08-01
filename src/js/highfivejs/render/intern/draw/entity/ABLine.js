H5.ABLine = (function () {
    "use strict";

    function ABLine(ax, ay, bx, by, color, lineWidth) {
        this.ax = ax;
        this.ay = ay;
        this.bx = bx;
        this.by = by;
        this.color = color;
        this.lineWidth = lineWidth;
    }

    return ABLine;
})();
