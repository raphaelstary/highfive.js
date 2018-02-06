H5.iterateEntries = (function (Object) {
    'use strict';

    function iterateEntries(dictionary, callback, thisArg) {
        Object.keys(dictionary)
            .forEach(function (key) {
                callback.call(thisArg, dictionary[key], key);
            });
    }

    return iterateEntries;
})(Object);
