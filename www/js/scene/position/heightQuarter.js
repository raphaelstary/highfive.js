var heightQuarter = (function (calcScreenConst) {
    "use strict";

    function heightQuarter(screenHeight) {
        return calcScreenConst(screenHeight, 4);
    }

    return heightQuarter;
})(calcScreenConst);