var GameLoop = (function (requestAnimationFrame) {
    "use strict";

    // callback from animationFrame infrastructure. tick list of given periodic handlers
    function GameLoop() {
        this.tickBus = {};
    }

    GameLoop.prototype.run = function () {
        requestAnimationFrame(this.run.bind(this));

        for (var key in this.tickBus) {
            this.tickBus[key]();
        }
    };

    GameLoop.prototype.add = function (id, periodicFunction) {
        this.tickBus[id] = periodicFunction;
    };

    GameLoop.prototype.remove = function (id) {
        delete this.tickBus[id];
    };

    return GameLoop;
})(requestAnimFrame);