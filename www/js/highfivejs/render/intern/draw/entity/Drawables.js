H5.Drawables = (function (Drawable, TextWrapper, Rectangle, RectangleMask, Circle, DrawableLine, EquilateralTriangle,
    Quadrilateral, ABLine, Hexagon) {
    "use strict";

    function createNewGfx(gfxCache, seed, x, y, imgPathName, zIndex, alpha, rotation, scale) {
        var gfx = gfxCache.get(imgPathName);

        return new Drawable(imgPathName + seed, x, y, gfx, zIndex, alpha, rotation, scale);
    }

    function createNewText(seed, x, y, zIndex, msg, size, fontFamily, color, rotation, alpha, fontStyle, maxLineLength,
        lineHeight, scale) {
        var txt = new TextWrapper(msg, size, fontFamily, color, fontStyle, maxLineLength, lineHeight);

        return new Drawable(generateHash(x.toString() + y + msg + size) +
            seed, x, y, txt, zIndex, alpha, rotation, scale);
    }

    function generateHash(s) {
        return s.split("").reduce(function (a, b) {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a
        }, 0);
    }

    function createRectangle(seed, x, y, width, height, color, filled, lineWidth, zIndex, alpha, rotation, scale) {
        var rect = new Rectangle(width, height, color, filled, lineWidth);
        return new Drawable(generateHash(x.toString() + y + width + height + color) +
            seed, x, y, rect, zIndex, alpha, rotation, scale);
    }

    function createQuadrilateral(seed, ax, ay, bx, by, cx, cy, dx, dy, color, filled, lineWidth, zIndex, alpha,
        rotation, scale) {
        var quad = new Quadrilateral(ax, ay, bx, by, cx, cy, dx, dy, color, filled, lineWidth);
        return new Drawable(generateHash(ay.toString(), bx, by, cx, cy, dx, dy + color) +
            seed, 0, 0, quad, zIndex, alpha, rotation, scale);
    }

    function createABLine(seed, ax, ay, bx, by, color, lineWidth, zIndex, alpha, rotation, scale) {
        var line = new ABLine(ax, ay, bx, by, color, lineWidth);
        return new Drawable(generateHash(ay.toString(), bx, by + color) +
            seed, 0, 0, line, zIndex, alpha, rotation, scale);
    }

    function createClippingMask(x, y, width, height) {
        return new RectangleMask(x, y, width, height);
    }

    function createCircle(seed, x, y, radius, color, filled, lineWidth, zIndex, alpha, rotation, scale) {
        var circle = new Circle(radius, color, filled, lineWidth);
        return new Drawable(generateHash(x.toString() + y + radius + color) +
            seed, x, y, circle, zIndex, alpha, rotation, scale);
    }

    function createLine(seed, x, y, length, color, lineWidth, zIndex, alpha, rotation, scale) {
        var line = new DrawableLine(length, color, lineWidth);
        return new Drawable(generateHash(x.toString() + y + length + color) +
            seed, x, y, line, zIndex, alpha, rotation, scale);
    }

    function createEquilateralTriangle(seed, x, y, angle, radius, color, filled, lineWidth, zIndex, alpha, rotation,
        scale) {
        var triangle = new EquilateralTriangle(angle, radius, color, filled, lineWidth);
        return new Drawable(generateHash(x.toString() + y + angle + radius + color) +
            seed, x, y, triangle, zIndex, alpha, rotation, scale);
    }

    function createHexagon(seed, x, y, angle, radius, color, filled, lineWidth, zIndex, alpha, rotation, scale) {
        var hex = new Hexagon(angle, radius, color, filled, lineWidth);
        return new Drawable(generateHash(x.toString() + y + angle + radius + color) +
            seed, x, y, hex, zIndex, alpha, rotation, scale);
    }

    return {
        getGraphic: createNewGfx,
        getTxt: createNewText,
        getRect: createRectangle,
        getMask: createClippingMask,
        getCircle: createCircle,
        getLine: createLine,
        getEqTriangle: createEquilateralTriangle,
        getHexagon: createHexagon,
        getQuad: createQuadrilateral,
        getABLine: createABLine
    };
})(H5.Drawable, H5.TextWrapper, H5.Rectangle, H5.RectangleMask, H5.Circle, H5.DrawableLine, H5.EquilateralTriangle,
    H5.Quadrilateral, H5.ABLine, H5.Hexagon);