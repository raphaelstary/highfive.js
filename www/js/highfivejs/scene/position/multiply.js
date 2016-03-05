H5.multiply = (function () {
    "use strict";

    function multiply(fn, factor) {
        return function (arg1, arg2) {
            return fn(arg1, arg2) * factor;
        }
    }

    return multiply;
})();
