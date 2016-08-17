H5.GridViewHelper = (function (Height, Math, add) {
    "use strict";

    function GridViewHelper(stage, device, xTilesCount, yTilesCount, topOffset, bottomOffset) {
        this.stage = stage;
        this.device = device;
        this.xTiles = xTilesCount;
        this.yTiles = yTilesCount;
        this.topOffset = topOffset;
        this.bottomOffset = bottomOffset;

        this.baseScale = 1;
    }

    GridViewHelper.prototype.getEdgeLengthFn = function () {
        return (function (self) {
            return function (width, height) {
                return self.__edgeLength(height);
            }
        })(this);
    };

    GridViewHelper.prototype.getCoordinates = function (x, y) {

        var length = this.__edgeLength(this.device.height);
        return {
            u: Math.floor((x - this.__xOffset(this.device.width, length) + length / 2) / length),
            v: Math.floor((y - this.__getTopOffset(this.device.height)) / length)
        };
    };

    GridViewHelper.prototype.getCoordinatesWithScale = function (x, y, scale) {

        var length = this.__edgeLength(this.device.height);
        var u = Math.floor((x - this.__xOffset(this.device.width, length) + length / 2) / length);
        var v = Math.floor((y - this.__getTopOffset(this.device.height)) / length);

        function isHit(x, y, cornerX, endX, cornerY, endY) {
            return x > cornerX && x < endX && y > cornerY && y < endY;
        }

        var position = this.getPosition(u, v);
        var lengthHalfScaled = Math.floor(length / 2 * scale);

        if (isHit(x, y, position.x - lengthHalfScaled, position.x + lengthHalfScaled, position.y - lengthHalfScaled,
                position.y + lengthHalfScaled)) {

            return {
                u: u,
                v: v
            };
        }

        return false;
    };

    GridViewHelper.prototype.getPosition = function (u, v) {
        return {
            x: this.__getX(u)(this.device.width, this.device.height),
            y: this.__getY(v)(this.device.height)
        };
    };

    GridViewHelper.prototype.create = function (u, v, name, defaultTileHeight, xOffset, yOffset, dependencies) {
        return this.createBackground(u, v, name, 5, defaultTileHeight, xOffset, yOffset, dependencies);
    };

    GridViewHelper.prototype.createBackground = function (u, v, name, zIndex, defaultTileHeight, xOffset, yOffset,
        dependencies) {
        var drawable = this.stage.createImage(name);
        if (xOffset && yOffset) {
            drawable.setPosition(add(this.__getX(u), xOffset), add(this.__getY(v), yOffset), dependencies);
        } else if (xOffset) {
            drawable.setPosition(add(this.__getX(u), xOffset), this.__getY(v), dependencies);
        } else if (yOffset) {
            drawable.setPosition(this.__getX(u), add(this.__getY(v), yOffset), dependencies);
        } else {
            drawable.setPosition(this.__getX(u), this.__getY(v), dependencies);
        }
        if (zIndex !== 3)
            drawable.setZIndex(zIndex);
        if (defaultTileHeight) {
            var scaleFactor = drawable.data.height / defaultTileHeight;
            drawable.scale = this.__calcBaseScale(drawable.getHeight()) * scaleFactor;
        } else {
            drawable.scale = this.__calcBaseScale(drawable.getHeight());
        }

        return drawable;
    };

    GridViewHelper.prototype.__calcBaseScale = function (drawableHeight) {
        var length = this.__edgeLength(this.device.height);
        return length / drawableHeight;
    };

    GridViewHelper.prototype.createRect = function (u, v, color) {
        var self = this;

        function getWidth(width, height) {
            return self.__edgeLength(height) - 1;
        }

        function getHeight(height) {
            return self.__edgeLength(height) - 1;
        }

        return this.stage.createRectangle(true).setPosition(this.__getX(u), this.__getY(v)).setWidth(getWidth)
            .setHeight(getHeight).setColor(color);
    };

    GridViewHelper.prototype.createRectBackground = function (u, v, color, zIndex) {
        return this.createRect(u, v, color).setZIndex(zIndex);
    };

    GridViewHelper.prototype.move = function (drawable, u, v, speed, callback, xOffset, yOffset, dependencies) {
        if (xOffset && yOffset)
            return drawable.moveTo(add(this.__getX(u), xOffset), add(this.__getY(v), yOffset), dependencies)
                .setDuration(speed).setCallback(callback);
        if (xOffset)
            return drawable.moveTo(add(this.__getX(u), xOffset), this.__getY(v), dependencies).setDuration(speed)
                .setCallback(callback);
        if (yOffset)
            return drawable.moveTo(this.__getX(u), add(this.__getY(v), yOffset), dependencies).setDuration(speed)
                .setCallback(callback);
        return drawable.moveTo(this.__getX(u), this.__getY(v), dependencies).setDuration(speed).setCallback(callback);
    };

    GridViewHelper.prototype.setPosition = function (drawable, u, v, dependencies) {
        return drawable.setPosition(this.__getX(u), this.__getY(v), dependencies);
    };

    GridViewHelper.prototype.__edgeLength = function (height) {
        if (this.bottomOffset) {
            return Height.get(this.yTiles)(height - (this.__getTopOffset(height) + this.bottomOffset(height)));
        } else {
            return Height.get(this.yTiles)(height - this.__getTopOffset(height));
        }
    };

    GridViewHelper.prototype.__xOffset = function (width, length) {
        return Math.floor(width / 2 - length * this.xTiles / 2 + length / 2);
    };

    GridViewHelper.prototype.__getX = function (u) {
        var self = this;
        return function (width, height) {
            var length = self.__edgeLength(height);
            var start = self.__xOffset(width, length);
            return start + u * length;
        };
    };

    GridViewHelper.prototype.__getY = function (v) {
        var self = this;
        return function (height) {
            var length = self.__edgeLength(height);
            return v * length + Math.floor(length / 2) + self.__getTopOffset(height);
        };
    };

    GridViewHelper.prototype.__getTopOffset = function (height) {
        return this.topOffset(height);
    };

    GridViewHelper.prototype.getBaseScale = function () {
        return this.baseScale;
    };

    return GridViewHelper;
})(H5.Height, Math, H5.add);