H5.HtmlAudioSprite = (function (Array) {
    "use strict";

    function AudioTrack(audioElement) {
        this.element = audioElement;
        this.playing = false;

        this.currentInfo = undefined;
        this.currentSound = undefined;
    }

    function SoundNode() {
        this.ended = false;
        this.volume = 1;
        this.loop = false;
    }

    function HtmlAudioSprite(info, audioElementOrElements) {
        this.info = info;

        if (audioElementOrElements instanceof Array) {
            this.tracks = audioElementOrElements.map(function (audioElem) {
                return new AudioTrack(audioElem);
            });
        } else {
            this.tracks = [new AudioTrack(audioElementOrElements)];
        }

        this.masterVolume = 1;
    }

    HtmlAudioSprite.prototype.setStage = function (stage) {
        this.stage = stage;
    };

    HtmlAudioSprite.prototype.update = function () {
        this.tracks.forEach(function (track) {
            if (!track.playing)
                return;

            if (track.element.currentTime < track.currentInfo.end)
                return;

            if (track.currentSound.loop) {
                track.element.currentTime = track.currentInfo.start;
                if (track.currentSound.__callback) track.currentSound.__callback();

            } else {
                this.__stop(track);
            }
        }, this);
    };

    HtmlAudioSprite.prototype.__stop = function (track) {
        track.element.pause();
        track.playing = false;
        track.currentSound.ended = true;
        if (track.currentSound.__callback) track.currentSound.__callback();
    };

    HtmlAudioSprite.prototype.muteAll = function () {
        this.tracks.forEach(function (track) {
            track.element.volume = 0;
        });
    };

    HtmlAudioSprite.prototype.unmuteAll = function () {
        this.tracks.forEach(function (track) {
            if (track.playing) {
                track.element.volume = track.currentSound.volume;
            } else {
                track.element.volume = this.masterVolume;
            }
        }, this);
    };

    HtmlAudioSprite.prototype.pauseAll = function () {
        this.tracks.forEach(function (track) {
            if (track.playing) track.element.pause();
        });
    };

    HtmlAudioSprite.prototype.resumeAll = function () {
        this.tracks.forEach(function (track) {
            if (track.playing) track.element.play();
        });
    };

    HtmlAudioSprite.prototype.stopAll = function () {
        this.tracks.forEach(function (track) {
            if (track.playing) this.__stop(track);
        }, this);
    };

    HtmlAudioSprite.prototype.setMasterVolume = function (value) {
        this.masterVolume = value;
        this.tracks.forEach(function (track) {
            if (track.playing) track.currentSound.volume = value;
            track.element.volume = value;
        });
    };

    HtmlAudioSprite.prototype.masterVolumeTo = function (value) {
        this.masterVolume = value;
        return this.tracks.map(function (track) {
            if (track.playing) track.currentSound.volume = value;
            return this.stage.audioVolumeTo(track.element, value);
        }, this);
    };

    HtmlAudioSprite.prototype.play = function (name) {
        var spriteInfo = this.info[name];
        var currentTrack;
        this.tracks.some(function (track) {
            if (!track.playing) currentTrack = track;
            return !track.playing;
        });

        if (!currentTrack) {
            console.log('no audio track available');
            return;
        }

        currentTrack.element.currentTime = spriteInfo.start;
        currentTrack.element.volume = this.masterVolume;
        currentTrack.element.play();
        currentTrack.playing = true;
        currentTrack.currentInfo = spriteInfo;
        var currentSound = new SoundNode();
        currentTrack.currentSound = currentSound;

        var self = this;
        return {
            stop: function () {
                if (currentSound.ended)
                    return;

                self.__stop(currentTrack);
            },
            volumeTo: function (value) {
                if (currentSound.ended)
                    return;

                currentSound.volume = value;
                return self.stage.audioVolumeTo(currentTrack.element, value);
            },
            setCallback: function (callback, self) {
                currentSound.__callback = self ? callback.bind(self) : callback;
                return this;
            },
            setLoop: function (loop) {
                currentSound.loop = loop;
                return this;
            },
            setVolume: function (value) {
                if (currentSound.ended)
                    return;
                currentTrack.element.volume = currentSound.volume = value;
                return this;
            },
            hasEnded: function () {
                return currentSound.ended;
            }
        }
    };

    return HtmlAudioSprite;
})(Array);