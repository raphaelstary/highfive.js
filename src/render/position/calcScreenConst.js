H5.calcScreenConst = (function (Math) {
    'use strict';

    function calcScreenConst(domain, denominator, numerator) {
        return Math.floor(domain / denominator * (numerator === undefined ? 1 : numerator));
    }

    return calcScreenConst;
})(Math);
