H5.HtmlAudioManager = (function (iterateEntries) {
    "use strict";

    function HtmlAudioManager(audioDict) {
        this.audioDict = audioDict;
    }

    HtmlAudioManager.prototype.get = function (name) {
        return this.audioDict[name];
    };

    HtmlAudioManager.prototype.muteAll = function () {
        iterateEntries(this.audioDict, function (sound) {
            sound.muted = true;
        });
    };

    HtmlAudioManager.prototype.unmuteAll = function () {
        iterateEntries(this.audioDict, function (sound) {
            sound.muted = false;
        });
    };

    HtmlAudioManager.prototype.setMasterVolume = function (value) {
        iterateEntries(this.audioDict, function (sound) {
            sound.volume = value;
        });
    };

    return HtmlAudioManager;
})(H5.iterateEntries);