var Drawables = (function (Drawable, CanvasText) {
    "use strict";

    function createNew(atlasMapper, seed, x, y, imgPathName, zIndex) {
        var subImage = atlasMapper.get(imgPathName);

        return new Drawable(imgPathName + seed, x, y, subImage, null, zIndex);
    }

    function createNewText(seed, x, y, zIndex, msg, size, fontFamily, color, rotation) {
        var txt = new CanvasText(msg, size, fontFamily, color, rotation);

        return new Drawable(generateHash(msg) + seed, x, y, null, txt, zIndex);
    }

    function generateHash(s) {
        return s.split("").reduce(function (a, b) {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a
        }, 0);
    }

    return {
        get: createNew,
        getTxt: createNewText
    };
})(Drawable, CanvasText);