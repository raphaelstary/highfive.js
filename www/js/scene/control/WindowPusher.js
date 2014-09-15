var WindowPusher = (function (Transition, calcScreenConst, window) {
    "use strict";

    function WindowPusher(stage, objectsToCatch, objectsToAvoid) {
        this.stage = stage;
        this.objectsToCatch = objectsToCatch;
        this.objectsToAvoid = objectsToAvoid;
    }

    WindowPusher.prototype.setKillCallback = function (callback) {
        this.killCallback = callback;
    };

    WindowPusher.prototype.pushDown = function (xFn, yFn, itemKey, callBack) {
        var groundFn = function (height) {
            return height;
        };
        var speedFn = function (width, height) {
            return calcScreenConst(height - yFn(height), 15);
        };
        var self = this;
        var killAnimation = function () {
            self.killCallback();
            self.stage.remove(wrapper.drawable);
            delete self.objectsToCatch[wrapper.drawable.id];
        };
        var wrapper = this.stage.moveFresh(xFn, yFn, itemKey, xFn, groundFn, speedFn, Transition.EASE_IN_QUAD, false,
            killAnimation);
        this.objectsToCatch[wrapper.drawable.id] = wrapper.drawable;

        window.setTimeout(callBack, 1000);
    };

    return WindowPusher;
})(Transition, calcScreenConst, window);