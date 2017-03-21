H5.EjectaFontLoader = (function (ejecta) {
    'use strict';

    var font;
    return {
        register: function (fontPath) {
            font = fontPath;
        },
        load: function () {
            ejecta.loadFont(font);
        },
        process: function (services) {
        }
    };
})(window.ejecta);