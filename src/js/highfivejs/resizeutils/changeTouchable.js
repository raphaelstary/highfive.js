H5.changeTouchable = (function () {
    "use strict";

    function changeTouchable(touchable, x, y, width, height) {
        touchable.x = x;
        touchable.y = y;
        touchable.width = width;
        touchable.height = height;
    }

    return changeTouchable;
})();