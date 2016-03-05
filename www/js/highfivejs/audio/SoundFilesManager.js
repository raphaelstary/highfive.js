H5.SoundFilesManager = (function (Howl) {
    "use strict";

    function SoundFilesManager() {
        this.soundDict = {};
    }

    SoundFilesManager.prototype.load = function (soundNames) {
        var self = this;
        soundNames.forEach(function (name) {
            self.add(name);
        });
    };

    var path = 'sfx/';
    var format = '.wav';

    SoundFilesManager.prototype.add = function (name) {
        this.soundDict[name] = new Howl({
            urls: [path + name + format]
        });
    };

    SoundFilesManager.prototype.play = function (name) {
        var sound = this.soundDict[name];
        if (sound)
            sound.play();
    };

    return SoundFilesManager;
})(function(){});