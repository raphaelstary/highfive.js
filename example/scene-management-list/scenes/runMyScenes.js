G.runMyScenes = (function (Scenes, SceneA, SceneB) {
    'use strict';

    function runMyScenes(services) {
        // create your scenes and add them to the scene manager, if you find that helpful

        var scenes = new Scenes();

        var sceneA = new SceneA(services);
        scenes.add(sceneA.show.bind(sceneA));

        var sceneB = new SceneB(services);
        scenes.add(sceneB.show.bind(sceneB));

        scenes.next();
    }

    return runMyScenes;
})(H5.SceneList, G.SceneA, G.SceneB);
