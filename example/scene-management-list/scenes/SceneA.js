G.SceneA = (function (Width, Height, Promise) {
    'use strict';

    function SceneA(services) {
        this.__visuals = services.visuals;
        this.__timer = services.timer;
    }

    SceneA.prototype.show = function () {
        var hello = this.__visuals.createText('Hello to Scene A :)')
            .setPosition(Width.HALF, Height.HALF);

        this.__timer.in(60, function () {
            hello.remove();

            nextScene();
        });

        var nextScene;

        return new Promise(function (resolve) {
            nextScene = resolve;
        });
    };

    return SceneA;
})(H5.Width, H5.Height, H5.Promise);
