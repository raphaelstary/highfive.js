H5.renderABLine = (function () {
    "use strict";

    function renderABLine(ctx, drawable) {
        ctx.beginPath();

        var line = drawable.data;
        ctx.moveTo(line.ax, line.ay);
        ctx.lineTo(line.bx, line.by);

        ctx.strokeStyle = drawable.data.color;

        if (drawable.data.lineWidth)
            ctx.lineWidth = drawable.data.lineWidth;

        if (drawable.data.lineCap)
            ctx.lineCap = drawable.data.lineCap;

        ctx.stroke();
    }

    return renderABLine;
})();
