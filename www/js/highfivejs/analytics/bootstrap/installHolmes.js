H5.installHolmes = (function (Event, HolmesConnector, window) {
    "use strict";

    function installHolmes(url, tenantCode, appKey, events) {
        var gOldOnError = window.onerror;
        window.onerror = function myErrorHandler(errorMsg, url, lineNumber, columnNumber, error) {
            events.fire(Event.ANALYTICS, {
                type: 'error',
                msg: errorMsg,
                url: url,
                line: lineNumber,
                column: columnNumber,
                error: {
                    message: error.message,
                    stack: error.stack
                }
            });

            if (gOldOnError) {
                // Call previous handler.
                return gOldOnError.call(this, errorMsg, url, lineNumber, columnNumber, error);
            }

            // Just let default handler run.
            return false;
        };

        var connector = new HolmesConnector(url, tenantCode, appKey);
        connector.register();

        events.subscribe(Event.ANALYTICS, connector.send.bind(connector));
    }

    return installHolmes;
})(H5.Event, H5.HolmesConnector, window);