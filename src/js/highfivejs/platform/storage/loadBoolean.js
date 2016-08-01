H5.loadBoolean = (function (localStorage) {
    "use strict";

    function loadBoolean(key) {
        return localStorage.getItem(key) == 'true';
    }

    return loadBoolean;
})(H5.lclStorage);