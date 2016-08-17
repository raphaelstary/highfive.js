H5.FixRezGridViewHelper = (function (Height, Math, wrap) {
    "use strict";

    function FixRezGridViewHelper(stage, width, height, xTilesCount, yTilesCount, topOffset, bottomOffset) {
        this.stage = stage;
        this.width = width;
        this.height = height;
        this.xTiles = xTilesCount;
        this.yTiles = yTilesCount;
        this.topOffset = topOffset;
        this.bottomOffset = bottomOffset;

        this.baseScale = 1;
    }

    FixRezGridViewHelper.prototype.getCoordinates = function (x, y) {
        var length = this.getEdgeLength();
        return {
            u: Math.floor((x - this.__xOffset(length) + length / 2) / length),
            v: Math.floor((y - this.topOffset) / length)
        };
    };

    FixRezGridViewHelper.prototype.getCoordinatesWithScale = function (x, y, scale) {
        var length = this.getEdgeLength();
        var u = Math.floor((x - this.__xOffset(length) + length / 2) / length);
        var v = Math.floor((y - this.topOffset) / length);

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

    FixRezGridViewHelper.prototype.getPosition = function (u, v) {
        return {
            x: this.getX(u),
            y: this.getY(v)
        };
    };

    FixRezGridViewHelper.prototype.create = function (u, v, name, defaultTileHeight, xOffset, yOffset) {
        return this.createBackground(u, v, name, 5, defaultTileHeight, xOffset, yOffset);
    };

    FixRezGridViewHelper.prototype.createBackground = function (u, v, name, zIndex, defaultTileHeight, xOffset,
        yOffset) {
        var drawable = this.stage.createImage(name);
        if (xOffset && yOffset) {
            drawable.setPosition(wrap(this.getX(u) + xOffset), wrap(this.getY(v) + yOffset));
        } else if (xOffset) {
            drawable.setPosition(wrap(this.getX(u) + xOffset), wrap(this.getY(v)));
        } else if (yOffset) {
            drawable.setPosition(wrap(this.getX(u)), wrap(this.getY(v) + yOffset));
        } else {
            drawable.setPosition(wrap(this.getX(u)), wrap(this.getY(v)));
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

    FixRezGridViewHelper.prototype.__calcBaseScale = function (drawableHeight) {
        var length = this.getEdgeLength();
        return length / drawableHeight;
    };

    FixRezGridViewHelper.prototype.createRect = function (u, v, color) {
        return this.stage.createRectangle(true)
            .setPosition(wrap(this.getX(u)), wrap(this.getY(v)))
            .setWidth(wrap(this.getEdgeLength() - 1))
            .setHeight(wrap(this.getEdgeLength() - 1))
            .setColor(color);
    };

    FixRezGridViewHelper.prototype.createRectBackground = function (u, v, color, zIndex) {
        return this.createRect(u, v, color).setZIndex(zIndex);
    };

    FixRezGridViewHelper.prototype.move = function (drawable, u, v, speed, callback, xOffset, yOffset) {
        if (xOffset && yOffset)
            return drawable.moveTo(wrap(this.getX(u) + xOffset), wrap(this.getY(v) + yOffset))
                .setDuration(speed).setCallback(callback);
        if (xOffset)
            return drawable.moveTo(wrap(this.getX(u) + xOffset), wrap(this.getY(v))).setDuration(speed)
                .setCallback(callback);
        if (yOffset)
            return drawable.moveTo(wrap(this.getX(u)), wrap(this.getY(v) + yOffset)).setDuration(speed)
                .setCallback(callback);
        return drawable.moveTo(wrap(this.getX(u)), wrap(this.getY(v))).setDuration(speed).setCallback(callback);
    };

    FixRezGridViewHelper.prototype.setPosition = function (drawable, u, v) {
        return drawable.setPosition(wrap(this.getX(u)), wrap(this.getY(v)));
    };

    FixRezGridViewHelper.prototype.getEdgeLength = function () {
        if (this.bottomOffset) {
            return Height.get(this.yTiles)(this.height - (this.topOffset + this.bottomOffset));
        } else {
            return Height.get(this.yTiles)(this.height - this.topOffset);
        }
    };

    FixRezGridViewHelper.prototype.__xOffset = function (length) {
        return Math.floor(this.width / 2 - length * this.xTiles / 2 + length / 2);
    };

    FixRezGridViewHelper.prototype.getX = function (u) {
        var length = this.getEdgeLength();
        var start = this.__xOffset(length);
        return start + u * length;
    };

    FixRezGridViewHelper.prototype.getY = function (v) {
        var length = this.getEdgeLength();
        return v * length + Math.floor(length / 2) + this.topOffset;
    };

    return FixRezGridViewHelper;
})(H5.Height, Math, H5.wrap);