H5.loadString = (function (localStorage) {
    "use strict";

    function loadString(key) {
        var value = localStorage.getItem(key);
        if (value == null)
            return '';
        return value;
    }

    return loadString;
})(H5.lclStorage);