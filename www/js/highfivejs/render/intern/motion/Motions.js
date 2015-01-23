var Motions = (function (Math, Line, calcLinePoint, calcBezierPoint, Animations, inheritMethods) {
    "use strict";

    function Motions(animations) {
        this.animations = animations;

        inheritMethods(animations, this, Motions.prototype);
    }

    Motions.prototype.animate = function (drawable, path, callback) {

        var calculatePoint = path.curve instanceof Line ? calcLinePoint : calcBezierPoint;

        this.animations.animate(drawable, function (time) {
            var point = calculatePoint(time, path.curve);
            drawable.x = Math.floor(point.x);
            drawable.y = Math.floor(point.y);
        }, path, callback);
    };

    return Motions;
})(Math, Line, calcLinePoint, calcBezierPoint, Animations, inheritMethods);
