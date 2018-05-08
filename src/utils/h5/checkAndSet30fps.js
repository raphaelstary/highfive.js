H5.checkAndSet30fps = (function (Math) {
    'use strict';

    function checkAndSet30fps(sceneStorage, visuals, shaker) {
        var fpsMean = Math.round(sceneStorage.fpsTotal / sceneStorage.fpsCount);
        var msMean = Math.round(sceneStorage.msTotal / sceneStorage.msCount);
        sceneStorage.fpsTotal = 0;
        sceneStorage.fpsCount = 0;
        sceneStorage.msTotal = 0;
        sceneStorage.msCount = 0;

        sceneStorage.lowPerformance = msMean > 15;
        if (fpsMean < 40) {
            sceneStorage.do30fps = true;
            visuals.visuals.spriteAnimations.set30fps();
            if (shaker) {
                shaker.__init(true);
            }
        } else {
            sceneStorage.do30fps = false;
            visuals.visuals.spriteAnimations.set30fps(false);
        }

        return {
            fps: fpsMean,
            ms: msMean
        };
    }

    return checkAndSet30fps;
})(Math);
