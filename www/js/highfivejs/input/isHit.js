H5.isHit = (function () {
    "use strict";

    function isHit(pointer, rect) {
        return pointer.x > rect.getCornerX() && pointer.x < rect.getEndX() && pointer.y > rect.getCornerY() &&
            pointer.y < rect.getEndY();
    }

    return isHit;
})();