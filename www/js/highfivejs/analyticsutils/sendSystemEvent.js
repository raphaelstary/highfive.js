var sendSystemEvent = (function (Event, location) {
    "use strict";

    function sendSystemEvent(device, messages, events) {
        var payload = {
            type: 'system',
            width: device.width,
            height: device.height,
            cssWidth: device.cssWidth,
            cssHeight: device.cssHeight,
            screenWidth: device.screenWidth,
            screenHeight: device.screenHeight,
            devicePixelRatio: device.devicePixelRatio,
            mobile: device.isMobile,
            userAgent: device.userAgent,
            language: messages.defaultLanguageCode,
            userTime: Date.now(),
            userTimeString: Date(),
            location: location.href
        };

        events.fire(Event.ANALYTICS, payload);
    }

    return sendSystemEvent;
})(Event, window.location);