var iterateSomeEntries = (function () {
    "use strict";

    function iterateSomeEntries(dictionary, callback, self) {
        Object.keys(dictionary).some(function (key) {
            return callback.call(self, dictionary[key]);
        });
    }

    return iterateSomeEntries;
})();
