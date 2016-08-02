H5.ImageWrapper = (function () {
    "use strict";

    function ImageWrapper(img, width, height, scale) {
        this.img = img;
        this.width = width;
        this.height = height;
        this.scale = scale;
    }

    return ImageWrapper;
})();