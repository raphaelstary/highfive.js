H5.renderAtlas = (function () {
    "use strict";

    function renderAtlas(ctx, drawable) {
        if (drawable.compositeOperation) {
            ctx.globalCompositeOperation = drawable.compositeOperation;
        }

        if (drawable.scale != 1) {
            ctx.drawImage(drawable.data.img, drawable.data.x, drawable.data.y, drawable.data.width,
                drawable.data.height, drawable.getCornerX(), drawable.getCornerY(), drawable.getWidth(),
                drawable.getHeight());
        } else {
            ctx.drawImage(drawable.data.img, drawable.data.x, drawable.data.y, drawable.data.width,
                drawable.data.height, drawable.x + drawable.data.scaledOffSetX,
                drawable.y + drawable.data.scaledOffSetY, drawable.data.scaledTrimmedWidth,
                drawable.data.scaledTrimmedHeight);
        }
    }

    return renderAtlas;
})();
