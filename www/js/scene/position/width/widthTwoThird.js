var widthTwoThird = (function (calcScreenConst) {
    "use strict";

    function widthTwoThird(width) {
        return calcScreenConst(width, 3, 2);
    }

    return widthTwoThird;
})(calcScreenConst);