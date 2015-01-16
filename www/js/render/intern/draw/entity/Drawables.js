var Drawables = (function (Drawable, TextWrapper, Rectangle, RectangleMask, Circle, DrawableLine) {
    "use strict";

    function createNewGfx(gfxCache, seed, x, y, imgPathName, zIndex, alpha, rotation, scale) {
        var gfx = gfxCache.get(imgPathName);

        return new Drawable(imgPathName + seed, x, y, gfx, zIndex, alpha, rotation, scale);
    }

    function createNewText(seed, x, y, zIndex, msg, size, fontFamily, color, rotation, alpha, maxLineLength, lineHeight,
        scale) {
        var txt = new TextWrapper(msg, size, fontFamily, color, maxLineLength, lineHeight);

        return new Drawable(generateHash(msg) + seed, x, y, txt, zIndex, alpha, rotation, scale);
    }

    function generateHash(s) {
        return s.split("").reduce(function (a, b) {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a
        }, 0);
    }

    function createRectangle(seed, x, y, width, height, color, filled, lineWidth, zIndex, alpha, rotation, scale) {
        var rect = new Rectangle(width, height, color, filled, lineWidth);
        return new Drawable(generateHash(x + y + width + height + color + filled) + seed, x, y, rect, zIndex, alpha,
            rotation, scale);
    }

    function createClippingMask(x, y, width, height) {
        return new RectangleMask(x, y, width, height);
    }

    function createCircle(seed, x, y, radius, color, filled, lineWidth, zIndex, alpha, rotation, scale) {
        var circle = new Circle(radius, color, filled, lineWidth);
        return new Drawable(generateHash(x + y + radius + color + filled) + seed, x, y, circle, zIndex, alpha,
            rotation, scale);
    }

    function createLine(seed, x, y, length, color, lineWidth, zIndex, alpha, rotation, scale) {
        var line = new DrawableLine(length, color, lineWidth);
        return new Drawable(generateHash(x + y + length + color) + seed, x, y, line, zIndex, alpha,
            rotation, scale);
    }

    return {
        getGraphic: createNewGfx,
        getTxt: createNewText,
        getRect: createRectangle,
        getMask: createClippingMask,
        getCircle: createCircle,
        getLine: createLine
    };
})(Drawable, TextWrapper, Rectangle, RectangleMask, Circle, DrawableLine);