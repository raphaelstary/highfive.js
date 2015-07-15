var DeviceInfo = (function (window, Math) {
    "use strict";

    function DeviceInfo(userAgent, width, height, devicePixelRatio, screenWidth, screenHeight) {
        this.userAgent = userAgent;
        this.isFirefox = /firefox/i.test(userAgent);
        this.isWiiU = 'wiiu' in window;
        this.isMobile = /mobile/i.test(userAgent);
        this.width = Math.floor(width * devicePixelRatio);
        this.height = Math.floor(height * devicePixelRatio);
        this.cssWidth = width;
        this.cssHeight = height;
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.devicePixelRatio = devicePixelRatio;
    }

    return DeviceInfo;
})(window, Math);