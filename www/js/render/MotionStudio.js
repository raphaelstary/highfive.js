var MotionStudio = (function () {
    "use strict";

    function MotionStudio() {
        this.sceneDict = {};
    }

    MotionStudio.prototype.move = function (object, path, callback) {
        if (path) {
            var axis = path.startX === path.endX ? 'y' : 'x';
        }

        this.sceneDict[object.id] = {
            item: object,
            path: path,
            ready: callback,
            time: 0,
            axis: axis
        };
    };

    MotionStudio.prototype.update = function () {
        for (var key in this.sceneDict) {
            if (!this.sceneDict.hasOwnProperty(key)) {
                continue;
            }

            var node = this.sceneDict[key];

            if (!node.path)
                continue;

            if (node.path.duration > node.time) {

                if (node.axis === 'x') {
                    node.item.x = Math.floor(node.path.timingFn(node.time, node.path.startX, node.path.length, node.path.duration));

                } else if (node.axis === 'y') {
                    node.item.y = Math.floor(node.path.timingFn(node.time, node.path.startY, node.path.length, node.path.duration));
                }

                node.time++;
            } else {
                if (node.path.loop) {
                    node.time = 0;
                } else {
                    delete this.sceneDict[key];
                }

                if (node.ready) {
                    node.ready();
                }
            }
        }
    };

    return MotionStudio;
})();