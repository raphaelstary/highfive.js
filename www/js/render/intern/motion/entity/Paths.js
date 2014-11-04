var Paths = (function (Path, Math, Line, BezierCurve, Vectors) {
    "use strict";

    function createLine(startX, startY, endX, endY, speed, spacingFn, loop) {
        var vector = Vectors.get(startX, startY, endX, endY);
        var length = Vectors.magnitude(vector.x, vector.y);
        var unitVector = Vectors.normalize(vector.x, vector.y);
        var line = new Line(startX, startY, endX, endY, unitVector.x, unitVector.y, length);

        return new Path(line, speed, spacingFn, loop);
    }

    function createNewBezierCurvePath(a_x, a_y, b_x, b_y, c_x, c_y, d_x, d_y, speed, spacingFn, loop) {
        var curve = new BezierCurve(a_x, a_y, b_x, b_y, c_x, c_y, d_x, d_y);

        return new Path(curve, speed, spacingFn, loop);
    }

    return {
        getLine: createLine,
        getCurve: createNewBezierCurvePath
    };
})(Path, Math, Line, BezierCurve, Vectors);