var measureText = (function () {
    "use strict";

    function measureText(canvasText) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');

        if (canvasText.alpha || canvasText.alpha === 0) {
            ctx.globalAlpha = canvasText.alpha;
        }

        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillStyle = canvasText.color;
        ctx.font = canvasText.size + 'px ' + canvasText.fontFamily;

//        if (canvasText.rotation) {
//            ctx.translate(elem.x, elem.y);
//            ctx.rotate(canvasText.rotation);
//            ctx.translate(-elem.x, -elem.y);
//        }

        var textMetrics = ctx.measureText(canvasText.msg);

        return {
            width: textMetrics.width,
            height: canvasText.size
        };
    }

    return measureText;
})();