G.runMyScenes = (function (Scenes, Width, Height) {
    'use strict';

    function runMyScenes(services) {
        // create your scenes and add them to the scene manager

        var scenes = new Scenes();

        scenes.put('my-scene', function (next) {
            var hello = services.stage.createText('Hello World :)').setPosition(Width.HALF, Height.HALF);

            services.timer.in(30, function () {
                hello.remove();

                next('my-other-scene');

            });
        });

        scenes.put('my-other-scene', function (next) {
            var hallo = services.stage.createText('Hallo Welt (:').setPosition(Width.HALF, Height.HALF);

            services.timer.in(30, function () {
                hallo.remove();

                next('my-scene');

            });
        });

        scenes.next('my-scene');
    }

    return runMyScenes;
})(H5.SceneMap, H5.Width, H5.Height);