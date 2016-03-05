H5.inheritMethods = (function (Object) {
    "use strict";

    function inheritMethods(source, target, targetPrototype) {
        for (var key in source) {
            if (source.hasOwnProperty(key))
                continue;

            (function (propertyKey) {
                var hasSameMethod = Object.getOwnPropertyNames(targetPrototype).some(function (elem) {
                    return elem == propertyKey;
                });

                if (!hasSameMethod)
                    target[propertyKey] = source[propertyKey].bind(source);
            })(key);
        }
    }

    return inheritMethods;
})(Object);