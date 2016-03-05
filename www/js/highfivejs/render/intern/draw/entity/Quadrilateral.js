H5.Quadrilateral = (function () {
    "use strict";

    function Quadrilateral(ax, ay, bx, by, cx, cy, dx, dy, color, filled, lineWidth) {
        this.ax = ax;
        this.ay = ay;
        this.bx = bx;
        this.by = by;
        this.cx = cx;
        this.cy = cy;
        this.dx = dx;
        this.dy = dy;
        this.color = color;
        this.lineColor = '#000000';
        this.filled = filled !== undefined ? filled : false;
        this.lineWidth = lineWidth;
    }

    return Quadrilateral;
})();
