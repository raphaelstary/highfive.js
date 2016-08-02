H5.SoundSpriteManager = (function (Howl) {
    "use strict";

    function SoundSpriteManager() {
        this.sounds = null;
    }

    SoundSpriteManager.prototype.load = function (info) {
        this.sounds = new Howl(info);
    };

    SoundSpriteManager.prototype.play = function (name) {
        this.sounds.play(name);
    };

    return SoundSpriteManager;
})(function(){});