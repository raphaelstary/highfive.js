var Drawables = (function (Drawable, TextWrapper) {
    "use strict";

    function createNewGfx(gfxCache, seed, x, y, imgPathName, zIndex, alpha, rotation, scale) {
        var gfx = gfxCache.get(imgPathName);

        return new Drawable(imgPathName + seed, x, y, gfx, null, zIndex, alpha, rotation, scale);
    }

    function createNewText(seed, x, y, zIndex, msg, size, fontFamily, color, rotation, alpha, maxLineLength, lineHeight,
        scale) {
        var txt = new TextWrapper(msg, size, fontFamily, color, maxLineLength, lineHeight);

        return new Drawable(generateHash(msg) + seed, x, y, null, txt, zIndex, alpha, rotation, scale);
    }

    function generateHash(s) {
        return s.split("").reduce(function (a, b) {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a
        }, 0);
    }

    return {
        getGraphic: createNewGfx,
        getTxt: createNewText
    };
})(Drawable, TextWrapper);