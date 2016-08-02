H5.TextWrapper = (function () {
    "use strict";

    function TextWrapper(msg, size, fontFamily, color, fontStyle, maxLineLength, lineHeight) {
        this.msg = msg;
        this.size = size;
        this.fontFamily = fontFamily;
        this.color = color;
        this.fontStyle = fontStyle || 'normal';
        this.maxLineLength = maxLineLength;
        this.lineHeight = lineHeight;
    }

    return TextWrapper;
})();