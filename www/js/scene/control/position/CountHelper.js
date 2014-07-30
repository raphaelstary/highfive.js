var CountHelper = (function (calcScreenConst, getTopRaster, changeCoords) {
    "use strict";

    function digitWidthHalf(stage) {
        return calcScreenConst(stage.getSubImage('num/numeral0').width, 2);
    }

    function digitOffSet(stage) {
        return calcScreenConst(stage.getSubImage('num/numeral0').width, 3, 4);
    }

    function baseDigitX(stage, screenWidth) {
        return calcScreenConst(screenWidth, 3, 2) + digitWidthHalf(stage);
    }

    function get1stDigitX(stage, screenWidth) {
        return baseDigitX(stage, screenWidth) + digitOffSet(stage) * 3;
    }

    function get2ndDigitX(stage, screenWidth) {
        return baseDigitX(stage, screenWidth) + digitOffSet(stage) * 2;
    }

    function get3rdDigitX(stage, screenWidth) {
        return baseDigitX(stage, screenWidth) + digitOffSet(stage);
    }

    function get4thDigitX(stage, screenWidth) {
        return baseDigitX(stage, screenWidth);
    }

    function resizeCounts(countDrawables, stage, screenWidth, screenHeight) {
        var topY = getTopRaster(screenHeight);
        changeCoords(countDrawables[0], get1stDigitX(stage, screenWidth), topY);
        changeCoords(countDrawables[1], get2ndDigitX(stage, screenWidth), topY);
        changeCoords(countDrawables[2], get3rdDigitX(stage, screenWidth), topY);
        changeCoords(countDrawables[3], get4thDigitX(stage, screenWidth), topY);
    }

    return {
        resize: resizeCounts,
        get1stX: get1stDigitX,
        get2ndX: get2ndDigitX,
        get3rdX: get3rdDigitX,
        get4thX: get4thDigitX
    };
})(calcScreenConst, getTopRaster, changeCoords);