H5.SoundResources = (function (Object, HtmlAudioManager) {
    "use strict";

    function SoundResources(resourceLoader, path, format) {
        this.resourceLoader = resourceLoader;
        this.path = path || 'sfx/';
        this.format = format || '.mp3';
    }

    SoundResources.prototype.createHtmlAudioSounds = function (soundNamesDict) {
        var dictKeys = Object.keys(soundNamesDict);

        function toAudioFile(soundKey) {
            return this.resourceLoader.addAudio(this.path + soundNamesDict[soundKey] + this.format);
        }

        function filesToDict(soundDict, sound, index) {
            soundDict[soundNamesDict[dictKeys[index]]] = sound;
            return soundDict;
        }

        var soundDict = dictKeys.map(toAudioFile, this).reduce(filesToDict, {});
        return new HtmlAudioManager(soundDict);
    };

    return SoundResources;
})(Object, H5.HtmlAudioManager);