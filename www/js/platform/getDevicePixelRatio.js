var getDevicePixelRatio = (function (window) {
    "use strict";

    return function () {
        var windowsPhone8 = window.screen.deviceXDPI / window.screen.logicalXDPI;
        return window.devicePixelRatio || windowsPhone8 || 1;
    }
})(window);