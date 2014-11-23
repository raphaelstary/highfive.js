var GameLoop = (function (requestAnimationFrame, Object) {
    "use strict";

    // callback from animationFrame infrastructure. tick list of given periodic handlers
    function GameLoop() {
        this.tickBus = {};
    }

    GameLoop.prototype.run = function () {
        requestAnimationFrame(this.run.bind(this));

        var self = this;
        Object.keys(self.tickBus).forEach(function (key) {
            var fn = self.tickBus[key];
            if (fn)
                fn();
        });
    };

    GameLoop.prototype.add = function (id, periodicFunction) {
        this.tickBus[id] = periodicFunction;
    };

    GameLoop.prototype.remove = function (id) {
        delete this.tickBus[id];
    };

    return GameLoop;
})(requestAnimFrame, Object);