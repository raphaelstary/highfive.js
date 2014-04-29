var GameLoop = (function () {
    "use strict";

    function GameLoop(animationFrame, renderer, scene, sceneManager) {
        this.animationFrame = animationFrame;
        this.renderer = renderer;
        this.scene = scene;
        this.sceneManager = sceneManager;
    }

    GameLoop.prototype.run = function () {
        this.animationFrame(this.run.bind(this));

        this.sceneManager.update();
        this.scene.update();
        this.renderer.draw();
    };

    return GameLoop;
})();