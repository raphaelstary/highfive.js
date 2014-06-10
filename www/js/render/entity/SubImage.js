var SubImage = (function () {
    function SubImage(x, y, width, height, offSetX, offSetY, tileWidth, tileHeight, trimmedTileWidth, trimmedTileHeight) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.offSetX = offSetX;
        this.offSetY = offSetY;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.trimmedTileWidth = trimmedTileWidth;
        this.trimmedTileHeight = trimmedTileHeight;
    }

    return SubImage;
})();