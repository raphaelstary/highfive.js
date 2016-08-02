H5.subtract = (function () {
    "use strict";

    function subtract(fn1, fn2) {
        return function (arg1, arg2) {
            return fn1(arg1, arg2) - fn2(arg1, arg2);
        }
    }

    return subtract;
})();