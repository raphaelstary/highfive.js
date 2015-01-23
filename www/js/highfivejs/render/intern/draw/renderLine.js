var renderLine = (function () {
    "use strict";

    function renderLine(ctx, drawable) {
        ctx.beginPath();
        ctx.moveTo(drawable.getCornerX(), drawable.getCornerY());
        ctx.lineTo(drawable.getEndX(), drawable.getEndY());
        ctx.strokeStyle = drawable.data.color;
        if (drawable.data.lineWidth)
            ctx.lineWidth = drawable.data.lineWidth;
        ctx.stroke();
    }

    return renderLine;
})();
