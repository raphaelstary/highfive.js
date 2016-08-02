H5.changePath = (function (Math, BezierCurvePath, LinePath, Vectors, CirclePath) {
    "use strict";

    function changePath(path, startX_or_x, startY_or_y, endX_or_radius, endY, p1_x, p1_y, p2_x, p2_y) {

        var curve = path.curve;
        if (curve instanceof LinePath) {
            var vector = Vectors.get(startX_or_x, startY_or_y, endX_or_radius, endY);
            var length = Vectors.magnitude(vector.x, vector.y);
            var unitVector = Vectors.normalize(vector.x, vector.y);

            curve.startX = startX_or_x;
            curve.startY = startY_or_y;
            curve.endX = endX_or_radius;
            curve.endY = endY;
            curve.length = length;
            curve.unitVectorX = unitVector.x;
            curve.unitVectorY = unitVector.y;
            curve.vectorX = vector.x;
            curve.vectorY = vector.y;

        } else if (curve instanceof CirclePath) {
            curve.x = startX_or_x;
            curve.y = startY_or_y;
            curve.radius = endX_or_radius

        } else if (curve instanceof BezierCurvePath) {
            curve.pointA_x = startX_or_x;
            curve.pointA_y = startY_or_y;
            curve.pointB_x = p1_x;
            curve.pointB_y = p1_y;
            curve.pointC_x = p2_x;
            curve.pointC_y = p2_y;
            curve.pointD_x = endX_or_radius;
            curve.pointD_y = endY;
        }
    }

    return changePath;
})(Math, H5.BezierCurvePath, H5.LinePath, H5.Vectors, H5.CirclePath);