H5.CallbackCounter = (function () {
    'use strict';

    function CallbackCounter(callback, forcedCount) {
        this.__countForced = forcedCount !== undefined;
        this.counter = forcedCount === undefined ? 0 : forcedCount;
        this.callback = callback;
    }

    CallbackCounter.prototype.register = function () {
        if (!this.__countForced) {
            this.counter++;
        }
        return this.__onProgress.bind(this);
    };

    CallbackCounter.prototype.__onProgress = function () {
        if (--this.counter < 1) {
            this.__onComplete();
        }
    };

    CallbackCounter.prototype.__onComplete = function () {
        this.counter = 0;
        if (this.callback) {
            this.callback();
        }
    };

    return CallbackCounter;
})();
