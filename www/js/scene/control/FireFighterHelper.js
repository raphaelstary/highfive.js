var FireFighterHelper = (function (Transition, calcScreenConst) {
    "use strict";

    function FireFighterHelper() {
    }

    function initFireFighter(stage, backGroundDrawable, speed) {
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
            return calcScreenConst(distance, speed);
        }

        return stage.moveFreshRoundTrip(fireFighterA_X, fireFighter_Y, 'firefighter', fireFighterB_X, fireFighter_Y,
            fireFighterSpeed, Transition.EASE_IN_OUT_SIN, true, undefined, undefined, [backGroundDrawable]);
    }

    return {
        init: initFireFighter
    };

})(Transition, calcScreenConst);