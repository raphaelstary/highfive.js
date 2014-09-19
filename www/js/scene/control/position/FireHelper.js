var FireHelper = (function (changeCoords, widthHalf, __400) {
    "use strict";

    function drawFire(stage, screenWidth, screenHeight) {
        return stage.animateFresh(widthHalf(screenWidth), __400(screenHeight), 'fire/fire', 10);
    }

    function resizeFire(fire, screenWidth, screenHeight) {
        changeCoords(fire, widthHalf(screenWidth), __400(screenHeight));
    }

    return {
        draw: drawFire,
        resize: resizeFire
    };

})(changeCoords, widthHalf, __400);