window.onload = function () {
    'use strict';

    H5.Bootstrapper
        .responsive()
        .gamePad()
        .build(G.runMyScenes)
        .start();
};