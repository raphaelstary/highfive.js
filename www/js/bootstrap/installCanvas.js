var installCanvas = (function (document) {
    "use strict";

    function installCanvas() {
        var canvas = document.createElement('canvas');
        document.body.appendChild(canvas);

        return canvas;
    }

    return installCanvas;
})(window.document);