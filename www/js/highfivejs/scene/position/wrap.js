var wrap = (function () {
    "use strict";

    function wrap(value) {
        return function () {
            return value;
        }
    }

    return wrap;
})();
