window.onload = function () {
    'use strict';

    var app = H5.Bootstrapper
        .responsive()
        .keyBoard()
        .pointer()
        .wheel()
        .build(G.runMyScenes);

    app.start();
};