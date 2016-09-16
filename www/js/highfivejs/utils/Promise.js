H5.Promise = (function () {
    "use strict";

    function Promise() {
        this.isFulfilled = false;
    }

    Promise.prototype.then = function (callback, self) {
        this.__callback = self ? callback.bind(self) : callback;

        if (this.isFulfilled)
            this.__callback(this.__arg);
    };

    Promise.prototype.resolve = function (arg) {
        if (this.isFulfilled)
            return;

        this.isFulfilled = true;

        if (this.__callback) {
            this.__callback(arg);
        } else {
            this.__arg = arg;
        }
    };

    return Promise;
})();