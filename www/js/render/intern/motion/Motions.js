var Motions = (function (Math, Object, BezierCurve, calcBezierPoint, Line, calcLinePoint) {
    "use strict";

    // handles low level moving of draw-ables
    function Motions() {
        this.motionsDict = {};
    }

    Motions.prototype.move = function (drawable, path, callback) {

        this.motionsDict[drawable.id] = {
            item: drawable,
            path: path,
            ready: callback,
            time: 0,
            moving: true
        };
    };

    Motions.prototype.update = function () {
        Object.keys(this.motionsDict).forEach(function (key) {
            var motion = this.motionsDict[key];

            if (!motion.moving) {
                return;
            }

            var path = motion.path;
            var curve = path.curve;

            if (path.duration > motion.time) {

                var time = path.timingFn(motion.time, 0, 1, path.duration);
                var point;
                if (curve instanceof Line) {
                    //var magnitude = path.timingFn(motion.time, 0, curve.length, path.duration);

                    //motion.item.x = Math.floor(curve.startX + curve.unitVectorX * magnitude);
                    //motion.item.y = Math.floor(curve.startY + curve.unitVectorY * magnitude);
                    point = calcLinePoint(time, curve);
                    motion.item.x = Math.floor(point.x);
                    motion.item.y = Math.floor(point.y);

                } else if (curve instanceof BezierCurve) {
                    point = calcBezierPoint(time, curve);
                    motion.item.x = Math.floor(point.x);
                    motion.item.y = Math.floor(point.y);
                }

                motion.time++;
            } else {
                motion.item.x = curve.endX;
                motion.item.y = curve.endY;

                if (path.loop) {
                    motion.time = 0;
                } else {
                    delete this.motionsDict[key];
                }

                if (motion.ready) {
                    motion.ready();
                }
            }
        }, this);
    };

    Motions.prototype.pause = function (drawable) {
        this.motionsDict[drawable.id].moving = false;
    };

    Motions.prototype.play = function (drawable) {
        this.motionsDict[drawable.id].moving = true;
    };

    Motions.prototype.remove = function (drawable) {
        delete this.motionsDict[drawable.id];
    };

    Motions.prototype.has = function (drawable) {
        return this.motionsDict[drawable.id] !== undefined;
    };

    return Motions;
})(Math, Object, BezierCurve, calcBezierPoint, Line, calcLinePoint);
