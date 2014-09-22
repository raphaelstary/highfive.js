var CanvasText = (function () {
    "use strict";

    function CanvasText(msg, size, fontFamily, color, maxLineLength, lineHeight) {
        this.msg = msg;
        this.size = size;
        this.fontFamily = fontFamily;
        this.color = color;
        this.maxLineLength = maxLineLength;
        this.lineHeight = lineHeight;
    }

    return CanvasText;
})();