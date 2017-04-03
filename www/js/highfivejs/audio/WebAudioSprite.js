H5.WebAudioSprite = (function (iterateEntries) {
    'use strict';

    function WebAudioSprite(info, buffer, audioContext, timer) {
        this.info = info;
        this.buffer = buffer;
        this.ctx = audioContext;
        this.timer = timer;

        this.masterVolume = 1;
        this.tracks = {};

        this.frameRate = 60;
    }

    WebAudioSprite.prototype.muteAll = function () {
        iterateEntries(this.tracks, this.__mute, this);
    };

    WebAudioSprite.prototype.unmuteAll = function () {
        iterateEntries(this.tracks, this.__unmute, this);
    };

    WebAudioSprite.prototype.pauseAll = function () {
        if (this.ctx.state === 'running') {
            this.ctx.suspend();
        }
    };

    WebAudioSprite.prototype.resumeAll = function () {
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    };

    WebAudioSprite.prototype.stopAll = function () {
        iterateEntries(this.tracks, this.__stop, this);
    };

    WebAudioSprite.prototype.setMasterVolume = function (value) {
        this.masterVolume = value;
        iterateEntries(this.tracks, this.__setVolume.bind(this, value));
    };

    WebAudioSprite.prototype.masterVolumeTo = function (value, duration, callback, self) {
        this.masterVolume = value;
        iterateEntries(this.tracks, this.__volumeTo.bind(this, value, duration, null, null));
        this.timer.doLater(callback, duration, self);
    };

    WebAudioSprite.prototype.play = function (name) {

        var spriteInfo = this.info[name];
        var currentAudio = new AudioNode();
        var source = this.ctx.createBufferSource();
        var gainNode = this.ctx.createGain();
        var track = new WebAudioTrack(source, gainNode, currentAudio);

        this.tracks[track.id] = track;

        source.onended = this.__ended.bind(this, track);
        source.buffer = this.buffer;
        source.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        function startTrack() {

            if (currentAudio.loop) {
                source.loop = true;
                source.loopStart = spriteInfo.start;
                source.loopEnd = spriteInfo.end;
            }

            if (currentAudio.mute) {
                gainNode.gain.value = 0;
            } else if (currentAudio.volume !== 1) {
                gainNode.gain.value = currentAudio.volume;
            } else if (self.masterVolume !== 1) {
                gainNode.gain.value = self.masterVolume;
            }

            if (currentAudio.loop) {
                source.start(0, spriteInfo.start);
            } else {
                source.start(0, spriteInfo.start, spriteInfo.end - spriteInfo.start);
            }

            currentAudio.started = true;
        }

        var self = this;
        return {
            trackAvailable: true,
            start: function () {
                if (currentAudio.started) {
                    return this;
                }
                startTrack();
                return this;
            },
            stop: function () {
                if (currentAudio.ended || !currentAudio.started) {
                    return this;
                }

                self.__stop(track);
                return this;
            },
            mute: function () {
                self.__mute(track);
                return this;
            },
            unmute: function () {
                self.__unmute(track);
                return this;
            },
            volumeTo: function (value, duration, callback, that) {
                self.__volumeTo(value, duration, callback, that, track);
                return this;
            },
            setCallback: function (callback, self) {
                currentAudio.callback = self ? callback.bind(self) : callback;
                return this;
            },
            setLoop: function (loop) {
                currentAudio.loop = loop;
                return this;
            },
            setVolume: function (value) {
                self.__setVolume(value, track);
                return this;
            },
            hasEnded: function () {
                return currentAudio.ended;
            }
        };
    };

    WebAudioSprite.prototype.__ended = function (track) {
        track.node.ended = true;
        if (track.node.callback) {
            track.node.callback();
        }
        delete this.tracks[track.id];
    };

    WebAudioSprite.prototype.__stop = function (track) {
        track.source.stop();
    };

    WebAudioSprite.prototype.__setVolume = function (value, track) {
        track.node.volume = value;
        if (track.node.started) {
            track.gain.gain.value = value;
        }
    };

    WebAudioSprite.prototype.__mute = function (track) {
        track.node.mute = true;
        if (track.node.started) {
            track.gain.gain.value = 0;
        }
    };

    WebAudioSprite.prototype.__unmute = function (track) {
        track.node.mute = false;
        if (track.node.started) {
            track.gain.gain.value = track.node.volume;
        }
    };

    WebAudioSprite.prototype.__volumeTo = function (value, duration, callback, self, track) {
        track.node.volume = value;
        track.gain.gain.exponentialRampToValueAtTime(value, this.ctx.currentTime + duration / this.frameRate);
        if (callback) {
            this.timer.doLater(callback, duration, self);
        }
    };

    function AudioNode() {
        this.started = false;
        this.ended = false;
        this.volume = 1;
        this.mute = false;
        this.loop = false;
        this.callback = undefined;
    }

    var idGenerator = 0;

    function WebAudioTrack(source, gain, node) {
        this.id = idGenerator++;
        this.source = source;
        this.gain = gain;
        this.node = node;
    }

    return WebAudioSprite;
})(H5.iterateEntries);