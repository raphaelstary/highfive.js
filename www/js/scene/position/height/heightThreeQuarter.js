var heightThreeQuarter = (function (calcScreenConst) {
    "use strict";

    function heightThreeQuarter(height) {
        return calcScreenConst(height, 4, 3);
    }

    return heightThreeQuarter;
})(calcScreenConst);