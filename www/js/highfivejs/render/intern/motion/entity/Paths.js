H5.Paths = (function (Math, LinePath, CirclePath, BezierCurvePath, Vectors, Animations) {
    "use strict";

    function createLine(startX, startY, endX, endY, speed, spacingFn, loop) {
        var vector = Vectors.get(startX, startY, endX, endY);
        var length = Vectors.magnitude(vector.x, vector.y);
        var unitVector = Vectors.normalize(vector.x, vector.y);
        var line = new LinePath(startX, startY, endX, endY, vector.x, vector.y, unitVector.x, unitVector.y, length);

        var path = Animations.get(0, 1, speed, spacingFn, loop);
        path.curve = line;
        return path;
    }

    function createCircle(x, y, radius, startAngle, endAngle, speed, spacingFn, loop) {
        var circle = new CirclePath(x, y, radius, startAngle, endAngle);
        var path = Animations.get(startAngle, endAngle, speed, spacingFn, loop);
        path.curve = circle;
        return path;
    }

    function createNewBezierCurvePath(a_x, a_y, b_x, b_y, c_x, c_y, d_x, d_y, speed, spacingFn, loop) {
        var curve = new BezierCurvePath(a_x, a_y, b_x, b_y, c_x, c_y, d_x, d_y);

        var path = Animations.get(0, 1, speed, spacingFn, loop);
        path.curve = curve;
        return path;
    }

    return {
        getLine: createLine,
        getCurve: createNewBezierCurvePath,
        getCircle: createCircle
    };
})(Math, H5.LinePath, H5.CirclePath, H5.BezierCurvePath, H5.Vectors, H5.Animations);
