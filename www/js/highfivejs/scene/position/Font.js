H5.Font = (function (calcScreenConst) {
    "use strict";

    return {
        _5: function (width, height) {
            return calcScreenConst(height, 5);
        },
        _10: function (width, height) {
            return calcScreenConst(height, 10);
        },
        _15: function (width, height) {
            return calcScreenConst(height, 15);
        },
        _20: function (width, height) {
            return calcScreenConst(height, 20);
        },
        _25: function (width, height) {
            return calcScreenConst(height, 25);
        },
        _30: function (width, height) {
            return calcScreenConst(height, 30);
        },
        _35: function (width, height) {
            return calcScreenConst(height, 35);
        },
        _40: function (width, height) {
            return calcScreenConst(height, 40);
        },
        _60: function (width, height) {
            return calcScreenConst(height, 60);
        },
        get: function (denominator, numerator) {
            return function (width, height) {
                return calcScreenConst(height, denominator, numerator);
            };
        }
    };
})(H5.calcScreenConst);