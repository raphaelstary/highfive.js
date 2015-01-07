var ResizeHandler = (function (getDevicePixelRatio, Event) {
    "use strict";

    function ResizeHandler(events) {
        this.events = events;
    }

    ResizeHandler.prototype.handleResize = function (event) {
        var width = event.target.innerWidth;
        var height = event.target.innerHeight;

        var pixelRatio = getDevicePixelRatio();

        this.events.fire(Event.RESIZE, {
            width: width * pixelRatio,
            height: height * pixelRatio,
            cssWidth: width,
            cssHeight: height,
            devicePixelRatio: pixelRatio
        });
    };

    return ResizeHandler;
})(getDevicePixelRatio, Event);