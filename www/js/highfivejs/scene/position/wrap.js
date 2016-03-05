H5.wrap = (function () {
    "use strict";

    function wrap(value_OrObject, optionalObjectKey) {
        if (optionalObjectKey) {
            return function () {
                return value_OrObject[optionalObjectKey];
            };
        }
        return function () {
            return value_OrObject;
        };
    }

    return wrap;
})();
