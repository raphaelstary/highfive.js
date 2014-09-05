var Touchables = (function (Touchable) {
    "use strict";

    var TOUCHABLE = "_touch";

    function createNew(drawable) {
        return new Touchable(drawable + TOUCHABLE, drawable.getCornerX(), drawable.getCornerY(),
            drawable.getWidth(), drawable.getHeight());
    }

    return {
        get: createNew
    };
})(Touchable);