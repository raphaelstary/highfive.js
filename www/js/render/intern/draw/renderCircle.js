var renderCircle = (function (Math) {
    "use strict";

    function renderCircle(ctx, drawable) {
        ctx.beginPath();
        ctx.arc(drawable.x, drawable.y, drawable.data.radius, 0, 2 * Math.PI);

        if (drawable.data.fillColor) {
            ctx.fillStyle = drawable.data.fillColor;
            ctx.fill();
        }

        ctx.stroke();
    }

    return renderCircle;
})(Math);
