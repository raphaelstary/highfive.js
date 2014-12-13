var getDevicePixelRatio = (function (window) {
    "use strict";

    return function () {
        var calculatedDevicePixelRatio;
        if ('screen' in window) {
            calculatedDevicePixelRatio = window.screen.deviceXDPI / window.screen.logicalXDPI;
        }
        return window.devicePixelRatio || calculatedDevicePixelRatio || 1;
    }
})(window);