var installResize = (function (window, ResizeBus, ResizeHandler, width, height) {
    "use strict";

    function installResize() {
        var resizeBus = new ResizeBus(width, height);
        var resizeHandler = new ResizeHandler(resizeBus);
        window.addEventListener('resize', resizeHandler.handleResize.bind(resizeHandler));

        return resizeBus;
    }

    return installResize;
})(window, ResizeBus, ResizeHandler, window.innerWidth, window.innerHeight);