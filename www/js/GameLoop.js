var GameLoop = (function () {
    "use strict";

    function GameLoop(animationFrame, renderer, motionStudioManager, animationStudio, animationStudioManager) {
        this.animationFrame = animationFrame;
        this.renderer = renderer;
        this.motionStudioManager = motionStudioManager;
        this.animationStudio = animationStudio;
        this.animationStudioManager = animationStudioManager;
        this.ticker = 0;
    }

    GameLoop.prototype.run = function () {
        this.animationFrame(this.run.bind(this));

        this.motionStudioManager.update();
        this.renderer.draw();
        if (this.ticker % 2 === 0) {
            this.animationStudio.nextFrame();
        }
        this.animationStudioManager.update();
        this.ticker++;
    };

    return GameLoop;
})();