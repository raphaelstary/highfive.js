var widthThreeQuarter = (function (calcScreenConst) {
    "use strict";

    function widthThreeQuarter(width) {
        return calcScreenConst(width, 4, 3);
    }

    return widthThreeQuarter;
})(calcScreenConst);