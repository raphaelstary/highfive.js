var CountHelper = (function (calcScreenConst, getTopRaster, changeCoords, changePath) {
    "use strict";

    var ZERO = 'numeral_0';
    function digitWidthHalf(stage) {
        return calcScreenConst(stage.getSubImage(ZERO).width, 2);
    }

    function digitOffSet(stage) {
        return calcScreenConst(stage.getSubImage(ZERO).width, 3, 4);
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

    function resize1st(drawable, stage, screenWidth, screenHeight) {
        changeCoords(drawable, get1stDigitX(stage, screenWidth), getTopRaster(screenHeight));
    }

    function resize2nd(drawable, stage, screenWidth, screenHeight) {
        changeCoords(drawable, get2ndDigitX(stage, screenWidth), getTopRaster(screenHeight));
    }

    function resize3rd(drawable, stage, screenWidth, screenHeight) {
        changeCoords(drawable, get3rdDigitX(stage, screenWidth), getTopRaster(screenHeight));
    }

    function resize4th(drawable, stage, screenWidth, screenHeight) {
        changeCoords(drawable, get4thDigitX(stage, screenWidth), getTopRaster(screenHeight));
    }

    function resizeCounts(countDrawables, stage, screenWidth, screenHeight) {
        resize1st(countDrawables[0], stage, screenWidth, screenHeight);
        resize2nd(countDrawables[1], stage, screenWidth, screenHeight);
        resize3rd(countDrawables[2], stage, screenWidth, screenHeight);
        resize4th(countDrawables[3], stage, screenWidth, screenHeight);
    }

    function resize1stWrapper(wrapper, stage, screenWidth, screenHeight) {
        var offSet = calcScreenConst(screenWidth, 5);
        var topY = getTopRaster(screenHeight);
        var _1stDigitX = get1stDigitX(stage, screenWidth);
        var _1stWOffSet = _1stDigitX + offSet;
        changeCoords(wrapper.drawable, _1stWOffSet, topY);
        changePath(wrapper.path, _1stWOffSet, topY, _1stDigitX, topY);
    }

    function resize2ndWrapper(wrapper, stage, screenWidth, screenHeight) {
        var offSet = calcScreenConst(screenWidth, 5);
        var topY = getTopRaster(screenHeight);
        var _2ndDigitX = get2ndDigitX(stage, screenWidth);
        var _2ndWOffSet = _2ndDigitX + offSet;
        changeCoords(wrapper.drawable, _2ndWOffSet, topY);
        changePath(wrapper.path, _2ndWOffSet, topY, _2ndDigitX, topY);
    }

    function resize3rdWrapper(wrapper, stage, screenWidth, screenHeight) {
        var offSet = calcScreenConst(screenWidth, 5);
        var topY = getTopRaster(screenHeight);
        var _3rdDigitX = get3rdDigitX(stage, screenWidth);
        var _3rdWOffSet = _3rdDigitX + offSet;
        changeCoords(wrapper.drawable, _3rdWOffSet, topY);
        changePath(wrapper.path, _3rdWOffSet, topY, _3rdDigitX, topY);
    }

    function resize4thWrapper(wrapper, stage, screenWidth, screenHeight) {
        var offSet = calcScreenConst(screenWidth, 5);
        var topY = getTopRaster(screenHeight);
        var _4thDigitX = get4thDigitX(stage, screenWidth);
        var _4thWOffSet = _4thDigitX + offSet;
        changeCoords(wrapper.drawable, _4thWOffSet, topY);
        changePath(wrapper.path, _4thWOffSet, topY, _4thDigitX, topY);
    }

    return {
        resize: resizeCounts,
        get1stX: get1stDigitX,
        get2ndX: get2ndDigitX,
        get3rdX: get3rdDigitX,
        get4thX: get4thDigitX,
        resize1st: resize1st,
        resize1stWrapper: resize1stWrapper,
        resize2nd: resize2nd,
        resize2ndWrapper: resize2ndWrapper,
        resize3rd: resize3rd,
        resize3rdWrapper: resize3rdWrapper,
        resize4th: resize4th,
        resize4thWrapper: resize4thWrapper
    };
})(calcScreenConst, getTopRaster, changeCoords, changePath);