var BackGroundHelper = (function (widthHalf, heightHalf, changeCoords) {
    "use strict";

    var BACKGROUND = 'background';

    function drawBackGround(stage, screenWidth, screenHeight) {
        return stage.drawFresh(widthHalf(screenWidth), heightHalf(screenHeight), BACKGROUND, 0);
    }

    function resizeBackGround(backGround, screenWidth, screenHeight) {
        changeCoords(backGround, widthHalf(screenWidth), heightHalf(screenHeight));
    }

    return {
        draw: drawBackGround,
        resize: resizeBackGround
    };
})(widthHalf, heightHalf, changeCoords);