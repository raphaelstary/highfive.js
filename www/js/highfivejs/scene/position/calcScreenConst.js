H5.calcScreenConst = (function (Math) {
    "use strict";

    function calcScreenConst(domain, denominator, numerator) {
        return Math.floor(domain / denominator * (numerator || 1));
    }

    return calcScreenConst;
})(Math);