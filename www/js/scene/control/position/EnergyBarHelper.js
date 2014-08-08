var EnergyBarHelper = (function (calcScreenConst, getTopRaster, changeCoords) {
    "use strict";

    function energyX(screenWidth) {
        return calcScreenConst(screenWidth, 32, 7);
    }

    function yBottom(screenHeight) {
        return getTopRaster(screenHeight) * 19;
    }

    return {
        resize: function (drawable, screenWidth, screenHeight) {
            changeCoords(drawable, energyX(screenWidth), yBottom(screenHeight));
        }
    }
})(calcScreenConst, getTopRaster, changeCoords);