H5.calcLinePoint = (function () {
    "use strict";

    function calcLinePoint(time, line) {
        var x = line.startX + time * line.vectorX;
        var y = line.startY + time * line.vectorY;

        return {
            x: x,
            y: y
        }
    }

    return calcLinePoint;
})();
