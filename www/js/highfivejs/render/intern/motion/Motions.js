var Motions = (function (Math, LinePath, calcLinePoint, calcBezierPoint, Animations, inheritMethods, CirclePath,
    BezierCurvePath, calcCirclePoint) {
    "use strict";

    function Motions(animations) {
        this.animations = animations;

        inheritMethods(animations, this, Motions.prototype);
    }

    Motions.prototype.animate = function (drawable, path, callback) {

        var calculatePoint;
        if (path.curve instanceof LinePath) {
            calculatePoint = calcLinePoint;
        } else if (path.curve instanceof CirclePath) {
            calculatePoint = calcCirclePoint;
        } else if (path.curve instanceof BezierCurvePath) {
            calculatePoint = calcBezierPoint;
        }

        this.animations.animate(drawable, function (time) {
            var point = calculatePoint(time, path.curve);
            drawable.x = Math.floor(point.x);
            drawable.y = Math.floor(point.y);
        }, path, callback);
    };

    return Motions;
})(Math, LinePath, calcLinePoint, calcBezierPoint, Animations, inheritMethods, CirclePath, BezierCurvePath,
    calcCirclePoint);
