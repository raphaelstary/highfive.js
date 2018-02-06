H5.iterateSomeEntries = (function () {
    'use strict';

    function iterateSomeEntries(dictionary, callback, thisArg) {
        return Object.keys(dictionary)
            .some(function (key) {
                return callback.call(thisArg, dictionary[key]);
            });
    }

    return iterateSomeEntries;
})();
