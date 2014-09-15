var bootStrapDrawables = (function (widthHalf, heightHalf, calcScreenConst, getTopRaster, fontSize_15) {
    "use strict";

    function initBackGround(stage) {
        return stage.drawFresh(widthHalf, heightHalf, 'scene', 0);
    }

    var FONT_FACE = 'Arial';
    var FONT_COLOR = '#c4c4c4';

    function initTimeLeft(stage, backGroundDrawable) {
        function getTimeX() {
            return backGroundDrawable.getCornerX() + calcScreenConst(backGroundDrawable.getWidth(), 3);
        }
        return stage.drawText(getTimeX, getTopRaster, "2:00:00", fontSize_15, FONT_FACE, FONT_COLOR, 3,
            [backGroundDrawable]);
    }

    function initPeopleLeft(stage, backGroundDrawable) {
        function getPeopleLeftX() {
            return backGroundDrawable.getCornerX() + calcScreenConst(backGroundDrawable.getWidth(), 3, 2);
        }
        return stage.drawText(getPeopleLeftX, getTopRaster, "10 left", fontSize_15, FONT_FACE, FONT_COLOR, 3,
            [backGroundDrawable]);
    }

    function bootStrapDrawables(stage) {
        var backGroundDrawable = initBackGround(stage);

        return {
            backGround: backGroundDrawable,
            timeLeft: initTimeLeft(stage, backGroundDrawable),
            peopleLeft: initPeopleLeft(stage, backGroundDrawable)
        };
    }

    return bootStrapDrawables;
})(widthHalf, heightHalf, calcScreenConst, getTopRaster, fontSize_15);