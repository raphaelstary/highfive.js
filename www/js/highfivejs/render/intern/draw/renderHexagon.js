H5.renderHexagon = (function (renderPolygon) {
    "use strict";

    function renderHexagon(ctx, drawable) {
        renderPolygon(ctx, drawable.x, drawable.y, drawable.data, 6);
    }

    return renderHexagon;
})(H5.renderPolygon);
