var GameLoop = (function () {
    "use strict";

    function GameLoop(animationFrame, renderer, scene, sceneManager, animationStudio, animationStudioManager) {
        this.animationFrame = animationFrame;
        this.renderer = renderer;
        this.scene = scene;
        this.sceneManager = sceneManager;
        this.animationStudio = animationStudio;
        this.animationStudioManager = animationStudioManager;
        this.ticker = 0;
    }

    GameLoop.prototype.run = function () {
        this.animationFrame(this.run.bind(this));

        this.sceneManager.update();
        this.scene.update();
        this.renderer.draw();
        if (this.ticker % 2 === 0) {
            this.animationStudio.nextFrame();
        }
        this.animationStudioManager.update();
        this.ticker++;
    };

    return GameLoop;
})();