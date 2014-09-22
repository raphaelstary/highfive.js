var calcScreenConst = (function (Math) {
    "use strict";

    function calcScreenConst(domain, numerator, denominator) {
        return Math.floor(domain / numerator * (denominator || 1));
    }

    return calcScreenConst;
})(Math);