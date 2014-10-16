var MyGameResources = (function (addFontToDOM, UniversalTranslator, SoundSpriteManager, AtlasResourceHelper, URL) {
    "use strict";

    var audioInfo,
        specialGameFont,
        gameFont,
        logoFont,
        locales,
        atlases = [],
        images = {};

    function registerFiles(resourceLoader) {
        audioInfo = resourceLoader.addJSON('data/audio.json');
        specialGameFont = resourceLoader.addFont('data/kenpixel_blocks.woff');
        gameFont = resourceLoader.addFont('data/kenpixel.woff');
        logoFont = resourceLoader.addFont('data/dooodleista.woff');
        locales = resourceLoader.addJSON('data/locales.json');

        AtlasResourceHelper.register(resourceLoader, atlases);

        return 5 + atlases.length;
    }

    function processFiles() {

        addFontToDOM([
            {name: 'SpecialGameFont', url: URL.createObjectURL(specialGameFont.blob)},
            {name: 'GameFont', url: URL.createObjectURL(gameFont.blob)},
            {name: 'LogoFont', url: URL.createObjectURL(logoFont.blob)}
        ]);

        var sounds = new SoundSpriteManager();
        sounds.load(audioInfo);

        return {
            message: new UniversalTranslator(locales),
            sounds: sounds,
            gfxCache: AtlasResourceHelper.process(atlases)
        };
    }

    return {
        create: registerFiles,
        process: processFiles
    };
})(addFontToDOM, UniversalTranslator, SoundSpriteManager, AtlasResourceHelper, window.URL || window.webkitURL);