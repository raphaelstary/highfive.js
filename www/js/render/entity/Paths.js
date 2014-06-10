var Paths = (function (Path) {
    "use strict";

    function createNew(x, y, endX, endY, speed, spacingFn, loop) {
        var length = Math.abs(x - endX) + Math.abs(y - endY);
        if (endY < y || endX < x) {
            length = -length;
        }
        return new Path(x, y, endX, endY, length, speed, spacingFn, loop);
    }

    return {
        get: createNew
    };
})(Path);