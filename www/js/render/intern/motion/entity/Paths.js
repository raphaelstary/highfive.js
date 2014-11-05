var Paths = (function (Math, Line, BezierCurve, Vectors, Animations) {
    "use strict";

    function createLine(startX, startY, endX, endY, speed, spacingFn, loop) {
        var vector = Vectors.get(startX, startY, endX, endY);
        var length = Vectors.magnitude(vector.x, vector.y);
        var unitVector = Vectors.normalize(vector.x, vector.y);
        var line = new Line(startX, startY, endX, endY, vector.x, vector.y, unitVector.x, unitVector.y, length);

        var path = Animations.get(0, 1, speed, spacingFn, loop);
        path.curve = line;
        return path;
    }

    function createNewBezierCurvePath(a_x, a_y, b_x, b_y, c_x, c_y, d_x, d_y, speed, spacingFn, loop) {
        var curve = new BezierCurve(a_x, a_y, b_x, b_y, c_x, c_y, d_x, d_y);

        var path = Animations.get(0, 1, speed, spacingFn, loop);
        path.curve = curve;
        return path;
    }

    return {
        getLine: createLine,
        getCurve: createNewBezierCurvePath
    };
})(Math, Line, BezierCurve, Vectors, Animations);
