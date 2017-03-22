H5.HtmlAudioLoader = (function (SoundResources) {
    'use strict';

    var sounds;
    var dict;
    var path;
    var format;
    return {
        register: function (soundDict, optionalPath, optionalExtension) {
            dict = soundDict;
            path = optionalPath;
            format = optionalExtension;
        },
        load: function (resourceLoader) {
            sounds = new SoundResources(resourceLoader, path, format).createHtmlAudioSounds(dict);
        },
        process: function (services) {
            services.sounds = sounds;
        }
    };
})(H5.SoundResources);