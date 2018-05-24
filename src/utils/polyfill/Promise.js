H5.Promise = (function (CallbackCounter) {
    'use strict';

    function Promise(executor) {
        this.__isFulfilled = false;

        if (executor) {
            executor(this.__resolve.bind(this));
        }
    }

    Promise.resolve = function (value) {
        return new Promise(function (resolve) {
            resolve(value);
        });
    };

    Promise.all = function (promises) {
        if (promises.length == 0) {
            return Promise.resolve();
        }

        var promise = new Promise();
        var counter = new CallbackCounter(promise.__resolve.bind(promise), promises.length);
        promises.forEach(function (promise) {
            promise.then(counter.register());
        });
        return promise;
    };

    // Promise.race = function (iterable) {
    Promise.race = function () {
        // todo implement
    };

    Promise.prototype.then = function (callback) {
        this.__callback = callback;

        this.__next = new Promise();

        if (this.__isFulfilled) {
            var promise = this.__callback(this.__argument);
            if (promise instanceof Promise) {
                promise.then(this.__next.__resolve.bind(this.__next));
            } else {
                this.__next.__resolve();
            }
        }

        return this.__next;
    };

    Promise.prototype.__resolve = function (argument) {
        if (this.__isFulfilled) {
            return;
        }

        this.__isFulfilled = true;

        if (this.__callback) {
            var promise = this.__callback(argument);
            if (promise instanceof Promise) {
                promise.then(this.__next.__resolve.bind(this.__next));
            } else {
                this.__next.__resolve();
            }
        } else {
            this.__argument = argument;
        }
    };

    return Promise;
})(H5.CallbackCounter);
