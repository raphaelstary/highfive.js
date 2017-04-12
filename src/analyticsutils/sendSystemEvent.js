H5.sendSystemEvent = (function (Event, location, navigator, Promise, getGamepads, Date, languageCode) {
    'use strict';

    function collectPositionInfo() {
        return new Promise(function (resolve) {
            navigator.geolocation.getCurrentPosition(function (position) {
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
                resolve(info);
            }, function (error) {
                resolve(error);
            }, {enableHighAccuracy: false});
        });
    }

    function collectGamePadInfo() {
        var gamePads = getGamepads();
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
        };
    }

    function getPayload(device, appName, appVersion, appPlatform) {
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
            language: languageCode,
            userTime: Date.now(),
            userTimeString: Date(),
            location: location.href,
            gamePadInfo: collectGamePadInfo(),
            app: appName,
            version: appVersion,
            platform: appPlatform
        };
    }

    function sendSystemEvent(info, device, events, usePosition) {

        if (usePosition) {
            collectPositionInfo().then(function (positionInfo) {

                var payload = getPayload(device, info.name, info.version, info.platform);
                payload.positionInfo = positionInfo;

                events.fire(Event.ANALYTICS, payload);
            });
        } else {
            events.fire(Event.ANALYTICS, getPayload(device, info.name, info.version, info.platform));
        }
    }

    return sendSystemEvent;
})(H5.Event, window.location, window.navigator, H5.Promise, H5.getGamepads, Date,
    window.navigator.language || window.navigator.userLanguage);