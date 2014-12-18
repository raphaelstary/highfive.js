var ResizeHandler = (function (requestAnimationFrame, getDevicePixelRatio, Event) {
    "use strict";

    function ResizeHandler(events) {
        this.events = events;

        this.resizeFired = false;
        this.drawing = false;
    }

    ResizeHandler.prototype.handleResize = function (event) {
        if (this.drawing === false && event !== undefined && event.target !== undefined) {
            this.resizeFired = true;

            this._initiateResize(event.target.innerWidth, event.target.innerHeight);
        }
    };

    ResizeHandler.prototype._initiateResize = function (width, height) {
        // render friendly resize loop
        if (this.resizeFired === true) {
            this.resizeFired = false;
            this.drawing = true;

            // actually do the resize
            var pixelRatio = getDevicePixelRatio();
            this.events.fire(Event.RESIZE, {
                width: width * pixelRatio,
                height: height * pixelRatio,
                cssWidth: width,
                cssHeight: height,
                devicePixelRatio: pixelRatio
            });

            requestAnimationFrame(this._initiateResize.bind(this, width, height));
        } else {
            this.drawing = false;
        }
    };

    return ResizeHandler;
})(requestAnimFrame, getDevicePixelRatio, Event);