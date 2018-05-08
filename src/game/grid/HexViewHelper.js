H5.HexViewHelper = (function (Width, Math) {
    'use strict';

    function HexViewHelper(visuals, xTilesCount, yTilesCount, topOffset, bottomOffset, adjustCenter) {
        this.visuals = visuals;
        this.xTiles = xTilesCount;
        this.yTiles = yTilesCount;
        this.topOffset = topOffset;
        this.bottomOffset = bottomOffset;
        this.adjustCenter = adjustCenter;
    }

    var POINTY_TOPPED_ANGLE = Math.PI / 6;

    /**
     * get side length t - also known as size
     * @param width
     * @param height
     * @returns {number}
     */
    HexViewHelper.prototype.getSize = function (width, height) {
        return this.getWidth(width, height) / Math.sqrt(3);
    };

    HexViewHelper.prototype.getWidth = function (width, height) {
        var calcWidth = Width.get(this.xTiles + 0.5)(width);

        var sqrt3 = Math.sqrt(3);
        var tCount = this.yTiles * 2;
        var totalHeight = calcWidth / sqrt3 * tCount;
        if (totalHeight * 0.9 > height) {
            return Math.floor(height / tCount * sqrt3);
        }
        return calcWidth;
    };

    HexViewHelper.prototype.getXFn = function (u, v) {
        return (function (thisArg) {
            return function (width, height) {
                var calcWidth = thisArg.getWidth(width, height);
                var xOffset = 0;
                var totalWidth = calcWidth * thisArg.xTiles;
                if (totalWidth < width) {
                    xOffset = (width - totalWidth) / 2;
                }
                if (thisArg.adjustCenter) {
                    return Math.floor(thisArg.getSize(width, height) * Math.sqrt(3) * (u + 0.5 * (v & 1)) + xOffset);
                }
                return Math.floor(thisArg.getSize(width, height) * Math.sqrt(3) * (u + 0.5 * (v & 1)) + xOffset
                    + calcWidth / 2);
            };
        })(this);
    };

    HexViewHelper.prototype.getYFn = function (v) {
        return (function (thisArg) {
            return function (height, width) {
                var size = thisArg.getSize(width, height);
                var yOffset = 0;
                var totalHeight = size * thisArg.yTiles * 2;
                if (totalHeight < height) {
                    yOffset = (height - totalHeight) / 2;
                }
                return Math.floor(size * 3 / 2 * v + size + thisArg.topOffset(height) / 2 + yOffset);
            };
        })(this);
    };

    HexViewHelper.prototype.create = function (u, v) {
        return this.visuals.createHexagon()
            .setPosition(this.getXFn(u, v), this.getYFn(v))
            .setRadius(this.getSize.bind(this))
            .setAngle(POINTY_TOPPED_ANGLE);
    };

    return HexViewHelper;
})(H5.Width, Math);
