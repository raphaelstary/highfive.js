G.installMyScenes = (function (Scenes, Width, Height) {
    "use strict";

    function installMyScenes(sceneServices) {
        // create your scenes and add them to the scene manager

        var scenes = new Scenes();

        scenes.add(function (next) {
            var stage = sceneServices.stage;
            stage.createText('Hello World :)').setPosition(Width.HALF, Height.HALF);
        });

        return scenes;
    }

    return installMyScenes;
})(H5.Scenes, H5.Width, H5.Height);