var isHit = (function () {
    "use strict";

    function isHit(pointer, rect) {
        return pointer.x > rect.x && pointer.x < rect.x + rect.width && pointer.y > rect.y &&
            pointer.y < rect.y + rect.height;
    }

    return isHit;
})();