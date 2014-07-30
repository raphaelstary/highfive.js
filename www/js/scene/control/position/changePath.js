var changePath = (function () {
    "use strict";

    function changePath(path, x, y, endX, endY) {
        var length = Math.abs(x - endX) + Math.abs(y - endY);
        if (endY < y || endX < x) {
            length = -length;
        }
        path.startX = x;
        path.startY = y;
        path.endX = endX;
        path.endY = endY;
        path.length = length;
    }

    return changePath;
})();