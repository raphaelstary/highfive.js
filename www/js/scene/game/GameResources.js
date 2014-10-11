var GameResources = (function (addFontToDOM, URL) {
    "use strict";

    var cowboy_blue, cowboy_red, gameFont, logoFont;

    function registerFiles(resourceLoader) {
        cowboy_blue = resourceLoader.addImage('gfx/cowboy_blue.png');
        cowboy_red = resourceLoader.addImage('gfx/cowboy_red.png');
        gameFont = resourceLoader.addFont('data/barn.woff');
        logoFont = resourceLoader.addFont('data/dooodleista.woff');
    }

    function processFiles(textureCache) {
        textureCache.add('cowboy_blue', cowboy_blue);
        textureCache.add('cowboy_red', cowboy_red);

        addFontToDOM([
            {name: 'GameFont', url: URL.createObjectURL(gameFont.blob)},
            {name: 'LogoFont', url: URL.createObjectURL(logoFont.blob)}
        ]);
    }

    return {
        create: registerFiles,
        process: processFiles
    };
})(addFontToDOM, window.URL || window.webkitURL);