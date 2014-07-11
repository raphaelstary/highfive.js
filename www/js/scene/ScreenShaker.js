var ScreenShaker = (function () {
    "use strict";

    function ScreenShaker() {
        this.shaker = [];
    }

    ScreenShaker.prototype.add = function (drawable) {
        this.shaker.push(drawable);
    };

    return ScreenShaker;
})();