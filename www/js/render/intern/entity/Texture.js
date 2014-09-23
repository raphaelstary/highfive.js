var Texture = (function (Math) {
    "use strict";

    function Texture(img, width, height, scale) {
        this.img = img;
        this.width = width;
        this.height = height;
        this.scale = scale;
    }

    return Texture;
})(Math);