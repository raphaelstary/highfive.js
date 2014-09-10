var WindowPusher = (function (Transition) {
    "use strict";

    function WindowPusher(stage) {
        this.stage = stage;
    }

    WindowPusher.prototype.pushDown = function (xFn, yFn, itemKey, callBack) {
        var groundFn = function (height) {
            return height;
        };
        var speedFn = function (width, height) {
            // todo mit height abstimmen
            return 90;
        };
        var killAnimation = function () {
            // todo
            // - kill animation
        };
        this.stage.moveFresh(xFn, yFn, itemKey, xFn, groundFn, speedFn, Transition.EASE_IN_EXPO, false, killAnimation);

        callBack();
    };

    return WindowPusher;
})(Transition);