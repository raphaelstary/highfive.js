H5.concatenateProperties = (function (Object) {
    "use strict";

    function concatenateProperties(source, target) {
        Object.keys(source).forEach(function (property) {
            target[property] = source[property];
        });
    }

    return concatenateProperties;
})(Object);
