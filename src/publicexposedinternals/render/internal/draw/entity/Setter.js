H5.Setter = (function (changeCoords, Math) {
    'use strict';

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
            drawable.x = Math.floor(xFn(screen.width, screen.height));
            drawable.y = Math.floor(yFn(screen.height, screen.width));

            addToResizer(drawable, function (width, height) {
                changeCoords(drawable, Math.floor(xFn(width, height)), Math.floor(yFn(height, width)));
            }, resizeDependencies);

            return drawable;
        },

        setAnchor: function (addToResizer, screen, drawable, xFn, yFn, resizeDependencies) {
            drawable.anchorOffsetX = Math.floor(xFn(screen.width, screen.height));
            drawable.anchorOffsetY = Math.floor(yFn(screen.height, screen.width));

            addToResizer(drawable, function (width, height) {
                drawable.anchorOffsetX = Math.floor(xFn(width, height));
                drawable.anchorOffsetY = Math.floor(yFn(height, width));
            }, resizeDependencies);

            return drawable;
        },

        setQuadPosition: function (addToResizer, screen, drawable, property, xFn, yFn, resizeDependencies) {
            drawable.data[property + 'x'] = Math.floor(xFn(screen.width, screen.height));
            drawable.data[property + 'y'] = Math.floor(yFn(screen.height, screen.width));

            addToResizer(drawable, function (width, height) {
                drawable.data[property + 'x'] = Math.floor(xFn(width, height));
                drawable.data[property + 'y'] = Math.floor(yFn(height, width));
            }, resizeDependencies);

            return drawable;
        },

        setQuadTotal: function (addToResizer, screen, drawable, a_xFn, a_yFn, b_xFn, b_yFn, c_xFn, c_yFn, d_xFn, d_yFn,
            resizeDependencies) {
            drawable.data.ax = Math.floor(a_xFn(screen.width, screen.height));
            drawable.data.ay = Math.floor(a_yFn(screen.height, screen.width));
            drawable.data.bx = Math.floor(b_xFn(screen.width, screen.height));
            drawable.data.by = Math.floor(b_yFn(screen.height, screen.width));
            drawable.data.cx = Math.floor(c_xFn(screen.width, screen.height));
            drawable.data.cy = Math.floor(c_yFn(screen.height, screen.width));
            drawable.data.dx = Math.floor(d_xFn(screen.width, screen.height));
            drawable.data.dy = Math.floor(d_yFn(screen.height, screen.width));

            addToResizer(drawable, function (width, height) {
                drawable.data.ax = Math.floor(a_xFn(width, height));
                drawable.data.ay = Math.floor(a_yFn(height, width));
                drawable.data.bx = Math.floor(b_xFn(width, height));
                drawable.data.by = Math.floor(b_yFn(height, width));
                drawable.data.cx = Math.floor(c_xFn(width, height));
                drawable.data.cy = Math.floor(c_yFn(height, width));
                drawable.data.dx = Math.floor(d_xFn(width, height));
                drawable.data.dy = Math.floor(d_yFn(height, width));
            }, resizeDependencies);

            return drawable;
        },

        setTextSize: function (addToResizer, screen, drawable, sizeFn, resizeDependencies) {
            drawable.data.size = Math.floor(sizeFn(screen.width, screen.height));
            addToResizer(drawable, function (width, height) {
                drawable.data.size = Math.floor(sizeFn(width, height));
            }, resizeDependencies);

            return drawable;
        },

        setTextMaxLineLength: function (addToResizer, screen, drawable, maxLineLengthFn, resizeDependencies) {
            drawable.data.maxLineLength = Math.floor(maxLineLengthFn(screen.width, screen.height));
            addToResizer(drawable, function (width, height) {
                drawable.data.maxLineLength = Math.floor(maxLineLengthFn(width, height));
            }, resizeDependencies);

            return drawable;
        },

        setTextLineHeight: function (addToResizer, screen, drawable, lineHeightFn, resizeDependencies) {
            drawable.data.lineHeight = Math.floor(lineHeightFn(screen.height, screen.width));
            addToResizer(drawable, function (width, height) {
                drawable.data.lineHeight = Math.floor(lineHeightFn(height, width));
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
            drawable.data.length = Math.floor(lengthFn(screen.width, screen.height));
            addToResizer(drawable, function (width, height) {
                drawable.data.length = Math.floor(lengthFn(width, height));
            }, resizeDependencies);

            return drawable;
        },

        setWidth: function (addToResizer, screen, drawable, widthFn, resizeDependencies) {
            drawable.data.width = Math.floor(widthFn(screen.width, screen.height));
            addToResizer(drawable, function (width, height) {
                drawable.data.width = Math.floor(widthFn(width, height));
            }, resizeDependencies);

            return drawable;
        },

        setHeight: function (addToResizer, screen, drawable, heightFn, resizeDependencies) {
            drawable.data.height = Math.floor(heightFn(screen.height, screen.width));
            addToResizer(drawable, function (width, height) {
                drawable.data.height = Math.floor(heightFn(height, width));
            }, resizeDependencies);

            return drawable;
        },

        setLineWidth: function (addToResizer, screen, drawable, lineWidthFn, resizeDependencies) {
            drawable.data.lineWidth = Math.floor(lineWidthFn(screen.width, screen.height));
            addToResizer(drawable, function (width, height) {
                drawable.data.lineWidth = Math.floor(lineWidthFn(width, height));
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
            drawable.data.radius = Math.floor(radiusFn(screen.width, screen.height));
            addToResizer(drawable, function (width, height) {
                drawable.data.radius = Math.floor(radiusFn(width, height));
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
})(H5.changeCoords, Math);
