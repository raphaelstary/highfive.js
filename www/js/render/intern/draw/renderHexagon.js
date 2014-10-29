var renderHexagon = (function (renderPolygon, Math) {
    "use strict";

    function renderHexagon(ctx, drawable) {
        renderPolygon(ctx, drawable.x, drawable.y, drawable.data.radius, 6, -Math.PI / 2)
    }

    return renderHexagon;
})(renderPolygon, Math);
