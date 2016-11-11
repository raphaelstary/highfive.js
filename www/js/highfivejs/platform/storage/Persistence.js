H5.Persistence = (function (localStorage, parseInt, JSON) {
    "use strict";

    function loadBoolean(key) {
        return localStorage.getItem(key) == 'true';
    }

    function loadInteger(key) {
        var value = localStorage.getItem(key);
        if (value == null)
            return 0;
        return parseInt(value);
    }

    function loadObject(key) {
        var data = localStorage.getItem(key);
        if (data == null) {
            return undefined;
        }
        return JSON.parse(data);
    }

    function loadString(key) {
        var value = localStorage.getItem(key);
        if (value == null)
            return '';
        return value;
    }

    function saveObject(key, object) {
        localStorage.setItem(key, JSON.stringify(object));
    }

    return {
        loadBoolean: loadBoolean,
        loadInteger: loadInteger,
        loadObject: loadObject,
        loadString: loadString,
        saveObject: saveObject
    }

})(H5.lclStorage, parseInt, JSON);