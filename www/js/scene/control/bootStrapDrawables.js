var bootStrapDrawables = (function (widthHalf, heightHalf, calcScreenConst, getTopRaster) {
    "use strict";

    function initBackGround(stage) {
        return stage.drawFresh(widthHalf, heightHalf, 'scene', 0);
    }

    var FONT_FACE = 'Arial';
    var FONT_COLOR = '#c4c4c4';

    function fontSize(width, height) {
        return calcScreenConst(height, 15);
    }

    function initTimeLeft(stage, backGroundDrawable) {
        function getTimeX() {
            return backGroundDrawable.getCornerX() + calcScreenConst(backGroundDrawable.getWidth(), 3);
        }
        return stage.drawText(getTimeX, getTopRaster, "2:00:00", fontSize, FONT_FACE, FONT_COLOR, 3,
            [backGroundDrawable]);
    }

    function initPeopleLeft(stage, backGroundDrawable) {
        function getPeopleLeftX() {
            return backGroundDrawable.getCornerX() + calcScreenConst(backGroundDrawable.getWidth(), 3, 2);
        }
        return stage.drawText(getPeopleLeftX, getTopRaster, "10 left", fontSize, FONT_FACE, FONT_COLOR, 3,
            [backGroundDrawable]);
    }

    function initFireFighter(stage, backGroundDrawable) {
        function fireFighterA_X(width) {
            return backGroundDrawable.getCornerX() < calcScreenConst(width, 20) ?
                calcScreenConst(width, 20) : backGroundDrawable.getCornerX();
        }
        function fireFighter_Y(height) {
            return calcScreenConst(height, 20, 19);
        }
        function fireFighterB_X(width) {
            return backGroundDrawable.getEndX() < calcScreenConst(width, 20, 19) ?
                backGroundDrawable.getEndX() : calcScreenConst(width, 20, 19);
        }
        function fireFighterSpeed(width) {
            var distance = fireFighterB_X(width) - fireFighterA_X(width);
            return calcScreenConst(distance, 3);
        }

        return stage.moveFreshRoundTrip(fireFighterA_X, fireFighter_Y, 'firefighter', fireFighterB_X, fireFighter_Y,
            fireFighterSpeed, Transition.EASE_IN_OUT_SIN, true, undefined, undefined, [backGroundDrawable]);
    }

    function bootStrapDrawables(stage) {
        var backGroundDrawable = initBackGround(stage);

        return {
            backGround: backGroundDrawable,
            timeLeft: initTimeLeft(stage, backGroundDrawable),
            peopleLeft: initPeopleLeft(stage, backGroundDrawable),
            fireFighter: initFireFighter(stage, backGroundDrawable)
        };
    }

    return bootStrapDrawables;
})(widthHalf, heightHalf, calcScreenConst, getTopRaster);