var TextWrapper = (function () {
    "use strict";

    function TextWrapper(msg, size, fontFamily, color, maxLineLength, lineHeight) {
        this.msg = msg;
        this.size = size;
        this.fontFamily = fontFamily;
        this.color = color;
        this.maxLineLength = maxLineLength;
        this.lineHeight = lineHeight;
    }

    return TextWrapper;
})();