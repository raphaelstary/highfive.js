var changePath = (function (Math, BezierCurve, Line, Vectors) {
    "use strict";

    function changePath(path, startX, startY, endX, endY, p1_x, p1_y, p2_x, p2_y) {

        var curve = path.curve;
        if (curve instanceof Line) {
            var vector = Vectors.get(startX, startY, endX, endY);
            var length = Vectors.magnitude(vector.x, vector.y);
            var unitVector = Vectors.normalize(vector.x, vector.y);

            curve.startX = startX;
            curve.startY = startY;
            curve.endX = endX;
            curve.endY = endY;
            curve.length = length;
            curve.unitVectorX = unitVector.x;
            curve.unitVectorY = unitVector.y;
            curve.vectorX = vector.x;
            curve.vectorY = vector.y;

        } else if (curve instanceof BezierCurve) {
            curve.pointA_x = startX;
            curve.pointA_y = startY;
            curve.pointB_x = p1_x;
            curve.pointB_y = p1_y;
            curve.pointC_x = p2_x;
            curve.pointC_y = p2_y;
            curve.pointD_x = endX;
            curve.pointD_y = endY;
        }
    }

    return changePath;
})(Math, BezierCurve, Line, Vectors);