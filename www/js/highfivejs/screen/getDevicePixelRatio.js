H5.getDevicePixelRatio = (function (window) {
    "use strict";

    var calculatedDevicePixelRatio;
    if ('screen' in window) {
        calculatedDevicePixelRatio = window.screen.deviceXDPI / window.screen.logicalXDPI;
    }
    var devicePixelRatio = window.devicePixelRatio || calculatedDevicePixelRatio || 1;

    return function () {
        return devicePixelRatio;
    }
})(window);