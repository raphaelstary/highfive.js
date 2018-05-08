window.onload = function () {
    'use strict';

    H5.Bootstrapper
        .pointer()
        .build(function (services) {
            var helloWorld = services.visuals.createText('touch me, click me, tap me :)')
                .setColor('white')
                .setSize(H5.Font.get(20))
                .setPosition(H5.Width.HALF, H5.Height.HALF);

            var pushed = false;
            var pushingPointerId = -1;
            services.events.subscribe(H5.Event.POINTER, function (pointer) {
                if (!pushed && pointer.type == 'down' && H5.isHit(pointer, helloWorld)) {
                    helloWorld.setColor('#519657');
                    pushed = true;
                    pushingPointerId = pointer.id;
                    return;
                }

                if (!pushed && pointer.type == 'move' && H5.isHit(pointer, helloWorld)) {
                    helloWorld.setColor('#519657');
                    pushed = true;
                    pushingPointerId = pointer.id;
                    return;
                }

                if (pushed && pointer.id == pushingPointerId && pointer.type == 'up') {
                    helloWorld.setColor('white');
                    pushed = false;
                    pushingPointerId = -1;
                    return;
                }

                if (pushed && pointer.id == pushingPointerId && pointer.type == 'move' && !H5.isHit(pointer,
                        helloWorld)) {

                    helloWorld.setColor('white');
                    pushed = false;
                    pushingPointerId = -1;
                    // return;
                }
            });
        })
        .start();
};
