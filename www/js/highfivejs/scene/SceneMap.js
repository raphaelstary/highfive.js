H5.SceneMap = (function (Object) {
    "use strict";

    function SceneMap() {
        this.scenes = {};
    }

    SceneMap.prototype.put = function (name, callback, self) {
        this.scenes[name] = self ? callback.bind(self) : callback;
    };

    SceneMap.prototype.next = function (name, customParam) {

        var sceneFn = this.scenes[name];

        if (!sceneFn) {
            if (Object.keys(this.scenes).length < 1)
                throw 'No scenes configured';
            throw 'scene "' + name + '" not configured';
        }

        sceneFn(this.next.bind(this), customParam);
    };

    return SceneMap;
})(Object);