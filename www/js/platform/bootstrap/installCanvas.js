var installCanvas = (function (document) {
    "use strict";

    function installCanvas(width, height, pixelRatio) {
        var canvas = document.createElement('canvas');
        if (pixelRatio > 1) {
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            canvas.width = width * pixelRatio;
            canvas.height = height * pixelRatio;
        } else {
            canvas.width = width;
            canvas.height = height;
        }
        document.body.appendChild(canvas);

        return canvas;
    }

    return installCanvas;
})(window.document);