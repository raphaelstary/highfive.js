var heightTwoThird = (function (calcScreenConst) {
    "use strict";

    function heightTwoThird(height) {
        return calcScreenConst(height, 3, 2);
    }

    return heightTwoThird;
})(calcScreenConst);