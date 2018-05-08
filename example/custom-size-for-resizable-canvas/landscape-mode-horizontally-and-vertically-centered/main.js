window.onload = function () {
    'use strict';

    // NEEDED in app.css:
    // body {
    //   display: flex;
    //   justify-content: center;
    //   align-items: center;
    // }

    H5.Bootstrapper
        .responsive(function (event) {
            return new H5.Promise(function (fulfill) {

                var width = event.target.innerWidth;
                var height = event.target.innerHeight;

                if (width * (9 / 16) > height) {

                    fulfill({
                        target: {
                            innerWidth: Math.floor(height * (16 / 9)),
                            innerHeight: height
                        }
                    });

                } else {

                    fulfill({
                        target: {
                            innerWidth: width,
                            innerHeight: Math.floor(width * (9 / 16))
                        }
                    });
                }
            });
        })
        .build(function (services) {
            services.visuals.createText('Hello World :)')
                .setColor('white')
                .setSize(H5.Font.get(20))
                .setPosition(H5.Width.HALF, H5.Height.HALF);
        })
        .start();
};
