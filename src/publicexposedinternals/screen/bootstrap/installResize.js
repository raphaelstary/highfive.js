H5.installResize = (function (window, ResizeHandler, Event) {
    'use strict';

    /**
     *
     * @param {EventBus} events
     * @param {Device} device
     * @param {mapResize} [mapDimensions]
     */
    function installResize(events, device, mapDimensions) {
        var resizeHandler = new ResizeHandler(events, device);

        if (mapDimensions) {
            window.addEventListener('resize', function (event) {
                mapDimensions(event).then(resizeHandler.handleResize.bind(resizeHandler));
            });
        } else {
            window.addEventListener('resize', resizeHandler.handleResize.bind(resizeHandler));
        }

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

        if (mapDimensions) {
            mapDimensions({
                target: {
                    innerWidth: device.cssWidth,
                    innerHeight: device.cssHeight
                }
            })
                .then(resizeHandler.handleResize.bind(resizeHandler));
        }
    }

    return installResize;
})(window, H5.ResizeHandler, H5.Event);
