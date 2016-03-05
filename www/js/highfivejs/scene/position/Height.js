H5.Height = (function (calcScreenConst) {
    "use strict";

    return {
        _400: function (height) {
            return calcScreenConst(height, 6, 5);
        },
        BOTTOM_RASTER: function (screenHeight) {
            return calcScreenConst(screenHeight, 20, 19);
        },
        TOP_RASTER: function (screenHeight) {
            return calcScreenConst(screenHeight, 20);
        },
        FULL: function (height) {
            return height;
        },
        FIFTH: function (height) {
            return calcScreenConst(height, 5);
        },
        FOUR_FIFTH: function (height) {
            return calcScreenConst(height, 5, 4);
        },
        HALF: function (screenHeight) {
            return calcScreenConst(screenHeight, 2);
        },
        QUARTER: function (screenHeight) {
            return calcScreenConst(screenHeight, 4);
        },
        THIRD: function (height) {
            return calcScreenConst(height, 3);
        },
        THREE_FIFTH: function (height) {
            return calcScreenConst(height, 5, 3);
        },
        THREE_QUARTER: function (height) {
            return calcScreenConst(height, 4, 3);
        },
        TWO_FIFTH: function (height) {
            return calcScreenConst(height, 5, 2);
        },
        TWO_THIRD: function (height) {
            return calcScreenConst(height, 3, 2);
        },
        get: function (denominator, numerator) {
            return function (height) {
                return calcScreenConst(height, denominator, numerator);
            };
        }
    };
})(H5.calcScreenConst);