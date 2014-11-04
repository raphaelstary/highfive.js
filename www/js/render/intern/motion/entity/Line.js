var Line = (function () {
    "use strict";

    function Line(startX, startY, endX, endY, unitVectorX, unitVectorY, length) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.unitVectorX = unitVectorX;
        this.unitVectorY = unitVectorY;
        this.length = length;
    }

    return Line;
})();
