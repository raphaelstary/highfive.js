G.runMyScenes = (function (Scenes, SceneA, SceneB) {
    'use strict';

    function runMyScenes(services) {
        // create your scenes and add them to the scene manager, if you find that helpful

        var scenes = new Scenes();

        var sceneA = new SceneA(services);
        scenes.put('scene-a', sceneA.show.bind(sceneA));

        var sceneB = new SceneB(services);
        scenes.put('scene-b', sceneB.show.bind(sceneB));

        scenes.next('scene-a');
    }

    return runMyScenes;
})(H5.SceneMap, G.SceneA, G.SceneB);
