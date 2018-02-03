H5.HtmlAudioSpriteLoader = (function (HtmlAudioSprite, installHtmlAudioSprite) {
    'use strict';

    var musicInfoFilePath;
    var musicFilePath;
    var sfxInfoFilePath;
    var sfxFilePath;

    var musicInfo;
    var music;
    var sfxInfo;
    var sfxTracks = [];
    var tracks = 0;

    return {
        register: function (musicInfoPath, musicPath, sfxInfoPath, sfxPath, sfxTrackCount) {
            musicInfoFilePath = musicInfoPath;
            musicFilePath = musicPath;
            sfxInfoFilePath = sfxInfoPath;
            sfxFilePath = sfxPath;

            tracks = sfxTrackCount;
        },
        load: function (resourceLoader) {
            sfxInfo = resourceLoader.addJSON(sfxInfoFilePath);
            musicInfo = resourceLoader.addJSON(musicInfoFilePath);

            music = resourceLoader.addAudio(musicFilePath);

            while (tracks-- > 0) {
                sfxTracks.push(resourceLoader.addAudio(sfxFilePath));
            }
        },
        postProcess: function (services) {
            services.sfx = new HtmlAudioSprite(sfxInfo.spritemap, sfxTracks, services.timer, services.stage);
            services.music = new HtmlAudioSprite(musicInfo.spritemap, music, services.timer, services.stage);

            installHtmlAudioSprite(services.events, services.sfx);
            installHtmlAudioSprite(services.events, services.music);
        }
    };
})(H5.HtmlAudioSprite, H5.installHtmlAudioSprite);
