H5.FontLoader = (function (addFontToDOM, URL) {
    'use strict';

    var font;
    var path;
    var name;
    return {
        register: function (fontPath, fontName) {
            path = fontPath;
            name = fontName;
        },
        load: function (resourceLoader) {
            font = resourceLoader.addFont(path);
        },
        process: function () {
            if (URL) {
                addFontToDOM([
                    {
                        name: name,
                        url: URL.createObjectURL(font.blob)
                    }
                ]);
            }
        }
    };
})(H5.addFontToDOM, window.URL || window.webkitURL);