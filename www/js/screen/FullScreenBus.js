var FullScreenBus = (function () {
    "use strict";

    function FullScreenBus() {
        this.callbacks = [];
    }

    FullScreenBus.prototype.changed = function (isFullScreen) {
        this.callbacks.forEach(function (callback) {
            callback(isFullScreen);
        });
    };

    FullScreenBus.prototype.add = function (callback) {
        this.callbacks.push(callback);
    };

    return FullScreenBus;
})();