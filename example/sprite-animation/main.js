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
                .setCallback(function () {
                    // console.log('1st run is over');

                    services.timer.in(30, function () {
                        // console.log('force end of looping sprite');
                        spriteAnimation.finish();

                        // console.log('let\'s over');
                        title.animate('animation-test', 110)
                            .setLoop(false)
                            .setCallback(function () {

                                // console.log('one more time - now forever');
                                title.animate('animation-test', 110);

                            });
                    });
                });
        })
        .start();
};
