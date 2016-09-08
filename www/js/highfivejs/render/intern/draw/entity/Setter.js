H5.Setter = (function (changeCoords) {
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
            drawable.scale = scale || 1;
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

        setTextStyle: function (drawable, style) {
            drawable.data.fontStyle = style;
            return drawable;
        },

        setPosition: function (addToResizer, screen, drawable, xFn, yFn, resizeDependencies) {
            drawable.x = xFn(screen.width, screen.height);
            drawable.y = yFn(screen.height, screen.width);

            addToResizer(drawable, function (width, height) {
                changeCoords(drawable, xFn(width, height), yFn(height, width));
            }, resizeDependencies);

            return drawable;
        },

        setQuadPosition: function (addToResizer, screen, drawable, property, xFn, yFn, resizeDependencies) {
            drawable.data[property + 'x'] = xFn(screen.width, screen.height);
            drawable.data[property + 'y'] = yFn(screen.height, screen.width);

            addToResizer(drawable, function (width, height) {
                drawable.data[property + 'x'] = xFn(width, height);
                drawable.data[property + 'y'] = yFn(height, width);
            }, resizeDependencies);

            return drawable;
        },

        setQuadTotal: function (addToResizer, screen, drawable, a_xFn, a_yFn, b_xFn, b_yFn, c_xFn, c_yFn, d_xFn, d_yFn,
            resizeDependencies) {
            drawable.data.ax = a_xFn(screen.width, screen.height);
            drawable.data.ay = a_yFn(screen.height, screen.width);
            drawable.data.bx = b_xFn(screen.width, screen.height);
            drawable.data.by = b_yFn(screen.height, screen.width);
            drawable.data.cx = c_xFn(screen.width, screen.height);
            drawable.data.cy = c_yFn(screen.height, screen.width);
            drawable.data.dx = d_xFn(screen.width, screen.height);
            drawable.data.dy = d_yFn(screen.height, screen.width);

            addToResizer(drawable, function (width, height) {
                drawable.data.ax = a_xFn(width, height);
                drawable.data.ay = a_yFn(height, width);
                drawable.data.bx = b_xFn(width, height);
                drawable.data.by = b_yFn(height, width);
                drawable.data.cx = c_xFn(width, height);
                drawable.data.cy = c_yFn(height, width);
                drawable.data.dx = d_xFn(width, height);
                drawable.data.dy = d_yFn(height, width);
            }, resizeDependencies);

            return drawable;
        },

        setTextSize: function (addToResizer, screen, drawable, sizeFn, resizeDependencies) {
            drawable.data.size = sizeFn(screen.width, screen.height);
            addToResizer(drawable, function (width, height) {
                drawable.data.size = sizeFn(width, height);
            }, resizeDependencies);

            return drawable;
        },

        setTextMaxLineLength: function (addToResizer, screen, drawable, maxLineLengthFn, resizeDependencies) {
            drawable.data.maxLineLength = maxLineLengthFn(screen.width, screen.height);
            addToResizer(drawable, function (width, height) {
                drawable.data.maxLineLength = maxLineLengthFn(width, height);
            }, resizeDependencies);

            return drawable;
        },

        setTextLineHeight: function (addToResizer, screen, drawable, lineHeightFn, resizeDependencies) {
            drawable.data.lineHeight = lineHeightFn(screen.height, screen.width);
            addToResizer(drawable, function (width, height) {
                drawable.data.lineHeight = lineHeightFn(height, width);
            }, resizeDependencies);

            return drawable;
        },

        setTextBaseLine: function (drawable, baseLineValue) {
            drawable.data.baseLine = baseLineValue;
        },

        setTextAlign: function (drawable, alignValue) {
            drawable.data.align = alignValue;
        },

        setLength: function (addToResizer, screen, drawable, lengthFn, resizeDependencies) {
            drawable.data.length = lengthFn(screen.width, screen.height);
            addToResizer(drawable, function (width, height) {
                drawable.data.length = lengthFn(width, height);
            }, resizeDependencies);

            return drawable;
        },

        setWidth: function (addToResizer, screen, drawable, widthFn, resizeDependencies) {
            drawable.data.width = widthFn(screen.width, screen.height);
            addToResizer(drawable, function (width, height) {
                drawable.data.width = widthFn(width, height);
            }, resizeDependencies);

            return drawable;
        },

        setHeight: function (addToResizer, screen, drawable, heightFn, resizeDependencies) {
            drawable.data.height = heightFn(screen.height, screen.width);
            addToResizer(drawable, function (width, height) {
                drawable.data.height = heightFn(height, width);
            }, resizeDependencies);

            return drawable;
        },

        setLineWidth: function (addToResizer, screen, drawable, lineWidthFn, resizeDependencies) {
            drawable.data.lineWidth = lineWidthFn(screen.width, screen.height);
            addToResizer(drawable, function (width, height) {
                drawable.data.lineWidth = lineWidthFn(width, height);
            }, resizeDependencies);

            return drawable;
        },

        setLineDash: function (addToResizer, screen, drawable, lineDashSet, resizeDependencies) {
            drawable.data.lineDash = [
                lineDashSet[0](screen.width, screen.height), lineDashSet[1](screen.width, screen.height)
            ];
            addToResizer(drawable, function (width, height) {
                drawable.data.lineDash[0] = lineDashSet[0](width, height);
                drawable.data.lineDash[1] = lineDashSet[1](width, height);
            }, resizeDependencies);

            return drawable;
        },

        setFilled: function (drawable, filled) {
            drawable.data.filled = filled;
            return drawable;
        },

        setRadius: function (addToResizer, screen, drawable, radiusFn, resizeDependencies) {
            drawable.data.radius = radiusFn(screen.width, screen.height);
            addToResizer(drawable, function (width, height) {
                drawable.data.radius = radiusFn(width, height);
            }, resizeDependencies);

            return drawable;
        },

        setAngle: function (drawable, angle) {
            drawable.data.angle = angle;
            return drawable;
        },

        setGraphic: function (stage, drawable, imgName) {
            drawable.data = stage.getGraphic(imgName);
            return drawable;
        },

        setMask: function (drawable, drawableShapeMask) {
            drawableShapeMask.hide();
            drawable.mask = drawableShapeMask;
        }
    };
})(H5.changeCoords);