H5.renderImage = (function () {
    "use strict";

    function renderImage(ctx, drawable) {
        ctx.drawImage(drawable.data.img, drawable.getCornerX(), drawable.getCornerY(), drawable.getWidth(),
            drawable.getHeight());
    }

    return renderImage;
})();