var BackGroundHelper = (function (widthHalf, heightHalf, changeCoords) {
    "use strict";

    function drawBackGround(stage, screenWidth, screenHeight) {
        return stage.drawFresh(widthHalf(screenWidth), heightHalf(screenHeight), 'background', 0);
    }

    function resizeBackGround(backGround, screenWidth, screenHeight) {
        changeCoords(backGround, widthHalf(screenWidth), heightHalf(screenHeight));
    }

    return {
        draw: drawBackGround,
        resize: resizeBackGround
    };
})(widthHalf, heightHalf, changeCoords);