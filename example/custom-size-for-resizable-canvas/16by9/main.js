window.onload = function () {
    'use strict';

    // NEEDED in app.css:
    // body {
    //   display: flex;
    //   justify-content: center;
    //   align-items: center;
    // }

    H5.Bootstrapper
        .responsive(H5.mapToWideScreen)
        .build(function (services) {
            services.visuals.createText('📺 16:9 😎')
                .setColor('white')
                .setSize(H5.Font.get(20))
                .setPosition(H5.Width.HALF, H5.Height.HALF);
        })
        .start();
};
