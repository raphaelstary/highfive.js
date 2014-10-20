var getTopRaster = (function (calcScreenConst) {
    "use strict";

    function getTopRaster(screenHeight) {
        return calcScreenConst(screenHeight, 20);
    }

    return getTopRaster;
})(calcScreenConst);