window.onload = function () {
    'use strict';

    H5.Bootstrapper
        .build(function (services) {
            H5.setupFPSMeter(services);
        })
        .start();
};
