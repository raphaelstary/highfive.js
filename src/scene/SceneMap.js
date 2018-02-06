H5.SceneMap = (function (Object, Error) {
    'use strict';

    function SceneMap() {
        this.scenes = {};
    }

    SceneMap.prototype.put = function (name, callback, thisArg) {
        this.scenes[name] = thisArg ? callback.bind(thisArg) : callback;
    };

    SceneMap.prototype.next = function (name, customParam) {

        var sceneFn = this.scenes[name];

        if (!sceneFn) {
            if (Object.keys(this.scenes).length < 1) {
                throw new Error('No scenes configured');
            }
            throw new Error('scene "' + name + '" not configured');
        }

        sceneFn(this.next.bind(this), customParam);
    };

    return SceneMap;
})(Object, Error);
