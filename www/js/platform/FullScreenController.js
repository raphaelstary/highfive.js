var FullScreenController = (function () {
    "use strict";

    function FullScreenController(screen) {
        this.requestFullscreen = (function (element) {
            if (element.requestFullscreen) {
                return element.requestFullscreen.bind(element);
            } else if (element.webkitRequestFullscreen) {
                return element.webkitRequestFullscreen.bind(element);
            } else if (element.mozRequestFullScreen) {
                return element.mozRequestFullScreen.bind(element);
            } else if (element.msRequestFullscreen) {
                return element.msRequestFullscreen.bind(element);
            }
            return null;
        })(screen);

        this.isSupported = this.requestFullscreen != null;
    }

    FullScreenController.prototype.request = function () {
        if (this.isSupported)
            this.requestFullscreen();
    };

    return FullScreenController;
})();