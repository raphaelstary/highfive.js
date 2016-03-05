H5.changeSign = (function () {
    "use strict";

    function changeSign(fn) {
        return function (arg1, arg2) {
            return -fn(arg1, arg2);
        }
    }

    return changeSign;
})();