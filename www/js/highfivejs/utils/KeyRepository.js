H5.KeyRepository = (function (Object) {
    "use strict";

    function KeyRepository(keysInOrderToCall) {
        this.keys = keysInOrderToCall;
        this.dict = {};
    }

    KeyRepository.prototype.add = function (key, item, fn, dependencies) {
        var wrapper = {
            fn: fn,
            dependencies: dependencies
        };
        var ref = this.dict[item.id];
        if (ref) {
            ref[key] = wrapper;
        } else {
            this.dict[item.id] = {};
            this.dict[item.id][key] = wrapper;
        }
    };

    KeyRepository.prototype.has = function (item) {
        return this.dict[item.id] !== undefined;
    };

    KeyRepository.prototype.remove = function (item) {
        delete this.dict[item.id];
    };

    KeyRepository.prototype.removeKey = function (key, item) {
        delete this.dict[item.id][key];
    };

    KeyRepository.prototype.call = function (arg1, arg2) {
        var self = this;
        var alreadyCalledMap = {};

        Object.keys(this.dict).forEach(function (idKey) {
            var wrapper = this.dict[idKey];
            callWrapper(idKey, wrapper);
        }, this);

        function callWrapper(id, keyWrapper) {
            alreadyCalledMap[id] = true;

            var dependencies = [];
            self.keys.forEach(function (key) {
                if (keyWrapper[key] && keyWrapper[key].dependencies) {
                    dependencies.push.apply(dependencies, keyWrapper[key].dependencies);
                }
            });

            dependencies.forEach(function (dependency) {
                var dependencyNotAlreadyCalled = dependency && !alreadyCalledMap[dependency.id];
                if (dependencyNotAlreadyCalled) {
                    var wrapper = self.dict[dependency.id];
                    if (wrapper)
                        callWrapper(dependency.id, wrapper);
                }
            });

            self.keys.forEach(function (key) {
                if (keyWrapper[key]) {
                    keyWrapper[key].fn(arg1, arg2);
                }
            });

        }
    };

    return KeyRepository;
})(Object);