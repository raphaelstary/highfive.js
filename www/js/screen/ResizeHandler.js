var ResizeHandler = (function (requestAnimationFrame) {
    "use strict";

    function ResizeHandler(resizeBus) {
        this.resizeBus = resizeBus;

        this.resizeFired = false;
        this.drawing = false;
    }

    ResizeHandler.prototype.handleResize = function (event) {
        if (this.drawing === false && event !== undefined && event.target !== undefined) {
            this.resizeFired = true;

            this._initiateResize(event.target.innerWidth , event.target.innerHeight);
        }
    };

    ResizeHandler.prototype._initiateResize = function (width, height) {
        // render friendly resize loop
        if (this.resizeFired === true) {
            this.resizeFired = false;
            this.drawing = true;

            // actually do the resize
            this.resizeBus.resize(width, height);

            requestAnimationFrame(this._initiateResize.bind(this, width, height));
        } else {
            this.drawing = false;
        }
    };

    return ResizeHandler;
})(requestAnimFrame);