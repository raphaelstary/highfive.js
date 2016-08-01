H5.sendSystemEvent = (function (Event, location, appName, appVersion) {
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
            location: location.href,
            app: appName,
            version: appVersion
        };

        events.fire(Event.ANALYTICS, payload);
    }

    return sendSystemEvent;
})(H5.Event, window.location, window.appName, window.appVersion);