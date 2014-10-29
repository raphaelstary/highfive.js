var renderRectangle = (function () {
    "use strict";

    function renderRectangle(ctx, drawable) {
        ctx.strokeRect(drawable.getCornerX(), drawable.getCornerY(), drawable.getWidth(), drawable.getHeight());
    }

    return renderRectangle;
})();
