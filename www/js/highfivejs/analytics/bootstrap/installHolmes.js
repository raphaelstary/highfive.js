var installHolmes = (function (Event, HolmesConnector) {
    "use strict";

    function installHolmes(url, tenantCode, appKey, events) {
        var connector = new HolmesConnector(url, tenantCode, appKey);
        connector.register();

        events.subscribe(Event.ANALYTICS, connector.send.bind(connector));
    }

    return installHolmes;
})(Event, HolmesConnector);