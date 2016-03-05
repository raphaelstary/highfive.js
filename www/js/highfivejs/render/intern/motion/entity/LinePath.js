H5.LinePath = (function () {
    "use strict";

    function LinePath(startX, startY, endX, endY, vectorX, vectorY, unitVectorX, unitVectorY, length) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.vectorX = vectorX;
        this.vectorY = vectorY;
        this.unitVectorX = unitVectorX;
        this.unitVectorY = unitVectorY;
        this.length = length;
    }

    return LinePath;
})();
