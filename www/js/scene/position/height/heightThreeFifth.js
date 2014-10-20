var heightThreeFifth = (function (calcScreenConst) {
    "use strict";

    function heightThreeFifth(height) {
        return calcScreenConst(height, 5, 3);
    }

    return heightThreeFifth;
})(calcScreenConst);