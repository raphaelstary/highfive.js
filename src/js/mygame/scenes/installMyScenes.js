G.installMyScenes = (function (SceneManager, Width, Height) {
    "use strict";

    function installMyScenes(sceneServices) {
        // create your scenes and add them to the scene manager

        var sceneManager = new SceneManager();

        sceneManager.add(function (next) {
            var stage = sceneServices.stage;
            stage.createText('Hello World :)').setPosition(Width.HALF, Height.HALF);
        });

        return sceneManager;
    }

    return installMyScenes;
})(H5.SceneManager, H5.Width, H5.Height);