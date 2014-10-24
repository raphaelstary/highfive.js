var installCanvas = (function (document, innerWidth, innerHeight) {
    "use strict";

    function installCanvas() {
        var canvas = document.createElement('canvas');
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        document.body.appendChild(canvas);

        return canvas;
    }

    return installCanvas;
})(window.document, window.innerWidth, window.innerHeight);