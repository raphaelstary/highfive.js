var iterateSomeEntries = (function () {
    "use strict";

    function iterateSomeEntries(dictionary, callback, self) {
        return Object.keys(dictionary).some(function (key) {
            return callback.call(self, dictionary[key]);
        });
    }

    return iterateSomeEntries;
})();
