var Touchable = (function () {
    "use strict";

    function Touchable(id, x, y, width, height) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    return Touchable;
})();