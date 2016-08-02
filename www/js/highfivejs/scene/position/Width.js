H5.Width = (function (calcScreenConst) {
    "use strict";

    return {
        FULL: function (width) {
            return width;
        },
        HALF: function (width) {
            return calcScreenConst(width, 2);
        },
        QUARTER: function (width) {
            return calcScreenConst(width, 4);
        },
        THIRD: function (width) {
            return calcScreenConst(width, 3);
        },
        THREE_QUARTER: function (width) {
            return calcScreenConst(width, 4, 3);
        },
        TWO_THIRD: function (width) {
            return calcScreenConst(width, 3, 2);
        },
        get: function (denominator, numerator) {
            return function (width) {
                return calcScreenConst(width, denominator, numerator);
            };
        }
    };
})(H5.calcScreenConst);
