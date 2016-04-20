H5.SceneManager = (function () {
    "use strict";

    function SceneManager() {
        this.scenes = [];
        this.temp = [];
    }

    SceneManager.prototype.add = function (sceneFn, oneTime) {
        this.scenes.push({
            sceneFn: sceneFn,
            oneTime: oneTime == null ? false : oneTime
        });
    };

    SceneManager.prototype.next = function () {
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

        scene.sceneFn(this.next.bind(this));
    };

    SceneManager.prototype.rewind = function () {
        this.scenes = this.temp;
        this.temp = [];
    };

    return SceneManager;
})();