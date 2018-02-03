window.onload = function () {
    'use strict';

    // NEEDED in app.css: html{text-align: center;}

    H5.Bootstrapper
        .responsive(function (event) {
            return new H5.Promise(function (fulfill) {

                var width = event.target.innerWidth;
                var height = event.target.innerHeight;

                if (width / height < 9 / 16) {

                    fulfill(event);

                } else {

                    fulfill({
                        target: {
                            innerWidth: Math.floor(height * (9 / 16)),
                            innerHeight: height
                        }
                    });

                }
            });
        })
        .pointer()
        .build(function (services) {
            var helloWorld = services.stage.createText('Hello World :)')
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

                if (pushed && pointer.id == pushingPointerId && pointer.type == 'move' &&
                    !H5.isHit(pointer, helloWorld)) {

                    helloWorld.setColor('white');
                    pushed = false;
                    pushingPointerId = -1;
                    // return;
                }
            });
        }).start();
};
