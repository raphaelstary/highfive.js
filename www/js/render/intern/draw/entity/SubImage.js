var SubImage = (function () {
    "use strict";

    function SubImage(x, y, width, height, offSetX, offSetY, trimmedTileWidth, trimmedTileHeight, atlas) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.offSetX = offSetX;
        this.offSetY = offSetY;
        this.trimmedTileWidth = trimmedTileWidth;
        this.trimmedTileHeight = trimmedTileHeight;
        this.img = atlas;
    }

    return SubImage;
})();