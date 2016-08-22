H5.FixRezGridViewHelper = (function (Math, wrap) {
    "use strict";

    function FixRezGridViewHelper(stage, xTilesCount, yTilesCount, width, height, edgeLength, topOffset, bottomOffset) {
        this.stage = stage;
        this.width = width;
        this.height = height;
        this.xTiles = xTilesCount;
        this.yTiles = yTilesCount;
        this.edgeLength = edgeLength;
        this.topOffset = topOffset;
        this.bottomOffset = bottomOffset;
    }

    FixRezGridViewHelper.prototype.getCoordinates = function (x, y) {
        return {
            u: Math.floor((x - this.__xOffset() + this.edgeLength / 2) / this.edgeLength),
            v: Math.floor((y - this.topOffset) / this.edgeLength)
        };
    };

    FixRezGridViewHelper.prototype.getPosition = function (u, v) {
        return {
            x: this.getX(u),
            y: this.getY(v)
        };
    };

    FixRezGridViewHelper.prototype.create = function (u, v, name, xOffset, yOffset) {
        return this.createBackground(u, v, name, 5, xOffset, yOffset);
    };

    FixRezGridViewHelper.prototype.createBackground = function (u, v, name, zIndex, xOffset, yOffset) {
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

        return drawable;
    };

    FixRezGridViewHelper.prototype.createRect = function (u, v, color) {
        return this.stage.createRectangle(true)
            .setPosition(wrap(this.getX(u)), wrap(this.getY(v)))
            .setWidth(wrap(this.edgeLength - 1))
            .setHeight(wrap(this.edgeLength - 1))
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

    FixRezGridViewHelper.prototype.__xOffset = function () {
        return Math.floor((this.width - this.edgeLength * this.xTiles + this.edgeLength) * 0.95);
    };

    FixRezGridViewHelper.prototype.getX = function (u) {
        return this.__xOffset() + u * this.edgeLength;
    };

    FixRezGridViewHelper.prototype.getY = function (v) {
        return v * this.edgeLength + Math.floor(this.edgeLength / 2) + this.topOffset;
    };

    return FixRezGridViewHelper;
})(Math, H5.wrap);