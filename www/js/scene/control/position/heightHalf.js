var heightHalf = (function (calcScreenConst) {
    "use strict";

    function heightHalf(screenHeight) {
        return calcScreenConst(screenHeight, 2);
    }

    return heightHalf;
})(calcScreenConst);