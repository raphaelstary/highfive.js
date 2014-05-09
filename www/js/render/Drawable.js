var Drawable = (function () {
    "use strict";

    function Drawable(id, x, y, img) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.img = img;
    }

    return Drawable;
})();