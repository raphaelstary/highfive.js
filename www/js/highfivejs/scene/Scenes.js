H5.Scenes = (function () {
    "use strict";

    function Scenes() {
        this.scenes = [];
        this.temp = [];
    }

    Scenes.prototype.add = function (sceneFn, oneTime) {
        this.scenes.push({
            sceneFn: sceneFn,
            oneTime: oneTime == null ? false : oneTime
        });
    };

    Scenes.prototype.next = function (customParam) {
        if (this.scenes.length === 0 && this.temp.length > 0) {
            this.rewind();
        }

        var scene = this.scenes.shift();

        if (!scene) {
            throw 'No scenes configured';
        }

        if (!scene.oneTime) {
            this.temp.push(scene);
        }

        scene.sceneFn(this.next.bind(this), customParam);
    };

    Scenes.prototype.rewind = function () {
        this.scenes = this.temp;
        this.temp = [];
    };

    return Scenes;
})();