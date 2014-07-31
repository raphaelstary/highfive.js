var SpeedStripesHelper = (function (calcScreenConst, changeCoords, changePath) {
    "use strict";

    function topOffSet(stage) {
        return calcScreenConst(stage.getSubImage('speed').width, 2);
    }

    function get1stX(screenWidth) {
        return calcScreenConst(screenWidth, 4);
    }

    function get2ndX(screenWidth) {
        return calcScreenConst(screenWidth, 3, 2);
    }

    function get3rdX(screenWidth) {
        return calcScreenConst(screenWidth, 8, 7);
    }

    function get4thX(screenWidth) {
        return calcScreenConst(screenWidth, 16, 7);
    }

    function get5thX(screenWidth) {
        return calcScreenConst(screenWidth, 16);
    }

    function _1stDelay(delay) {
        return 0 + delay;
    }

    function _2ndDelay(delay) {
        return 34 + delay;
    }

    function _3rdDelay(delay) {
        return 8 + delay;
    }

    function _4thDelay(delay) {
        return 24 + delay;
    }

    function _5thDelay(delay) {
        return 16 + delay;
    }

    function showSpeedStripes(stage, delay, screenWidth, screenHeight) {
        var speedStripes = [];
        var yOffSet = topOffSet(stage);
        speedStripes.push(drawSpeed(stage, get1stX(screenWidth), yOffSet, _1stDelay(delay), screenHeight));
        speedStripes.push(drawSpeed(stage, get2ndX(screenWidth), yOffSet, _2ndDelay(delay), screenHeight));
        speedStripes.push(drawSpeed(stage, get3rdX(screenWidth), yOffSet, _3rdDelay(delay), screenHeight));
        speedStripes.push(drawSpeed(stage, get4thX(screenWidth), yOffSet, _4thDelay(delay), screenHeight));
        speedStripes.push(drawSpeed(stage, get5thX(screenWidth), yOffSet, _5thDelay(delay), screenHeight));

        return speedStripes;
    }

    function drawSpeed(stage, x, yOffSet, delay, screenHeight) {
        return stage.moveFreshLater(x, - yOffSet, 'speed', x, screenHeight + yOffSet, 30, Transition.LINEAR, delay,
            true);
    }

    function changeSpeed(wrapper, x, topY, bottomY) {
        changeCoords(wrapper.drawable, x, topY);
        changePath(wrapper.path, x, topY, x, bottomY);
    }

    function resizeSpeedStripes(speedStripes, stage, screenWidth, screenHeight) {
        var topY = - topOffSet(stage);
        var bottomY = screenHeight + topOffSet(stage);

        changeSpeed(speedStripes[0], get1stX(screenWidth), topY, bottomY);
        changeSpeed(speedStripes[1], get2ndX(screenWidth), topY, bottomY);
        changeSpeed(speedStripes[2], get3rdX(screenWidth), topY, bottomY);
        changeSpeed(speedStripes[3], get4thX(screenWidth), topY, bottomY);
        changeSpeed(speedStripes[4], get5thX(screenWidth), topY, bottomY);
    }

    return {
        draw: showSpeedStripes,
        resize: resizeSpeedStripes
    };
})(calcScreenConst, changeCoords, changePath);