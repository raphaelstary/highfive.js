H5.changeRectangle = (function () {
    "use strict";

    function changeRectangle(rectangle, width, height, lineWidth) {
        rectangle.width = width;
        rectangle.height = height;
        rectangle.lineWidth = lineWidth;
    }

    return changeRectangle;
})();
