H5.ValueChecker = (function (Math, isFinite) {
    "use strict";

    function isInteger(value) {
        return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
    }

    function isNoPositiveInteger(value) {
        return !isInteger(value) || value < 0;
    }

    return {
        isInteger: isInteger,
        isNoPositiveInteger: isNoPositiveInteger
    };
})(Math, isFinite);