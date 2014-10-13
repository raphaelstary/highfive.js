var Drawable = (function (Math, measureText) {
    "use strict";

    function Drawable(id, x, y, img, txt, zIndex, alpha, rotation, scale) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.img = img;
        this.txt = txt;
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
        if (this.txt) {
            return measureText(this.txt).height;
        }
        if (this.img.trimmedTileHeight) {
            return this.img.trimmedTileHeight;
        }
        if (this.img.scale)
            return this.img.height * this.img.scale;
        return this.img.height;
    };

    Drawable.prototype.__getWidth = function () {
        if (this.txt) {
            return measureText(this.txt).width;
        }
        if (this.img.trimmedTileWidth) {
            return this.img.trimmedTileWidth;
        }
        if (this.img.scale)
            return this.img.width * this.img.scale;
        return this.img.width;
    };

    return Drawable;
})(Math, measureText);
