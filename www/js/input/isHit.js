var isHit = (function () {
    "use strict";

    function isHit(pointer, rect) {
        return pointer.clientX > rect.x && pointer.clientX < rect.x + rect.width && pointer.clientY > rect.y &&
            pointer.clientY < rect.y + rect.height;
    }

    return isHit;
})();