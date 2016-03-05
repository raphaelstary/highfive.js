H5.renderCurve = (function () {
    "use strict";

    function renderCurve(ctx, drawable) {
        ctx.beginPath();
        ctx.moveTo(drawable.data.xPointA, drawable.data.yPointA);
        ctx.bezierCurveTo(drawable.data.xPointB, drawable.data.yPointB, drawable.data.xPointC, drawable.data.yPointC,
            drawable.data.xPointD, drawable.data.yPointD);
        ctx.closePath();
        ctx.stroke();
    }

    return renderCurve;
})();
