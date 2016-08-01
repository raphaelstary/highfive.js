H5.range = (function (Math) {
    "use strict";

    function range(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    return range;
})(Math);