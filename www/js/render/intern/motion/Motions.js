var Motions = (function (Math, Object) {
    "use strict";

    // handles low level moving of draw-ables
    function Motions() {
        this.motionsDict = {};
    }

    Motions.prototype.move = function (drawable, path, callback) {
        var axis;
        if (path) {
            if (path.startX === path.endX) {
                axis = 'y';
            } else if (path.startY === path.endY) {
                axis = 'x';
//            axis = path.startX === path.endX ? 'y' : 'x';
            } else {
                axis = 'line'
            }
        }

        this.motionsDict[drawable.id] = {
            item: drawable,
            path: path,
            ready: callback,
            time: 0,
            axis: axis,
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
            if (path.duration > motion.time) {

                if (motion.axis === 'x') {
                    motion.item.x = Math.floor(path.timingFn(motion.time, path.startX, path.length, path.duration));

                } else if (motion.axis === 'y') {
                    motion.item.y = Math.floor(path.timingFn(motion.time, path.startY, path.length, path.duration));

                } else if (motion.axis == 'line') {
                    //var magnitude = Math.floor(path.timingFn(motion.time, 0, path.length, path.duration));
                    // todo implement movement on every (diagonal) line
                    // x + length * unitVector.x, y + length * unitVector.y -> end point
                    // see https://github.com/raphaelstary/highfive/blob/master/www/js/render/Renderer.js
                }

                motion.time++;
            } else {
                motion.item.x = path.endX;
                motion.item.y = path.endY;

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
})(Math, Object);
