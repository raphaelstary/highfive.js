var renderLine = (function () {
    "use strict";

    function renderLine(ctx, drawable) {
        ctx.beginPath();
        ctx.moveTo(drawable.data.xPointA, drawable.data.yPointA);
        ctx.lineTo(drawable.data.xPointB, drawable.data.yPointB);
        ctx.stroke();
    }

    return renderLine;
})();
