H5.ResizeHandler = (function (getDevicePixelRatio, Event, Math) {
    "use strict";

    function ResizeHandler(events) {
        this.events = events;
    }

    ResizeHandler.prototype.handleResize = function (event) {
        var width = event.target.innerWidth;
        var height = event.target.innerHeight;

        var pixelRatio = getDevicePixelRatio();

        this.events.fire(Event.RESIZE, {
            width: Math.floor(width * pixelRatio),
            height: Math.floor(height * pixelRatio),
            cssWidth: width,
            cssHeight: height,
            devicePixelRatio: pixelRatio
        });
    };

    return ResizeHandler;
})(H5.getDevicePixelRatio, H5.Event, Math);