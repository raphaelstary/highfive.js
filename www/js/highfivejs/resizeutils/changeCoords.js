H5.changeCoords = (function () {
    "use strict";

    function changeCoords(drawable, x, y) {
        drawable.x = x;
        drawable.y = y;
    }

    return changeCoords;
})();