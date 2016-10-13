H5.Promise = (function () {
    "use strict";

    function Promise() {
        this.isFulfilled = false;
    }

    Promise.prototype.then = function (callback, self) {
        this.__callback = self ? callback.bind(self) : callback;

        var next = this.__next = new Promise();

        if (this.isFulfilled) {
            var promise = this.__callback(this.__arg);
            if (promise instanceof Promise) {
                promise.then(next.resolve.bind(next));
            } else {
                next.resolve();
            }
        }

        return next;
    };

    Promise.prototype.resolve = function (arg) {
        if (this.isFulfilled)
            return;

        this.isFulfilled = true;

        if (this.__callback) {
            var promise = this.__callback(arg);
            if (promise instanceof Promise) {
                promise.then(this.__next.resolve.bind(this.__next));
            } else {
                this.__next.resolve();
            }
        } else {
            this.__arg = arg;
        }
    };

    return Promise;
})();