var getBottomRaster = (function (calcScreenConst) {
    "use strict";

    return function (screenHeight) {
        return calcScreenConst(screenHeight, 20, 19);
    };
})(calcScreenConst);
