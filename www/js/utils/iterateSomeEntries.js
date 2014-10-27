var iterateSomeEntries = (function () {
    "use strict";

    function iterateSomeEntries(dictionary, callback, self) {
        callback.bind(self);
        Object.keys(dictionary).some(function (key) {
            return callback(dictionary[key]);
        });
    }

    return iterateSomeEntries;
})();
