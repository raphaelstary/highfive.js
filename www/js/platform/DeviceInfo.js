var DeviceInfo = (function () {
    "use strict";

    function DeviceInfo(userAgent, width, height, devicePixelRatio) {
        this.isFirefox = /firefox/i.test(userAgent);
        this.isMobile = /mobile/i.test(userAgent);
        this.width = width * devicePixelRatio;
        this.height = height * devicePixelRatio;
        this.cssWidth = width;
        this.cssHeight = height;
        this.devicePixelRatio = devicePixelRatio;
    }

    return DeviceInfo;
})();