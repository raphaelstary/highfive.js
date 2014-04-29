var ScreenSizer = (function () {
    "use strict";

    function ScreenSizer(resizeBus, width, height) {
        this.resizeBus = resizeBus;
        this.currentWidth = width;
        this.currentHeight = height;
    }

    ScreenSizer.prototype.resize = function (width, height) {
        var factorWidth = width / this.currentWidth;
        var factorHeight = height / this.currentHeight;
        this._notifyBus(width, height, factorWidth, factorHeight);

        this.currentWidth = width;
        this.currentHeight = height;
    };

    ScreenSizer.prototype._notifyBus = function (width, height, factorWidth, factorHeight) {
        this.resizeBus.callResize(width, height, factorWidth, factorHeight);
    };

    return ScreenSizer;
})();