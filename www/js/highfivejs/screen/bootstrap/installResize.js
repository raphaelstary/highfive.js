H5.installResize = (function (window, ResizeHandler, Event) {
    "use strict";

    function installResize(events, device) {
        var resizeHandler = new ResizeHandler(events, device);
        window.addEventListener('resize', resizeHandler.handleResize.bind(resizeHandler));
        events.subscribe(Event.RESIZE, function (event) {
            if (!device.isLowRez) {
                device.width = event.width;
                device.height = event.height;
            }
            device.cssWidth = event.cssWidth;
            device.cssHeight = event.cssHeight;
            device.devicePixelRatio = event.devicePixelRatio;
        });
        device.forceResize = function () {
            events.fire(Event.RESIZE, {
                width: this.width,
                height: this.height,
                cssWidth: this.cssWidth,
                cssHeight: this.cssHeight,
                devicePixelRatio: this.devicePixelRatio
            });
        };
    }

    return installResize;
})(window, H5.ResizeHandler, H5.Event);