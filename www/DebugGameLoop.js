var GameLoop = (function (requestAnimationFrame, Object) {
    "use strict";

    // callback from animationFrame infrastructure. tick list of given periodic handlers
    function GameLoop() {
        this.tickBus = {};
        this.disabled = {};
    }

    GameLoop.prototype.run = function () {
        stats.begin();
        var self = this;
        Object.keys(self.tickBus).forEach(function (key) {
            var fn = self.tickBus[key];
            if (fn) {
                fn();
            }
        });
        //Object.keys(self.tickBus).forEach(function (key) {
        //    var fn = self.tickBus[key];
        //    if (fn) {
        //        fn();
        //    }
        //});
        stats.end();
        requestAnimationFrame(this.run.bind(this));
    };

    GameLoop.prototype.add = function (id, periodicFunction) {
        this.tickBus[id] = periodicFunction;
    };

    GameLoop.prototype.remove = function (id) {
        delete this.tickBus[id];
        delete this.disabled[id];
    };

    GameLoop.prototype.disable = function (id) {
        this.disabled[id] = this.tickBus[id];
        delete this.tickBus[id];
    };

    GameLoop.prototype.enable = function (id) {
        this.tickBus[id] = this.disabled[id];
        delete this.disabled[id];
    };

    return GameLoop;
})(requestAnimFrame, Object);