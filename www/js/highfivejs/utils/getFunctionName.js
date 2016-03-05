H5.getFunctionName = (function () {
    "use strict";

    function getFunctionName(fn) {
        var fnString = fn.toString();
        var startIndex = 'function '.length;
        var endIndex = fnString.indexOf('(');

        return fnString.slice(startIndex, endIndex);
    }

    return getFunctionName;
})();