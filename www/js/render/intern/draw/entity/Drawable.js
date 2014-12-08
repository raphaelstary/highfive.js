var Drawable = (function (Math, measureText, TextWrapper, SubImage, ImageWrapper) {
    "use strict";

    function Drawable(id, x, y, data, zIndex, alpha, rotation, scale) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.data = data;
        this.zIndex = zIndex === undefined ? 3 : zIndex;
        this.rotation = rotation;
        this.alpha = alpha;
        this.scale = scale || 1;
        this.anchorOffsetX = 0;
        this.anchorOffsetY = 0;
    }

    Drawable.prototype.getAnchorX = function () {
        return this.x + this.anchorOffsetX;
    };

    Drawable.prototype.getAnchorY = function () {
        return this.y + this.anchorOffsetY;
    };

    Drawable.prototype.getCornerX = function () {
        return this.x - Math.floor(this.__getWidth() / 2 * this.scale);
    };

    Drawable.prototype.getCornerY = function () {
        return this.y - Math.floor(this.__getHeight() / 2 * this.scale);
    };

    Drawable.prototype.getEndX = function () {
        return this.x + Math.floor(this.__getWidth() / 2 * this.scale);
    };

    Drawable.prototype.getEndY = function () {
        return this.y + Math.floor(this.__getHeight() / 2 * this.scale);
    };

    Drawable.prototype.getWidth = function () {
        return Math.floor(this.__getWidth() * this.scale);
    };

    Drawable.prototype.getHeight = function () {
        return Math.floor(this.__getHeight() * this.scale);
    };

    Drawable.prototype.__getHeight = function () {
        if (this.data instanceof TextWrapper) {
            return this.data.size;
        }
        if (this.data instanceof SubImage) {
            return this.data.scaledTrimmedHeight;
        }
        if (this.data instanceof ImageWrapper)
            return this.data.height * this.data.scale;
        return this.data.height;
    };

    Drawable.prototype.__getWidth = function () {
        if (this.data instanceof  TextWrapper) {
            return measureText(this.data).width;
        }
        if (this.data instanceof SubImage) {
            return this.data.scaledTrimmedWidth;
        }
        if (this.data instanceof ImageWrapper)
            return this.data.width * this.data.scale;
        return this.data.width;
    };

    return Drawable;
})(Math, measureText, TextWrapper, SubImage, ImageWrapper);
