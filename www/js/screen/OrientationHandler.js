var OrientationHandler = (function (window, Orientation, screen) {
    "use strict";

    function OrientationHandler(orientationBus) {
        this.bus = orientationBus;
        this.lastOrientation = -1;
    }

    OrientationHandler.prototype.orientationType = function () {
        var currentOrientation = /portrait/i.test(screen.orientation.type) ? Orientation.PORTRAIT :
            Orientation.LANDSCAPE;
        this.__callBus(currentOrientation);
    };

    OrientationHandler.prototype.screenOrientation = function () {
        var screenOrientation = screen.orientation || screen.mozOrientation || screen.msOrientation;
        var currentOrientation = /portrait/i.test(screenOrientation) ? Orientation.PORTRAIT : Orientation.LANDSCAPE;
        this.__callBus(currentOrientation);
    };

    OrientationHandler.prototype.windowOrientation = function () {
        var currentOrientation;
        switch (window.orientation) {
            case 0:
                currentOrientation = Orientation.PORTRAIT;
                break;
            case -90:
                currentOrientation = Orientation.LANDSCAPE;
                break;
            case 90:
                currentOrientation = Orientation.LANDSCAPE;
                break;
            case 180:
                currentOrientation = Orientation.PORTRAIT;
                break;
        }
        this.__callBus(currentOrientation);
    };

    OrientationHandler.prototype.handleResize = function () {
        var currentOrientation = (window.innerWidth > window.innerHeight) ? Orientation.LANDSCAPE :
            Orientation.PORTRAIT;
        this.__callBus(currentOrientation);
    };

    OrientationHandler.prototype.__callBus = function (currentOrientation) {
        if (this.lastOrientation === currentOrientation)
            return;
        this.bus.changeOrientation(currentOrientation);
        this.lastOrientation = currentOrientation;
    };

    return OrientationHandler;
})(window, Orientation, window.screen);