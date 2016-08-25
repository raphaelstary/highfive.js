H5.SoundSpriteManager = (function (Howl) {
    "use strict";

    function SoundSpriteManager() {
        this.sounds = null;
    }

    SoundSpriteManager.prototype.load = function (info) {
        this.sounds = new Howl(info);
    };

    SoundSpriteManager.prototype.play = function (name) {
        return this.sounds.play(name);
    };

    SoundSpriteManager.prototype.loop = function (id) {
        this.sounds.loop(true, id);
    };

    SoundSpriteManager.prototype.stop = function (id) {
        this.sounds.stop(id);
    };

    SoundSpriteManager.prototype.subscribe = function (id, event, callback) {
        this.sounds.on(event, callback, id);
    };

    SoundSpriteManager.prototype.notifyOnce = function (id, event, callback) {
        this.sounds.once(event, callback, id);
    };

    SoundSpriteManager.prototype.fadeOut = function (id) {
        this.sounds.fade(1, 0, 500, id);
    };

    SoundSpriteManager.prototype.isPlaying = function (id) {
        return this.sounds.playing(id);
    };

    return SoundSpriteManager;
})(Howl);