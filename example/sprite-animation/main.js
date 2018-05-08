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

            var title = services.visuals.createImage('animation-test_0000')
                .setPosition(H5.Width.HALF, H5.Height.HALF);

            var spriteAnimation = title.animate('animation-test', 110)
                .setLoop(true)
                .setCallback(function () {

                    services.timer.in(60, function () {
                        spriteAnimation.finish();

                        title.animate('animation-test', 110)
                            .setCallback(function () {

                                services.timer.in(60, function () {

                                    title.animate('animation-test', 110)
                                        .setLoop(true);

                                });

                            });
                    });
                });
        })
        .start();
};
