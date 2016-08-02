H5.changeMask = (function () {
    "use strict";

    function changeMask(mask, a_x, a_y, b_x, b_y) {
        mask.x = a_x;
        mask.y = a_y;
        mask.width = b_x - mask.x;
        mask.height = b_y - mask.y;
    }

    return changeMask;
})();
