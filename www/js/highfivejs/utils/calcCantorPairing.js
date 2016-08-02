H5.calcCantorPairing = (function () {
    "use strict";

    return function (x, y) {
        return (x + y) * (x + y + 1) / 2 + y;
    };
})();