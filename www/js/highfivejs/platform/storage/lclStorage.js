H5.lclStorage = (function (window) {
    "use strict";

    var lclStorage;
    try {
        lclStorage = window.localStorage;
    } catch (e) {
        lclStorage = {
            dict: {},
            getItem: function (id) {
                return this.dict[id];
            },
            setItem: function (id, value) {
                this.dict[id] = value;
            },
            clear: function () {
                this.dict = {};
            },
            removeItem: function (id) {
                delete this.dict[id];
            }
        }
    }

    return lclStorage;
})(window);