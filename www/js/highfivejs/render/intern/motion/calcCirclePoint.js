H5.calcCirclePoint = (function (Vectors) {
    "use strict";

    function calcCirclePoint(time, circle) {
        return {
            x: Vectors.getX(circle.x, circle.radius, time),
            y: Vectors.getY(circle.y, circle.radius, time)
        };
    }

    return calcCirclePoint;
})(H5.Vectors);