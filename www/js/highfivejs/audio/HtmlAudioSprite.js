H5.HtmlAudioSprite = (function (Array, Transition) {
    "use strict";

    function HtmlAudioTrack(audioElement) {
        this.element = audioElement;
        this.playing = false;

        this.currentInfo = undefined;
        this.currentSound = undefined;
    }

    function AudioNode() {
        this.started = false;
        this.ended = false;
        this.volume = 1;
        this.mute = false;
        this.loop = false;
        this.callback = undefined;
    }

    function HtmlAudioSprite(info, audioElementOrElements, timer, stage) {
        this.info = info;

        if (audioElementOrElements instanceof Array) {
            this.tracks = audioElementOrElements.map(function (audioElem) {
                return new HtmlAudioTrack(audioElem);
            });
        } else {
            this.tracks = [new HtmlAudioTrack(audioElementOrElements)];
        }

        this.timer = timer;
        this.stage = stage;

        this.masterVolume = 1;
    }

    HtmlAudioSprite.prototype.update = function () {
        this.tracks.forEach(function (track) {
            if (!track.playing)
                return;

            if (track.element.currentTime < track.currentInfo.end)
                return;

            if (track.currentSound.loop) {
                track.element.currentTime = track.currentInfo.start;
                if (track.currentSound.callback) track.currentSound.callback();

            } else {
                this.__stop(track);
            }
        }, this);
    };

    HtmlAudioSprite.prototype.__stop = function (track) {
        track.element.pause();
        track.playing = false;
        track.currentSound.ended = true;
        if (track.currentSound.callback) track.currentSound.callback();
    };

    HtmlAudioSprite.prototype.muteAll = function () {
        this.tracks.forEach(function (track) {
            track.element.volume = 0;
            if (track.currentSound) {
                track.currentSound.mute = true;
            }
        });
    };

    HtmlAudioSprite.prototype.unmuteAll = function () {
        this.tracks.forEach(function (track) {
            if (track.playing) {
                track.element.volume = track.currentSound.volume;
                if (track.currentSound) {
                    track.currentSound.mute = false;
                }
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

    HtmlAudioSprite.prototype.masterVolumeTo = function (value, duration, callback, self) {
        this.masterVolume = value;
        this.tracks.forEach(function (track) {
            if (track.playing) track.currentSound.volume = value;
            this.stage.audioVolumeTo(track.element, value)
                .setDuration(duration);
        }, this);
        this.timer.doLater(callback, duration, self);
    };

    var animationMock = {
        isAnimation: false,
        setDuration: returnThis,
        setSpacing: returnThis,
        setLoop: returnThis,
        setCallback: returnThis,
        finish: returnThis
    };

    function returnThis() {
        return this;
    }

    var audioMock = {
        trackAvailable: false,
        stop: function () {
        },
        mute: returnThis,
        unmute: returnThis,
        volumeTo: function () {
            return animationMock;
        },
        setCallback: function (callback, self) {
            if (self) {
                callback.call(self);
            } else {
                callback();
            }
            return this;
        },
        setLoop: returnThis,
        setVolume: returnThis,
        hasEnded: function () {
            return true;
        }
    };

    HtmlAudioSprite.prototype.play = function (name) {
        var self = this;
        var currentTrack;

        function startTrack() {

            self.tracks.some(function (track) {
                if (!track.playing) currentTrack = track;
                return !track.playing;
            });

            if (!currentTrack) {
                console.log('no audio track available');
                return audioMock;
            }

            currentTrack.element.currentTime = spriteInfo.start;

            if (currentSound.mute) {
                currentTrack.element.volume = 0;
            } else if (currentSound.volume !== 1) {
                currentTrack.element.volume = currentSound.volume;
            } else if (self.masterVolume !== 1) {
                currentTrack.element.volume = self.masterVolume;
            }

            currentTrack.element.play();
            currentTrack.playing = true;
            currentTrack.currentInfo = spriteInfo;
            currentTrack.currentSound = currentSound;

            currentSound.started = true;
        }

        var spriteInfo = this.info[name];
        var currentSound = new AudioNode();

        return {
            trackAvailable: true,
            start: function () {
                if (currentSound.started)
                    return;
                startTrack();
            },
            stop: function () {
                if (currentSound.ended || !currentSound.started)
                    return;

                self.__stop(currentTrack);
            },
            mute: function () {
                currentSound.mute = true;
                if (!currentSound.ended && currentSound.started) currentTrack.element.volume = 0;
                return this;
            },
            unmute: function () {
                currentSound.mute = false;
                if (!currentSound.ended && currentSound.started) currentTrack.element.volume = currentSound.volume;
                return this;
            },
            volumeTo: function (value, duration, callback, that) {
                if (currentSound.ended || !currentSound.started)
                    return animationMock;

                currentSound.volume = value;
                self.stage.audioVolumeTo(currentTrack.element, value)
                    .setDuration(duration)
                    .setSpacing(Transition.EASE_OUT_EXPO)
                    .setCallback(callback, that);

                return this;
            },
            setCallback: function (callback, self) {
                currentSound.callback = self ? callback.bind(self) : callback;
                return this;
            },
            setLoop: function (loop) {
                currentSound.loop = loop;
                return this;
            },
            setVolume: function (value) {
                if (currentSound.ended || !currentSound.started)
                    return this;
                currentTrack.element.volume = currentSound.volume = value;
                return this;
            },
            hasEnded: function () {
                return currentSound.ended;
            }
        }
    };

    return HtmlAudioSprite;
})(Array, H5.Transition);