H5.Device = (function (window, Math) {
    'use strict';

    function Device(userAgent, width, height, devicePixelRatio, screenWidth, screenHeight) {
        this.userAgent = userAgent;
        this.isFirefox = /firefox/i.test(userAgent);
        this.isIE = /trident/i.test(userAgent);
        this.isEdge = /edge/i.test(userAgent);
        this.isMobile = /mobile/i.test(userAgent);
        this.width = Math.floor(width * devicePixelRatio);
        this.height = Math.floor(height * devicePixelRatio);
        this.cssWidth = width;
        this.cssHeight = height;
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.devicePixelRatio = devicePixelRatio;
    }

    return Device;
})(window, Math);