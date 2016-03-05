H5.renderRectangle = (function () {
    "use strict";

    function renderRectangle(ctx, drawable) {
        if (drawable.data.filled) {
            ctx.fillStyle = drawable.data.color;
            if (drawable.flipHorizontally) {
                ctx.fillRect((drawable.getCornerX() - 0.5) * -1, drawable.getCornerY() - 0.5, drawable.getWidth(),
                    drawable.getHeight());
            } else {
                ctx.fillRect(drawable.getCornerX() - 0.5, drawable.getCornerY() - 0.5, drawable.getWidth(),
                    drawable.getHeight());
            }
        } else if (drawable.justHeightScale) {
            ctx.strokeStyle = drawable.data.color;
            if (drawable.data.lineWidth)
                ctx.lineWidth = drawable.data.lineWidth;

            ctx.strokeRect(drawable.x - Math.floor(drawable.__getWidth() / 2) - 0.5, drawable.getCornerY() - 0.5,
                Math.floor(drawable.__getWidth()), drawable.getHeight());

        } else {
            ctx.strokeStyle = drawable.data.color;
            if (drawable.data.lineWidth)
                ctx.lineWidth = drawable.data.lineWidth;
            if (drawable.flipHorizontally) {
                ctx.strokeRect((drawable.getCornerX() - 0.5) * -1, drawable.getCornerY() - 0.5, drawable.getWidth(),
                    drawable.getHeight());
            } else {
                ctx.strokeRect(drawable.getCornerX() - 0.5, drawable.getCornerY() - 0.5, drawable.getWidth(),
                    drawable.getHeight());
            }
        }
    }

    return renderRectangle;
})();
