var fontSize_60 = (function (calcScreenConst) {
    "use strict";

    return function (width, height) {
        return calcScreenConst(height, 60);
    };
})(calcScreenConst);