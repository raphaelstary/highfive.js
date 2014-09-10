var WindowPusher = (function (Transition, calcScreenConst) {
    "use strict";

    function WindowPusher(stage) {
        this.stage = stage;
    }

    WindowPusher.prototype.pushDown = function (xFn, yFn, itemKey, callBack) {
        var groundFn = function (height) {
            return height;
        };
        var speedFn = function (width, height) {
            return calcScreenConst(height - yFn(height), 15);
        };
        var killAnimation = function () {
            // todo
            // - kill animation
        };
        this.stage.moveFresh(xFn, yFn, itemKey, xFn, groundFn, speedFn, Transition.EASE_IN_QUAD, false, killAnimation);

        callBack();
    };

    return WindowPusher;
})(Transition, calcScreenConst);