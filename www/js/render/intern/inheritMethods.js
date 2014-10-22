var inheritMethods = (function (getOwnPropertyNames) {
    "use strict";

    function inheritMethods(source, target, targetPrototype) {
        for (var key in source) {
            if (source.hasOwnProperty(key))
                continue;

            (function (key) {
                var hasSameMethod = getOwnPropertyNames(targetPrototype).some(function (elem) {
                    return elem == key;
                });

                if (!hasSameMethod)
                    target[key] = source[key].bind(source);
            })(key);
        }
    }

    return inheritMethods;
})(Object.getOwnPropertyNames);