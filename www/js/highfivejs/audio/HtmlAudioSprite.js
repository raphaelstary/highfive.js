H5.HtmlAudioSprite = (function () {
    "use strict";

    function HtmlAudioSprite() {
    }

    HtmlAudioSprite.prototype.get = function (name) {
        return this.audioDict[name];
    };

    HtmlAudioSprite.prototype.muteAll = function () {
        iterateEntries(this.audioDict, function (sound) {
            sound.muted = true;
        });
    };

    HtmlAudioSprite.prototype.unmuteAll = function () {
        iterateEntries(this.audioDict, function (sound) {
            sound.muted = false;
        });
    };

    HtmlAudioSprite.prototype.stopAll =

        HtmlAudioSprite.prototype.setMasterVolume = function (value) {
            iterateEntries(this.audioDict, function (sound) {
                sound.volume = value;
            });
        };

    return HtmlAudioSprite;
})();