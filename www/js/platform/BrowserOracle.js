var BrowserOracle = (function () {
    "use strict";

    function BrowserOracle(userAgent) {
        this.userAgent = userAgent;
        this.isFirefox = /firefox/i.test(this.userAgent);
        this.isMobile = /mobile/i.test(this.userAgent);
    }

    return BrowserOracle;
})();