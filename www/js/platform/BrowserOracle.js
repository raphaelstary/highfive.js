var BrowserOracle = (function (userAgent) {
    "use strict";

    function BrowserOracle() {
        this.isFirefox = /firefox/i.test(userAgent);
        this.isMobile = /mobile/i.test(userAgent);
    }

    return BrowserOracle;
})(window.navigator.userAgent);