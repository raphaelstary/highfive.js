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
            track.currentSound.volume = track.element.volume;
            track.element.volume = 0;
        });
    };

    HtmlAudioSprite.prototype.unmuteAll = function () {
        this.tracks.forEach(function (track) {
            track.element.volume = track.currentSound.volume;
        });
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

    HtmlAudioSprite.prototype.setMasterVolume = function (value) {
        this.tracks.forEach(function (track) {
            track.element.volume = value;
        });
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

                return self.stage.audioVolumeTo(currentTrack.element, value);
            },
            setCallback: callback.bind(undefined, currentSound),
            setLoop: loop.bind(undefined, currentSound)
        }
    };

    function loop(soundNode, loop) {
        soundNode.loop = loop;
        return soundNode;
    }

    function callback(soundNode, callback, self) {
        soundNode.__callback = self ? callback.bind(self) : callback;
        return soundNode;
    }

    return HtmlAudioSprite;
})(Array);