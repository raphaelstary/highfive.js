H5.WebAudioSpriteLoader = (function (AudioContext, WebAudioSprite, installWebAudioSprite) {
    'use strict';

    var audioCtx;
    var music;
    var sfx;
    var musicInfo;
    var sfxInfo;

    var musicInfoFilePath;
    var musicFilePath;
    var sfxInfoFilePath;
    var sfxFilePath;

    return {
        register: function (musicInfoPath, musicPath, sfxInfoPath, sfxPath) {
            musicInfoFilePath = musicInfoPath;
            musicFilePath = musicPath;
            sfxInfoFilePath = sfxInfoPath;
            sfxFilePath = sfxPath;
        },
        load: function (resourceLoader) {
            audioCtx = new AudioContext();
            music = resourceLoader.addWebAudio(musicFilePath, audioCtx);
            sfx = resourceLoader.addWebAudio(sfxFilePath, audioCtx);

            sfxInfo = resourceLoader.addJSON(sfxInfoFilePath);
            musicInfo = resourceLoader.addJSON(musicInfoFilePath);
        },
        postProcess: function (services) {
            services.sfx = new WebAudioSprite(sfxInfo.spritemap, sfx.buffer, audioCtx, services.timer);
            services.music = new WebAudioSprite(musicInfo.spritemap, music.buffer, audioCtx, services.timer);

            installWebAudioSprite(services.events, services.sfx);
            installWebAudioSprite(services.events, services.music);
        }
    };
})(window.AudioContext, H5.WebAudioSprite, H5.installWebAudioSprite);