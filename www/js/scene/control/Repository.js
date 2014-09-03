var Repository = (function () {
    "use strict";

    function Repository() {
        this.dict = {};
    }

    Repository.prototype.add = function (item, fn, resizeIsDependentOnThisDrawable) {
        this.dict[item.id] = {
            fn: fn,
            dependency: resizeIsDependentOnThisDrawable
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
            resizeItem(key, wrapper.fn, wrapper.dependency);
        }

        function resizeItem(id, fn, dependency) {
            alreadyCalledMap[id] = true;
            var dependencyNotAlreadyCalled = dependency && !alreadyCalledMap[dependency.id];
            if (dependencyNotAlreadyCalled) {
                var wrapper = self.dict[dependency.id];
                resizeItem(dependency.id, wrapper.fn, wrapper.dependency);
            }
            fn(width, height);
        }
    };

    return Repository;
})();