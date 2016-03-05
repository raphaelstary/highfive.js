H5.saveObject = (function (localStorage, JSON) {
    "use strict";

    function saveObject(key, object) {
        localStorage.setItem(key, JSON.stringify(object));
    }

    return saveObject;
})(H5.lclStorage, JSON);