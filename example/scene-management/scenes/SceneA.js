G.SceneA = (function (Width, Height) {
    'use strict';

    function SceneA(services) {
        this.__visuals = services.visuals;
        this.__timer = services.timer;
    }

    SceneA.prototype.show = function (next) {
        var hello = this.__visuals.createText('Hello to Scene A :)')
            .setPosition(Width.HALF, Height.HALF);

        this.__timer.in(60, function () {
            hello.remove();

            next('scene-b');
        });
    };

    return SceneA;
})(H5.Width, H5.Height);
