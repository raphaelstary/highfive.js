var installCanvas = (function (document, innerWidth, innerHeight, getDevicePixelRatio) {
    "use strict";

    function installCanvas() {
        var canvas = document.createElement('canvas');
        var pixelRatio = getDevicePixelRatio();
        if (pixelRatio > 1) {
            canvas.style.width = innerWidth + 'px';
            canvas.style.height = innerHeight + 'px';
            canvas.width = innerWidth * pixelRatio;
            canvas.height = innerHeight * pixelRatio;
        } else {
            canvas.width = innerWidth;
            canvas.height = innerHeight;
        }
        document.body.appendChild(canvas);

        return canvas;
    }

    return installCanvas;
})(window.document, window.innerWidth, window.innerHeight, getDevicePixelRatio);