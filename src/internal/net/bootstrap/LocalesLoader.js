H5.LocalesLoader = (function (UniversalTranslator) {
    'use strict';

    var locales;
    var path;
    return {
        register: function (localesPath) {
            path = localesPath;
        },
        load: function (resourceLoader) {
            locales = resourceLoader.addJSON(path);
        },
        process: function (services) {
            services.messages = new UniversalTranslator(locales);
        }
    };
})(H5.UniversalTranslator);