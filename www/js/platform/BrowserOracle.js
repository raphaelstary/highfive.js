var BrowserOracle = (function () {
    "use strict";

    function BrowserOracle(userAgent) {
        this.userAgent = userAgent;
    }

    BrowserOracle.prototype.init = function () {
        this.isFirefox = /firefox/i.test(this.userAgent);
    };

    return BrowserOracle;
})();