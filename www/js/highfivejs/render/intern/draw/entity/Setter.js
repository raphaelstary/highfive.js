var Setter = (function (changeCoords) {
    "use strict";

    return {
        setAlpha: function (drawable, alpha) {
            drawable.alpha = alpha;
            return drawable;
        },

        setRotation: function (drawable, rotation) {
            drawable.rotation = rotation;
            return drawable;
        },

        setScale: function (drawable, scale) {
            drawable.scale = scale;
            return drawable;
        },

        setColor: function (drawable, color) {
            drawable.data.color = color;
            return drawable;
        },

        setTextMessage: function (drawable, msg) {
            drawable.data.msg = msg;
            return drawable;
        },

        setTextFont: function (drawable, font) {
            drawable.data.fontFamily = font;
            return drawable;
        },

        setPosition: function (resizer, screen, drawable, xFn, yFn, resizeDependencies) {
            drawable.x = xFn(screen.width, screen.height);
            drawable.y = yFn(screen.height, screen.width);

            resizer.add(drawable, function (width, height) {
                changeCoords(drawable, xFn(width, height), yFn(height, width));
            }, resizeDependencies);

            return drawable;
        },

        setTextSize: function (resizer, screen, drawable, sizeFn, resizeDependencies) {
            drawable.data.size = sizeFn(screen.width, screen.height);
            resizer.add(drawable, function (width, height) {
                drawable.data.size = sizeFn(width, height);
            }, resizeDependencies);

            return drawable;
        },

        setTextMaxLineLength: function (resizer, screen, drawable, maxLineLengthFn, resizeDependencies) {
            drawable.data.maxLineLength = maxLineLengthFn(screen.width, screen.height);
            resizer.add(drawable, function (width, height) {
                drawable.data.maxLineLength = maxLineLengthFn(width, height);
            }, resizeDependencies);

            return drawable;
        },

        setTextLineHeight: function (resizer, screen, drawable, lineHeightFn, resizeDependencies) {
            drawable.data.lineHeight = lineHeightFn(screen.height, screen.width);
            resizer.add(drawable, function (width, height) {
                drawable.data.lineHeight = lineHeightFn(height, width);
            }, resizeDependencies);

            return drawable;
        },

        setWidth: function (resizer, screen, drawable, widthFn, resizeDependencies) {
            drawable.data.width = widthFn(screen.width, screen.height);
            resizer.add(drawable, function (width, height) {
                drawable.data.width = widthFn(width, height);
            }, resizeDependencies);

            return drawable;
        },

        setHeight: function (resizer, screen, drawable, heightFn, resizeDependencies) {
            drawable.data.height = heightFn(screen.height, screen.width);
            resizer.add(drawable, function (width, height) {
                drawable.data.height = heightFn(height, width);
            }, resizeDependencies);

            return drawable;
        },

        setLineWidth: function (resizer, screen, drawable, lineWidthFn, resizeDependencies) {
            drawable.data.lineWidth = lineWidthFn(screen.width, screen.height);
            resizer.add(drawable, function (width, height) {
                drawable.data.lineWidth = lineWidthFn(width, height);
            }, resizeDependencies);
        },

        setFilled: function (drawable, filled) {
            drawable.data.filled = filled;
            return drawable;
        }
    };
})(changeCoords);