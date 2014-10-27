var Repository = (function (Object) {
    "use strict";

    function Repository() {
        this.dict = {};
    }

    Repository.prototype.add = function (item, fn, resizeIsDependentOnThisDrawables) {
        this.dict[item.id] = {
            fn: fn,
            dependencies: resizeIsDependentOnThisDrawables
        };
    };

    Repository.prototype.has = function (item) {
        return this.dict[item.id] !== undefined;
    };

    Repository.prototype.remove = function (item) {
        delete this.dict[item.id];
    };

    Repository.prototype.call = function (width, height) {
        var self = this;
        var alreadyCalledMap = {};

        Object.keys(this.dict).forEach(function (key) {
            var wrapper = this.dict[key];
            resizeItem(key, wrapper.fn, wrapper.dependencies);
        }, this);

        function resizeItem(id, fn, dependencies) {
            alreadyCalledMap[id] = true;
            if (dependencies) {
                dependencies.forEach(function (dependency) {
                    var dependencyNotAlreadyCalled = dependency && !alreadyCalledMap[dependency.id];
                    if (dependencyNotAlreadyCalled) {
                        var wrapper = self.dict[dependency.id];
                        resizeItem(dependency.id, wrapper.fn, wrapper.dependencies);
                    }
                });
            }

            fn(width, height);
        }
    };

    return Repository;
})(Object);