H5.Touchable = (function () {
    "use strict";

    function Touchable(id, x, y, width, height) {
        // todo: change them (touchables) to AB rects, cause I think it relates more to the domain
        // todo: new idea: change em to drawables because it's a lot easier to work with!
        // (share same object.. resize stuff.. link stuff.. no context switch in your head ...)
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    return Touchable;
})();