G.SceneB = (function (Width, Height) {
    'use strict';

    function SceneB(services) {
        this.__visuals = services.visuals;
        this.__timer = services.timer;
    }

    SceneB.prototype.show = function (next) {
        var hello = this.__visuals.createText('Scene B says, "Hello" (:')
            .setPosition(Width.HALF, Height.HALF);

        this.__timer.in(60, function () {
            hello.remove();

            next('scene-a');
        });
    };

    return SceneB;
})(H5.Width, H5.Height);
