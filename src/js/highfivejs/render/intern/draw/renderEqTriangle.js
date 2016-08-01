H5.renderEqTriangle = (function (renderPolygon) {
    "use strict";

    function renderEqTriangle(ctx, drawable) {
        renderPolygon(ctx, drawable.x, drawable.y, drawable.data, 3, drawable.scale);
    }

    return renderEqTriangle;
})(H5.renderPolygon);