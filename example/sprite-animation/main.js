window.onload = function () {
    'use strict';

    H5.Bootstrapper
        .responsive(H5.mapToWideScreen)
        .atlas(function (createAtlasPaths) {
            return createAtlasPaths()
                .add(1080)
                .add(720)
                .getResolver();
        })
        .build(function (services) {
            var title = services.stage.createImage('animation-test_0000')
                .setPosition(H5.Width.HALF, H5.Height.HALF);
            title.animate('animation-test', 110);
        })
        .start();
};
