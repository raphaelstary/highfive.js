G.SceneB = (function (Width, Height, Promise) {
    'use strict';

    function SceneB(services) {
        this.__visuals = services.visuals;
        this.__timer = services.timer;
    }

    SceneB.prototype.show = function () {
        var hello = this.__visuals.createText('Scene B says, "Hello" (:')
            .setPosition(Width.HALF, Height.HALF);

        this.__timer.in(60, function () {
            hello.remove();

            nextScene('scene-a');
        });

        var nextScene;

        return new Promise(function (resolve) {
            nextScene = resolve;
        });
    };

    return SceneB;
})(H5.Width, H5.Height, H5.Promise);
