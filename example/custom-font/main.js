window.onload = function () {
    'use strict';

    H5.Bootstrapper
        .responsive()
        .font('Pangolin-Regular.woff', 'my-custom-font-name') // LICENSE for the font in OFL.txt
        .build(function (services) {
            services.stage.createText('Hello World :)')
                .setSize(H5.Font.get(20))
                .setPosition(H5.Width.HALF, H5.Height.HALF)
                .setFont('my-custom-font-name');
        })
        .start();
};
