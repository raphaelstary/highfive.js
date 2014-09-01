var Texture = (function (Math) {
    "use strict";

    function Texture(img, width, height, scale) {
        this.img = img;
        this.width = width;
        this.height = height;
        this.scale = scale;
        this.offSetX = - Math.floor(width / 2);
        this.offSetY = - Math.floor(height / 2);
    }

    return Texture;
})(Math);