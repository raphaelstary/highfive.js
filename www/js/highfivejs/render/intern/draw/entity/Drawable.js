H5.Drawable = (function (Math, measureText, TextWrapper, SubImage, ImageWrapper, Circle, DrawableLine) {
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
        this.rotationAnchorOffsetX = 0;
        this.rotationAnchorOffsetY = 0;
        this.anchorOffsetX = 0;
        this.anchorOffsetY = 0;
        this.show = true;
        this.flipHorizontally = false;
        this.flipVertically = false;
    }

    Drawable.prototype.getRotationAnchorX = function () {
        return this.x + this.rotationAnchorOffsetX;
    };

    Drawable.prototype.getRotationAnchorY = function () {
        return this.y + this.rotationAnchorOffsetY;
    };

    Drawable.prototype.getAnchorX = function () {
        return this.x + this.anchorOffsetX;
    };

    Drawable.prototype.getAnchorY = function () {
        return this.y + this.anchorOffsetY;
    };

    Drawable.prototype.getCornerX = function () {
        return this.x - this.getWidthHalf();
    };

    Drawable.prototype.getCornerY = function () {
        return this.y - this.getHeightHalf();
    };

    Drawable.prototype.getEndX = function () {
        return this.x + this.getWidthHalf();
    };

    Drawable.prototype.getEndY = function () {
        return this.y + this.getHeightHalf();
    };

    Drawable.prototype.getWidth = function () {
        return Math.floor(this.__getWidth() * this.scale);
    };

    Drawable.prototype.getWidthHalf = function () {
        return Math.floor(this.__getWidth() / 2 * this.scale);
    };

    Drawable.prototype.getHeightHalf = function () {
        return Math.floor(this.__getHeight() / 2 * this.scale);
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
        if (this.data instanceof ImageWrapper) {
            return this.data.height * this.data.scale;
        }
        if (this.data instanceof DrawableLine) {
            return 0;
        }
        if (this.data instanceof Circle) {
            return this.data.radius * 2;
        }
        return this.data.height;
    };

    Drawable.prototype.__getWidth = function () {
        if (this.data instanceof  TextWrapper) {
            return measureText(this.data).width;
        }
        if (this.data instanceof SubImage) {
            return this.data.scaledTrimmedWidth;
        }
        if (this.data instanceof ImageWrapper) {
            return this.data.width * this.data.scale;
        }
        if (this.data instanceof DrawableLine) {
            return this.data.length;
        }
        if (this.data instanceof Circle) {
            return this.data.radius * 2;
        }
        return this.data.width;
    };

    return Drawable;
})(Math, H5.measureText, H5.TextWrapper, H5.SubImage, H5.ImageWrapper, H5.Circle, H5.DrawableLine);