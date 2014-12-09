var installResize = (function (window, ResizeBus, ResizeHandler, width, height, getDevicePixelRatio) {
    "use strict";

    function installResize() {
        var pixelRatio = getDevicePixelRatio();
        var resizeBus = new ResizeBus(width * pixelRatio, height * pixelRatio, width, height, pixelRatio);
        var resizeHandler = new ResizeHandler(resizeBus);
        window.addEventListener('resize', resizeHandler.handleResize.bind(resizeHandler));

        return resizeBus;
    }

    return installResize;
})(window, ResizeBus, ResizeHandler, window.innerWidth, window.innerHeight, getDevicePixelRatio);