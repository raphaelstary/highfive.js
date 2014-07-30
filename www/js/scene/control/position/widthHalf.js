var widthHalf = (function (calcScreenConst) {
    "use strict";

    function widthHalf(screenWidth) {
        return calcScreenConst(screenWidth, 2);
    }

    return widthHalf;
})(calcScreenConst);