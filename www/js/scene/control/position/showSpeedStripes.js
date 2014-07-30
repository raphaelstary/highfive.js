var showSpeedStripes = (function (calcScreenConst) {
    "use strict";

    function showSpeedStripes(stage, delay, screenWidth, screenHeight) {
        var speedStripes = [];
        var yOffSet = calcScreenConst(stage.getSubImage('speed').width, 2);
        speedStripes.push(drawSpeed(stage, calcScreenConst(screenWidth, 4), yOffSet, 0 + delay, screenHeight));
        speedStripes.push(drawSpeed(stage, calcScreenConst(screenWidth, 3, 2), yOffSet, 34 + delay, screenHeight));
        speedStripes.push(drawSpeed(stage, calcScreenConst(screenWidth, 8, 7), yOffSet, 8 + delay, screenHeight));
        speedStripes.push(drawSpeed(stage, calcScreenConst(screenWidth, 16, 7), yOffSet, 24 + delay, screenHeight));
        speedStripes.push(drawSpeed(stage, calcScreenConst(screenWidth, 16), yOffSet, 16 + delay, screenHeight));

        return speedStripes;
    }

    function drawSpeed(stage, x, yOffSet, delay, screenHeight) {
        return stage.moveFreshLater(x, - yOffSet, 'speed', x, screenHeight + yOffSet, 30, Transition.LINEAR, delay,
            true);
    }

    return showSpeedStripes;
})(calcScreenConst);