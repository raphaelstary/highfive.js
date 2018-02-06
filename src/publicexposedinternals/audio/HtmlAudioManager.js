H5.HtmlAudioManager = (function (iterateEntries) {
    'use strict';

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

    HtmlAudioManager.prototype.onEnded = function (audio, fn, thisArg, once) {
        function extendedCallback() {
            if (once) {
                audio.removeEventListener('ended', extendedCallback);
            }
            if (thisArg) {
                fn.call(thisArg);
            } else {
                fn();
            }
        }

        audio.addEventListener('ended', extendedCallback);
    };

    return HtmlAudioManager;
})(H5.iterateEntries);
