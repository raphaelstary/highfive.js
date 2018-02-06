H5.measureText = (function () {
    'use strict';

    function measureText(ctx, text) {

        if (text.alpha || text.alpha === 0) {
            ctx.globalAlpha = text.alpha;
        }

        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillStyle = text.color;
        ctx.font = text.size + 'px ' + text.fontFamily;

        var textMetrics = ctx.measureText(text.msg);

        return {
            width: textMetrics.width,
            height: text.size
        };
    }

    return measureText;
})();
