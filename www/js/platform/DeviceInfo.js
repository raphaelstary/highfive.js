var DeviceInfo = (function (userAgent, window) {
    "use strict";

    function DeviceInfo() {
        this.isFirefox = /firefox/i.test(userAgent);
        this.isMobile = /mobile/i.test(userAgent);
    }

    DeviceInfo.prototype.getWidth = function () {
        return window.innerWidth;
    };

    DeviceInfo.prototype.getHeight = function () {
        return window.innerHeight;
    };

    return DeviceInfo;
})(window.navigator.userAgent, window);