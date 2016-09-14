H5.renderRectangle = (function (Math) {
    "use strict";

    function renderRectangle(ctx, drawable) {
        var x = drawable.justHeightScale ? drawable.x - Math.floor(drawable.__getWidth() / 2) - 0.5 :
        drawable.getCornerX() - 0.5;
        var y = drawable.justWidthScale ? drawable.y - Math.floor(drawable.__getHeight() / 2) - 0.5 :
        drawable.getCornerY() - 0.5;
        var width = drawable.justHeightScale ? Math.floor(drawable.__getWidth()) : drawable.getWidth();
        var height = drawable.justWidthScale ? Math.floor(drawable.__getHeight()) : drawable.getHeight();

        if (drawable.data.filled) {
            ctx.fillStyle = drawable.data.color;
            if (drawable.flipHorizontally) {
                ctx.fillRect(x * -1, y, width, height);
            } else {
                ctx.fillRect(x, y, width, height);
            }
        } else {
            if (drawable.data.lineDash !== undefined)
                ctx.setLineDash(drawable.data.lineDash);

            ctx.strokeStyle = drawable.data.color;
            if (drawable.data.lineWidth)
                ctx.lineWidth = drawable.data.lineWidth;
            if (drawable.flipHorizontally) {
                ctx.strokeRect(x * -1, y, width, height);
            } else {
                ctx.strokeRect(x, y, width, height);
            }
        }
    }

    return renderRectangle;
})(Math);
