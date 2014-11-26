var Touchable = (function () {
    "use strict";

    function Touchable(id, x, y, width, height) {
        // todo: change them (touchables) to AB rects, cause I think it relates more to the domain
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    return Touchable;
})();