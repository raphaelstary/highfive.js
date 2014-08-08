var ShieldsHelper = (function (changeCoords, widthHalf, __400) {
    "use strict";

    function resizeShields(ship, screenWidth, screenHeight) {
        changeCoords(ship, widthHalf(screenWidth), __400(screenHeight));
    }

    return {
        resize: resizeShields
    };
})(changeCoords, widthHalf, __400);