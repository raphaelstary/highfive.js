H5.ResourceLoader = (function (Blob, Image, Object, JSON, Audio) {
    'use strict';

    var ResourceType = {
        IMAGE: 0,
        SOUND: 1,
        JSON: 2,
        FONT: 3,
        AUDIO: 4,
        WEB_AUDIO: 5
    };

    function ResourceLoader() {
        this.resources = [];
        this.resourcesLoaded = 0;
        this.__counter = 0;
    }

    ResourceLoader.prototype.getCount = function () {
        return this.__counter;
    };

    ResourceLoader.prototype.addImage = function (imgSrc) {
        this.__counter++;
        var img = new Image();
        this.resources.push({
            type: ResourceType.IMAGE,
            file: img,
            src: imgSrc
        });

        return img;
    };

    ResourceLoader.prototype.addAudio = function (audioSrc) {
        this.__counter++;
        var audio = new Audio();
        this.resources.push({
            type: ResourceType.AUDIO,
            file: audio,
            src: audioSrc
        });

        return audio;
    };

    ResourceLoader.prototype.addWebAudio = function (audioSrc, audioCtx) {
        this.__counter++;
        var bufferWrapper = {};
        this.resources.push({
            type: ResourceType.WEB_AUDIO,
            file: bufferWrapper,
            src: audioSrc,
            ctx: audioCtx
        });

        return bufferWrapper;
    };

    ResourceLoader.prototype.addJSON = function (jsonSrc, payload) {
        this.__counter++;
        var jsonObject = {};
        this.resources.push({
            type: ResourceType.JSON,
            file: jsonObject,
            src: jsonSrc,
            payload: payload
        });

        return jsonObject;
    };

    ResourceLoader.prototype.addFont = function (fontSrc) {
        this.__counter++;
        var font = {};
        this.resources.push({
            type: ResourceType.FONT,
            file: font,
            src: fontSrc
        });

        return font;
    };

    ResourceLoader.prototype.load = function () {
        if (this.resources.length == this.resourcesLoaded && this.onComplete) {
            this.onComplete();
            return;
        }

        var self = this;
        self.resources.forEach(function (elem) {

            if (elem.type === ResourceType.IMAGE) {
                elem.file.onload = function () {
                    self.onResourceLoad();
                };
                elem.file.src = elem.src;

            } else if (elem.type === ResourceType.AUDIO) {
                elem.file.addEventListener('canplaythrough', function () {
                    self.onResourceLoad();
                });
                elem.file.src = elem.src;
                elem.file.load();

            } else if (elem.type === ResourceType.JSON) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', elem.src, true);

                xhr.onload = function () {
                    var json = JSON.parse(this.responseText);
                    Object.keys(json).forEach(function (key) {
                        elem.file[key] = json[key];
                    });

                    self.onResourceLoad();
                };
                xhr.send();

            } else if (elem.type === ResourceType.FONT) {
                var xhrFont = new XMLHttpRequest();
                xhrFont.open('GET', elem.src, true);
                xhrFont.responseType = 'arraybuffer';

                xhrFont.onload = function () {

                    if (Blob) {
                        elem.file.blob = new Blob([xhrFont.response], {type: 'application/font-woff'});
                    } else {
                        console.log('error: Blob constructing not supported');
                    }

                    self.onResourceLoad();
                };

                xhrFont.send();

            } else if (elem.type === ResourceType.WEB_AUDIO) {

                var xhrAudio = new XMLHttpRequest();
                xhrAudio.open('GET', elem.src, true);
                xhrAudio.responseType = 'arraybuffer';

                xhrAudio.onload = function () {
                    var audioData = xhrAudio.response;
                    elem.ctx.decodeAudioData(audioData, function (buffer) {
                        elem.file.buffer = buffer;
                        self.onResourceLoad();
                    }, function (exception) {
                        console.log('error with decoding audio data: ' + exception.err);
                    });
                };
                xhrAudio.send();
            }
        });
    };

    ResourceLoader.prototype.onResourceLoad = function () {
        this.resourcesLoaded++;
        var onProgress = this.onProgress;
        if (onProgress !== undefined && typeof onProgress === 'function') {
            onProgress();
        }

        if (this.resourcesLoaded === this.resources.length) {
            var onComplete = this.onComplete;
            if (onComplete !== undefined && typeof onComplete === 'function') {
                onComplete();
            }
        }
    };

    return ResourceLoader;
})(Blob, Image, Object, JSON, Audio);
