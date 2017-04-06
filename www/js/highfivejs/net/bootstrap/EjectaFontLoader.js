H5.EjectaFontLoader = (function (ejecta, H5) {
    'use strict';

    var font;
    return {
        register: function (fontPath, name) {
            font = fontPath;
            H5.TV_FONT = name;
        },
        load: function () {
            ejecta.loadFont(font);
        },
        process: function (services) {
        }
    };
})(window.ejecta, H5);