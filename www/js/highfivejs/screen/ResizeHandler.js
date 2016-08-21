H5.ResizeHandler = (function (getDevicePixelRatio, Event, Math) {
    "use strict";

    function ResizeHandler(events, device) {
        this.events = events;
        this.device = device;
    }

    ResizeHandler.prototype.handleResize = function (event) {
        var width = event.target.innerWidth;
        var height = event.target.innerHeight;

        var pixelRatio = getDevicePixelRatio();

        if (!this.device.isLowRez) {
            this.events.fire(Event.RESIZE, {
                width: Math.floor(width * pixelRatio),
                height: Math.floor(height * pixelRatio),
                cssWidth: width,
                cssHeight: height,
                devicePixelRatio: pixelRatio
            });
        } else {
            this.events.fire(Event.RESIZE, {
                width: this.device.width,
                height: this.device.height,
                cssWidth: width,
                cssHeight: height,
                devicePixelRatio: pixelRatio
            });
        }
    };

    return ResizeHandler;
})(H5.getDevicePixelRatio, H5.Event, Math);