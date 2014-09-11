var WindowPusher = (function (Transition, calcScreenConst, window) {
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
        var self = this;
        var killAnimation = function () {
            self.stage.remove(wrapper.drawable);
        };
        var wrapper = this.stage.moveFresh(xFn, yFn, itemKey, xFn, groundFn, speedFn, Transition.EASE_IN_QUAD, false,
            killAnimation);

        window.setTimeout(callBack, 1000);
    };

    return WindowPusher;
})(Transition, calcScreenConst, window);