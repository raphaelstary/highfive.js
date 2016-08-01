H5.Repository = (function (Object) {
    "use strict";

    function Repository() {
        this.dict = {};
    }

    Repository.prototype.add = function (item, fn, dependencies) {
        this.dict[item.id] = {
            fn: fn,
            dependencies: dependencies
        };
    };

    Repository.prototype.has = function (item) {
        return this.dict[item.id] !== undefined;
    };

    Repository.prototype.remove = function (item) {
        delete this.dict[item.id];
    };

    Repository.prototype.call = function (arg1, arg2) {
        var self = this;
        var alreadyCalledMap = {};

        Object.keys(this.dict).forEach(function (key) {
            var wrapper = this.dict[key];
            callItem(key, wrapper.fn, wrapper.dependencies);
        }, this);

        function callItem(id, fn, dependencies) {
            alreadyCalledMap[id] = true;
            if (dependencies) {
                dependencies.forEach(function (dependency) {
                    var dependencyNotAlreadyCalled = dependency && !alreadyCalledMap[dependency.id];
                    if (dependencyNotAlreadyCalled) {
                        var wrapper = self.dict[dependency.id];
                        if (wrapper)
                            callItem(dependency.id, wrapper.fn, wrapper.dependencies);
                    }
                });
            }

            fn(arg1, arg2);
        }
    };

    return Repository;
})(Object);