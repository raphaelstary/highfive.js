var renderCircle = (function (Math) {
    "use strict";

    function renderCircle(ctx, drawable) {
        ctx.beginPath();
        ctx.arc(drawable.x, drawable.y, drawable.data.radius, 0, 2 * Math.PI);

        if (drawable.data.lineWidth)
            ctx.lineWidth = drawable.data.lineWidth;

        if (drawable.data.filled) {
            ctx.fillStyle = drawable.data.color;
            ctx.fill();

        } else {
            ctx.strokeStyle = drawable.data.color;
            ctx.stroke();
        }
    }

    return renderCircle;
})(Math);
