H5.HexViewHelper = (function (Height, Math) {
    "use strict";

    function HexViewHelper(stage, device, xTilesCount, yTilesCount, topOffset, bottomOffset) {
        this.stage = stage;
        this.device = device;
        this.xTiles = xTilesCount;
        this.yTiles = yTilesCount;
        this.topOffset = topOffset;
        this.bottomOffset = bottomOffset;
    }

    HexViewHelper.prototype.__hexHeight = function (height) {
        if (this.bottomOffset) {
            return Height.get(this.yTiles)(height - (this.__getTopOffset(height) + this.bottomOffset(height)));
        } else if (this.topOffset) {
            return Height.get(this.yTiles)(height - this.__getTopOffset(height));
        } else {
            return Height.get(this.yTiles)(height);
        }
    };

    HexViewHelper.prototype.__narrowWidth = function (height) {
        return this.__hexHeight(height) / Math.sqrt(3) * 2;
    };

    HexViewHelper.prototype.getHeightFn = function () {
        return (function (self) {
            return function (width, height) {
                return self.__hexHeight(height);
            }
        })(this);
    };

    HexViewHelper.prototype.getPosition = function (u, v) {
        return {
            x: this.__getX(u)(this.device.width, this.device.height),
            y: this.__getY(u, v)(this.device.height)
        };
    };

    HexViewHelper.prototype.__getX = function (u) {
        var self = this;
        return function (width, height) {
            var narrowWidth = self.__narrowWidth(height);
            return narrowWidth * u + self.__xOffset(width, narrowWidth);
        };
    };

    HexViewHelper.prototype.__getY = function (u, v) {
        var self = this;
        return function (height) {
            return Math.floor(self.__hexHeight(height) * (u * 0.5 + v) + self.__getTopOffset(height));
        };
    };

    HexViewHelper.prototype.__getTopOffset = function (height) {
        return this.topOffset(height);
    };

    HexViewHelper.prototype.__xOffset = function (width, narrowWidth) {
        var tilesHalf = Math.floor(this.xTiles / 2);
        var gridWidth = tilesHalf * narrowWidth + tilesHalf * narrowWidth / 2;
        if (this.xTiles % 2 != 0)
            gridWidth += narrowWidth;

        return Math.floor(width / 2 - gridWidth / 2 + narrowWidth / 2);
    };

    return HexViewHelper;
})(H5.Height, Math);