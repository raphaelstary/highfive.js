H5.SoundResources = (function (Object, HtmlAudioManager) {
    'use strict';

    function SoundResources(resourceLoader, path, extension) {
        this.resourceLoader = resourceLoader;
        this.path = path || 'sfx/';
        this.extension = extension || '.mp3';
    }

    SoundResources.prototype.createHtmlAudioSounds = function (soundNamesToPathsDict) {
        var dictKeys = Object.keys(soundNamesToPathsDict);

        function toAudioFile(soundKey) {
            return this.resourceLoader.addAudio(this.path + soundNamesToPathsDict[soundKey] + this.extension);
        }

        function filesToDict(soundDict, sound, index) {
            soundDict[soundNamesToPathsDict[dictKeys[index]]] = sound;
            return soundDict;
        }

        var soundDict = dictKeys.map(toAudioFile, this).reduce(filesToDict, {});
        return new HtmlAudioManager(soundDict);
    };

    return SoundResources;
})(Object, H5.HtmlAudioManager);