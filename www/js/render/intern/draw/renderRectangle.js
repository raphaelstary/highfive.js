var renderRectangle = (function () {
    "use strict";

    function renderRectangle(ctx, drawable) {
        if (drawable.data.filled) {
            ctx.fillStyle = drawable.data.color;
            ctx.fillRect(drawable.getCornerX(), drawable.getCornerY(), drawable.getWidth(), drawable.getHeight());
        } else {
            ctx.strokeStyle = drawable.data.color;
            if (drawable.data.lineWidth)
                ctx.lineWidth = drawable.data.lineWidth;
            ctx.strokeRect(drawable.getCornerX(), drawable.getCornerY(), drawable.getWidth(), drawable.getHeight());
        }
    }

    return renderRectangle;
})();
