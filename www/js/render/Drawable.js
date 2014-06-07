var Drawable = (function () {
    "use strict";

    function Drawable(id, x, y, img, zIndex) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.img = img;
        this.zIndex = zIndex === undefined ? 3 : zIndex;
    }

    Drawable.prototype.getCornerX = function () {
        return this.x - this.img.width / 2;
    };

    Drawable.prototype.getCornerY = function () {
        return this.y - this.img.height / 2;
    };

    Drawable.prototype.getEndX = function () {
        return this.x + this.img.width / 2;
    };

    Drawable.prototype.getEndY = function () {
        return this.y + this.img.height / 2;
    };

    return Drawable;
})();