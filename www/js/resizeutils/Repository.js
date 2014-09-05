var Repository = (function () {
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

    Repository.prototype.remove = function (item) {
        delete this.dict[item.id];
    };

    Repository.prototype.call = function (width, height) {
        var self = this;
        var alreadyCalledMap = {};

        for (var key in this.dict) {
            var wrapper = this.dict[key];
            resizeItem(key, wrapper.fn, wrapper.dependencies);
        }

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
})();