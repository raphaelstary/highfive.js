H5.CallbackCounter = (function () {
    "use strict";

    function CallbackCounter(callback) {
        this.counter = 0;
        this.callback = callback;
    }

    CallbackCounter.prototype.register = function () {
        this.counter++;
        return this.__onProgress.bind(this);
    };

    CallbackCounter.prototype.__onProgress = function () {
        if (--this.counter === 0)
            this.__onComplete();
    };

    CallbackCounter.prototype.__onComplete = function () {
        this.counter = 0;
        if (this.callback)
            this.callback();
    };

    return CallbackCounter;
})();