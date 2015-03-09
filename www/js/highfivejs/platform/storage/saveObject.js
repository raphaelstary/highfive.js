var saveObject = (function (localStorage, JSON) {
    "use strict";

    function saveObject(key, object) {
        localStorage.setItem(key, JSON.stringify(object));
    }

    return saveObject;
})(lclStorage, JSON);