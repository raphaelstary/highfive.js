H5.SubImage = (function () {
    "use strict";

    function SubImage(x, y, width, height, offSetX, offSetY, trimmedWidth, trimmedHeight, scaledOffSetX, scaledOffSetY,
        scaledTrimmedWidth, scaledTrimmedHeight, atlas) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.offSetX = offSetX;
        this.offSetY = offSetY;
        this.trimmedWidth = trimmedWidth;
        this.trimmedHeight = trimmedHeight;
        this.scaledOffSetX = scaledOffSetX;
        this.scaledOffSetY = scaledOffSetY;
        this.scaledTrimmedWidth = scaledTrimmedWidth;
        this.scaledTrimmedHeight = scaledTrimmedHeight;
        this.img = atlas;
    }

    return SubImage;
})();