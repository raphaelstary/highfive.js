H5.getGamepads = (function (navigator) {
    'use strict';

    function getGamepads() {
        return [];
    }

    return navigator.getGamepads ? navigator.getGamepads.bind(navigator) : getGamepads;
})(window.navigator);