var Drawable = (function (Math, measureText) {
    "use strict";

    function Drawable(id, x, y, img, txt, zIndex, alpha, rotation) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.img = img;
        this.txt = txt;
        this.zIndex = zIndex === undefined ? 3 : zIndex;
        this.rotation = rotation;
        this.alpha = alpha;
    }

    Drawable.prototype.getCornerX = function () {
        return this.x - this.__getWidth() / 2;
    };

    Drawable.prototype.getCornerY = function () {
        return this.y - this.__getHeight() / 2;
    };

    Drawable.prototype.getEndX = function () {
        return this.x + this.__getWidth() / 2;
    };

    Drawable.prototype.getEndY = function () {
        return this.y + this.__getHeight() / 2;
    };

    Drawable.prototype.getWidth = function () {
        return this.__getWidth();
    };

    Drawable.prototype.getHeight = function () {
        return this.__getHeight();
    };

    Drawable.prototype.__getHeight = function () {
        if (this.txt) {
            return measureText(this.txt).height;
        }
        if (this.img.scale)
            return Math.floor(this.img.height * this.img.scale);
        return this.img.height;
    };

    Drawable.prototype.__getWidth = function () {
        if (this.txt) {
            return measureText(this.txt).width;
        }
        if (this.img.scale)
            return Math.floor(this.img.width * this.img.scale);
        return this.img.width;
    };

    return Drawable;
})(Math, measureText);
