var GameLoop = (function () {
    "use strict";

    function GameLoop(animationFrame, renderer, motionStudioManager, animationStudio, animationStudioManager) {
        this.animationFrame = animationFrame;
        this.renderer = renderer;
        this.motionStudioManager = motionStudioManager;
        this.animationStudio = animationStudio;
        this.animationStudioManager = animationStudioManager;
        this.ticker = 0;
        this.tickBus = {};
    }

    GameLoop.prototype.run = function () {
        this.animationFrame(this.run.bind(this));

        this.motionStudioManager.update();
        this.renderer.draw();
        if (this.ticker % 2 === 0) {
            this.animationStudio.nextFrame();
            this.ticker = 0;
        }
        for (var key in this.tickBus) {
            if (!this.tickBus.hasOwnProperty(key)) {
                continue;
            }
            this.tickBus[key]();
        }
        this.animationStudioManager.update();
        this.ticker++;
    };

    GameLoop.prototype.add = function (id, callback) {
        this.tickBus[id] = callback;
    };

    GameLoop.prototype.remove = function (id) {
        delete this.tickBus[id];
    };

    return GameLoop;
})();