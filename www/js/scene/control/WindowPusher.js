var WindowPusher = (function () {
    "use strict";

    function WindowPusher() {
    }

    WindowPusher.prototype.pushDown = function (xFn, yFn, itemKey, callBack) {
        //this.stage.motionDings(xFn, yFn, itemKey);
        callBack();
    };

    return WindowPusher;
})();