H5.SceneLoader = (function () {
    'use strict';

    var scenes;
    var path;
    return {
        register: function (scenesPath) {
            path = scenesPath;
        },
        load: function (resourceLoader) {
            scenes = resourceLoader.addJSON(path);
        },
        process: function (services) {
            services.scenes = scenes;
        }
    };
})();