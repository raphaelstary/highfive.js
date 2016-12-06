H5.sendSystemEvent = (function (Event, location, geolocation, Promise, GamePad, Date) {
    "use strict";

    function collectPositionInfo() {
        var promise = new Promise();

        geolocation.getCurrentPosition(function (position) {
            var info = {
                accuracy: position.coords.accuracy,
                altitude: position.coords.altitude,
                altitudeAccuracy: position.coords.altitudeAccuracy,
                heading: position.coords.heading,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                speed: position.coords.speed,
                timestamp: position.timestamp
            };
            promise.resolve(info);
        }, function (error) {
            promise.resolve(error);
        }, {enableHighAccuracy: false});

        return promise;
    }

    function collectGamePadInfo() {
        var gamePad = new GamePad();
        var gamePads = gamePad.getGamePads();
        var padsInfo = [];
        var connectedGamePads = 0;
        for (var i = 0; i < gamePads.length; i++) {
            var currentPad = gamePads[i];
            if (currentPad) {
                connectedGamePads++;

                padsInfo.push({
                    id: gamePads[i].id,
                    index: gamePads[i].index,
                    mapping: gamePads[i].mapping,
                    profile: gamePads[i].profile
                });
            }
        }

        return {
            connectedGamePads: connectedGamePads,
            gamePadInfo: padsInfo
        }
    }

    function getPayload(device, messages, appName, appVersion, appPlatform) {
        return {
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
            gamePadInfo: collectGamePadInfo(),
            app: appName,
            version: appVersion,
            platform: appPlatform
        };
    }

    function sendSystemEvent(appName, appVersion, appPlatform, device, messages, events, usePosition) {

        if (usePosition) {
            collectPositionInfo().then(function (positionInfo) {

                var payload = getPayload(device, messages, appName, appVersion, appPlatform);
                payload.positionInfo = positionInfo;

                events.fire(Event.ANALYTICS, payload);
            });
        } else {
            events.fire(Event.ANALYTICS, getPayload(device, messages, appName, appVersion, appPlatform));
        }
    }

    return sendSystemEvent;
})(H5.Event, window.location, window.navigator.geolocation, H5.Promise, H5.GamePad, Date);