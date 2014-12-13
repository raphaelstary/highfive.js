var FullScreenController = (function (document) {
    "use strict";

    function FullScreenController(screen, bus) {
        this.screen = screen;
        this.bus = bus;

        this.isSupported = document.fullscreenEnabled || document.webkitFullscreenEnabled ||
        document.mozFullScreenEnabled || document.msFullscreenEnabled;
    }

    FullScreenController.prototype.request = function () {
        if (this.screen.requestFullscreen) {
            this.screen.requestFullscreen();
        } else if (this.screen.webkitRequestFullscreen) {
            this.screen.webkitRequestFullscreen();
        } else if (this.screen.mozRequestFullScreen) {
            this.screen.mozRequestFullScreen();
        } else if (this.screen.msRequestFullscreen) {
            this.screen.msRequestFullscreen();
        }
        return this.isFullScreen();
    };

    FullScreenController.prototype.isFullScreen = function () {
        return (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement ||
            document.msFullscreenElement) != null;
    };

    FullScreenController.prototype.isSupported = function () {
        return this.isSupported;
    };

    FullScreenController.prototype.exit = function () {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }

        return !this.isFullScreen();
    };

    FullScreenController.prototype.add = function (callback) {
        this.bus.add(callback);
    };

    return FullScreenController;
})(window.document);