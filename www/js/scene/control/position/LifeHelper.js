var LifeHelper = (function (calcScreenConst, changeCoords, getTopRaster) {
    "use strict";

    function lifeX(screenWidth) {
        return calcScreenConst(screenWidth, 10);
    }

    function getLifeOffSet(stage) {
        return stage.getSubImage('playerlife').width;
    }

    function lifeTwoX(stage, screenWidth) {
        return lifeX(screenWidth) + getLifeOffSet(stage);
    }

    function lifeThreeX(stage, screenWidth) {
        return lifeX(screenWidth) + getLifeOffSet(stage) * 2;
    }

    function resizeLifeOneDrawable(drawable, screenWidth, screenHeight) {
        changeCoords(drawable, lifeX(screenWidth), getTopRaster(screenHeight));
    }

    function resizeLifeTwoDrawable(drawable, stage, screenWidth, screenHeight) {
        changeCoords(drawable, lifeTwoX(stage, screenWidth), getTopRaster(screenHeight));
    }

    function resizeLifeThreeDrawable(drawable, stage, screenWidth, screenHeight) {
        changeCoords(drawable, lifeThreeX(stage, screenWidth), getTopRaster(screenHeight));
    }

    return {
        resize: function (livesDict, stage, screenWidth, screenHeight) {
            if (livesDict[1])
                resizeLifeOneDrawable(livesDict[1], screenWidth, screenHeight);
            if (livesDict[2])
                resizeLifeTwoDrawable(livesDict[2], stage, screenWidth, screenHeight);
            if (livesDict[3])
                resizeLifeThreeDrawable(livesDict[3], stage, screenWidth, screenHeight);
        },
        resizeLifeOne: resizeLifeOneDrawable,
        resizeLifeTwo: resizeLifeTwoDrawable,
        resizeLifeThree: resizeLifeThreeDrawable
    }
})(calcScreenConst, changeCoords, getTopRaster);