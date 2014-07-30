var Repository = (function () {
    "use strict";

    function Repository() {
        this.dict = {};
    }

    Repository.prototype.add = function (item, fn) {
        this.dict[item.id] = fn;
    };

    Repository.prototype.remove = function (item) {
        delete this.dict[item.id];
    };

    Repository.prototype.call = function () {
        for (var key in this.dict)
            this.dict[key]();
    };

    return Repository;
})();