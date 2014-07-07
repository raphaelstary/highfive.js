var CanvasText = (function () {
    "use strict";

    function CanvasText(msg, size, fontFamily, color, rotation) {
        this.msg = msg;
        this.size = size;
        this.fontFamily = fontFamily;
        this.color = color;
        this.rotation = rotation;
    }

    return CanvasText;
})();