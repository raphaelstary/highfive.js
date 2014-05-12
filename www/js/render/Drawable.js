var Drawable = (function () {
    "use strict";

    function Drawable(id, x, y, img) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.img = img;
    }

    Drawable.prototype.getCornerY = function () {
        return this.y - this.img.height / 2;
    };

    Drawable.prototype.isBelow = function (otherDrawable, tolerance) {
        // TODO make bettewr with circles?
        return this.getCornerY() + this.img.height - tolerance >= otherDrawable.getCornerY();
    };

    return Drawable;
})();