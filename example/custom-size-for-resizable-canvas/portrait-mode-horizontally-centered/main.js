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
        .build(function (services) {
            services.stage.createText('Hello World :)')
                .setColor('white')
                .setSize(H5.Font.get(20))
                .setPosition(H5.Width.HALF, H5.Height.HALF);
        }).start();
};