H5.iterateEntries = (function (Object) {
    "use strict";

    function iterateEntries(dictionary, callback, self) {
        Object.keys(dictionary).forEach(function (key) {
            callback.call(self, dictionary[key], key);
        });
    }

    return iterateEntries;
})(Object);
