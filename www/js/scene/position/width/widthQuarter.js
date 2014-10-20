var widthQuarter = (function (calcScreenConst) {
    "use strict";

    function widthQuarter(width) {
        return calcScreenConst(width, 4);
    }

    return widthQuarter;
})(calcScreenConst);