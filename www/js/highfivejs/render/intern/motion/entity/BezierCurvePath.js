H5.BezierCurvePath = (function () {
    "use strict";

    function BezierCurvePath(pointA_x, pointA_y, pointB_x, pointB_y, pointC_x, pointC_y, pointD_x, pointD_y) {
        this.pointA_x = pointA_x;
        this.pointA_y = pointA_y;
        this.pointB_x = pointB_x;
        this.pointB_y = pointB_y;
        this.pointC_x = pointC_x;
        this.pointC_y = pointC_y;
        this.pointD_x = pointD_x;
        this.pointD_y = pointD_y;
    }

    return BezierCurvePath;
})();
