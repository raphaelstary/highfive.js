H5.OrientationHandler = (function (window, Orientation, screen, Event) {
    "use strict";

    function OrientationHandler(events) {
        this.events = events;
        this.lastOrientation = -1;
    }

    OrientationHandler.prototype.orientationType = function () {
        var currentOrientation = /portrait/i.test(screen.orientation.type) ? Orientation.PORTRAIT :
            Orientation.LANDSCAPE;
        this.__fireEvent(currentOrientation);
    };

    OrientationHandler.prototype.screenOrientation = function () {
        var screenOrientation = screen.orientation || screen.mozOrientation || screen.msOrientation;
        var currentOrientation = /portrait/i.test(screenOrientation) ? Orientation.PORTRAIT : Orientation.LANDSCAPE;
        this.__fireEvent(currentOrientation);
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
        this.__fireEvent(currentOrientation);
    };

    OrientationHandler.prototype.handleResize = function () {
        var currentOrientation = (window.innerWidth > window.innerHeight) ? Orientation.LANDSCAPE :
            Orientation.PORTRAIT;
        this.__fireEvent(currentOrientation);
    };

    OrientationHandler.prototype.__fireEvent = function (currentOrientation) {
        if (this.lastOrientation === currentOrientation)
            return;

        this.events.fire(Event.SCREEN_ORIENTATION, currentOrientation);
        this.lastOrientation = currentOrientation;
    };

    return OrientationHandler;
})(window, H5.Orientation, window.screen, H5.Event);