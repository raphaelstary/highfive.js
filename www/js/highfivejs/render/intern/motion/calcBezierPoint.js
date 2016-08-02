H5.calcBezierPoint = (function () {
    "use strict";

    function calcBezierPoint(time, curve) {
        var u = 1 - time;
        var tt = time * time;
        var uu = u * u;
        var uuu = uu * u;
        var ttt = tt * time;

        function calcTerms(p0, p1, p2, p3) {
            return uuu * p0 //first term
                + 3 * uu * time * p1 //second term
                + 3 * u * tt * p2 //third term
                + ttt * p3; //fourth term
        }

        return {
            x: calcTerms(curve.pointA_x, curve.pointB_x, curve.pointC_x, curve.pointD_x),
            y: calcTerms(curve.pointA_y, curve.pointB_y, curve.pointC_y, curve.pointD_y)
        };
    }

    return calcBezierPoint;
})();
