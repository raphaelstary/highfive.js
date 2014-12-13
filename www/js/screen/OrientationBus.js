var OrientationBus = (function () {
    "use strict";

    function OrientationBus() {
        this.callbacks = [];
        this.orientation = -1;
    }

    OrientationBus.prototype.add = function (callback) {
        this.callbacks.push(callback);
    };

    OrientationBus.prototype.changeOrientation = function (orientation) {
        this.orientation = orientation;
        this.callbacks.forEach(function (callback) {
            callback(orientation);
        });
    };

    OrientationBus.prototype.getOrientation = function () {
        return this.orientation;
    };

    return OrientationBus;
})();