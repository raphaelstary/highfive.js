H5.loadObject = (function (localStorage, JSON) {
    "use strict";

    function loadObject(key) {
        var data = localStorage.getItem(key);
        if (data == null) {
            return undefined;
        }
        return JSON.parse(data);
    }

    return loadObject;
})(H5.lclStorage, JSON);