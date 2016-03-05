H5.renderQuadrilateral = (function () {
    "use strict";

    function renderQuadrilateral(ctx, drawable) {

        ctx.beginPath();

        var q = drawable.data;
        ctx.moveTo(q.ax, q.ay);
        ctx.lineTo(q.bx, q.by);
        ctx.lineTo(q.cx, q.cy);
        ctx.lineTo(q.dx, q.dy);
        ctx.lineTo(q.ax, q.ay);

        ctx.closePath();

        if (q.filled) {
            ctx.fillStyle = q.color;
            ctx.fill();

        }
        if (q.lineWidth !== undefined && q.lineColor !== undefined) {
            ctx.lineWidth = q.lineWidth;
            ctx.strokeStyle = q.lineColor;
            ctx.stroke();
        }
    }

    return renderQuadrilateral;
})();