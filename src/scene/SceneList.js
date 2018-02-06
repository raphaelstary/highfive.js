H5.SceneList = (function (Error) {
    'use strict';

    function SceneList() {
        this.scenes = [];
        this.temp = [];
    }

    SceneList.prototype.add = function (sceneFn, oneTime) {
        this.scenes.push({
            sceneFn: sceneFn,
            oneTime: oneTime == undefined ? false : oneTime
        });
    };

    SceneList.prototype.next = function (customParam) {
        if (this.scenes.length === 0 && this.temp.length > 0) {
            this.rewind();
        }

        var scene = this.scenes.shift();

        if (!scene) {
            throw new Error('No scenes configured');
        }

        if (!scene.oneTime) {
            this.temp.push(scene);
        }

        scene.sceneFn(this.next.bind(this), customParam);
    };

    SceneList.prototype.rewind = function () {
        this.scenes = this.temp;
        this.temp = [];
    };

    return SceneList;
})(Error);
