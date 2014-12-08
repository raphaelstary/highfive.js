var isHit = (function (getDevicePixelRatio) {
    "use strict";

    var PIXEL_RATIO = getDevicePixelRatio();

    function isHit(pointer, rect) {
        var x = rect.x / PIXEL_RATIO;
        var y = rect.y / PIXEL_RATIO;
        var width = rect.width / PIXEL_RATIO;
        var height = rect.height / PIXEL_RATIO;
        return pointer.clientX > x && pointer.clientX < x + width && pointer.clientY > y &&
            pointer.clientY < y + height;
    }

    return isHit;
})(getDevicePixelRatio);