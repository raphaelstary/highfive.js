window.onload = function () {
    'use strict';

    H5.Bootstrapper
        .responsive()
        .fixedRezAtlas(1920, 1080, 'atlas')
        .build(G.runMonkeyTest)
        .start();
};