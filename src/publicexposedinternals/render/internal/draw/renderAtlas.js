H5.renderAtlas = (function () {
    'use strict';

    function renderAtlas(ctx, drawable) {

        if (drawable.scale == 1) {

            var x = drawable.x + drawable.data.scaledOffSetX;
            var y = drawable.y + drawable.data.scaledOffSetY;

            ctx.drawImage(drawable.data.img, drawable.data.x, drawable.data.y, drawable.data.width,
                drawable.data.height, x, y, drawable.data.scaledTrimmedWidth, drawable.data.scaledTrimmedHeight);

        } else {
            ctx.drawImage(drawable.data.img, drawable.data.x, drawable.data.y, drawable.data.width,
                drawable.data.height, drawable.getCornerX(), drawable.getCornerY(), drawable.getWidth(),
                drawable.getHeight());
        }
    }

    return renderAtlas;
})();
