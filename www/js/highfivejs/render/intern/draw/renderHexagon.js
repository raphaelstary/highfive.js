var renderHexagon = (function (renderPolygon, Math) {
    "use strict";

    function renderHexagon(ctx, drawable) {
        renderPolygon(ctx, drawable.x, drawable.y, drawable.data, 6);
    }

    return renderHexagon;
})(renderPolygon, Math);
