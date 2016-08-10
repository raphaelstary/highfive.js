H5.HexViewHelper = (function (Width, Math) {
    "use strict";

    function HexViewHelper(stage, xTilesCount, yTilesCount, xOffset, yOffset) {
        this.stage = stage;
        this.xTiles = xTilesCount;
        this.yTiles = yTilesCount;
        this.xOffset = xOffset;
        this.yOffset = yOffset;
    }

    var POINTY_TOPPED_ANGLE = Math.PI / 6;

    /**
     * get side length t - also known as size
     * @param width
     * @returns {number}
     */
    HexViewHelper.prototype.getSize = function (width) {
        return this.getWidth(width) / Math.sqrt(3);
    };

    HexViewHelper.prototype.getWidth = function (width) {
        return Width.get(this.xTiles + 0.5)(width - this.xOffset(width));
    };

    HexViewHelper.prototype.getXFn = function (u, v) {
        return (function (self) {
            return function (width) {
                return Math.floor(self.getSize(width) * Math.sqrt(3) * (u + 0.5 * (v & 1)) + self.getWidth(width) / 2 +
                    self.xOffset(width));
            };
        })(this);
    };

    HexViewHelper.prototype.getYFn = function (v) {
        return (function (self) {
            return function (height, width) {
                return Math.floor(self.getSize(width) * 3 / 2 * v + self.getSize(width) + self.yOffset(height));
            };
        })(this);
    };

    HexViewHelper.prototype.create = function (u, v) {
        return this.stage.createHexagon()
            .setPosition(this.getXFn(u, v), this.getYFn(v))
            .setRadius(this.getSize.bind(this))
            .setAngle(POINTY_TOPPED_ANGLE);
    };

    return HexViewHelper;
})(H5.Width, Math);