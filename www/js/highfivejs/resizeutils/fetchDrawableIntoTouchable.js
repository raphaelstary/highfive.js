H5.fetchDrawableIntoTouchable = (function (changeTouchable) {
    "use strict";

    function fetchDrawableIntoTouchable(touchable, drawable) {
        changeTouchable(touchable, drawable.getCornerX(), drawable.getCornerY(), drawable.getWidth(),
            drawable.getHeight());
    }

    return fetchDrawableIntoTouchable;
})(H5.changeTouchable);