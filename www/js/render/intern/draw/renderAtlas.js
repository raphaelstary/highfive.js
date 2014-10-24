var renderAtlas = (function () {
    "use strict";

    function renderAtlas(ctx, drawable) {
        if (drawable.scale != 1) {
            ctx.drawImage(drawable.data.img, drawable.data.x, drawable.data.y, drawable.data.width,
                drawable.data.height, drawable.getCornerX(), drawable.getCornerY(), drawable.getWidth(),
                drawable.getHeight());
        } else {
            ctx.drawImage(drawable.data.img, drawable.data.x, drawable.data.y, drawable.data.width,
                drawable.data.height, drawable.x + drawable.data.offSetX, drawable.y + drawable.data.offSetY,
                drawable.data.trimmedTileWidth, drawable.data.trimmedTileHeight);
        }
    }

    return renderAtlas;
})();
