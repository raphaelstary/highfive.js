H5.installVisibility = (function (VisibilityHandler, document, Event) {
    'use strict';

    function installVisibility(events, device) {
        var handler = new VisibilityHandler(events);

        if (document.hidden === undefined) {
            return;
        }

        document.addEventListener('visibilitychange', handler.handleVisibility.bind(handler));

        device.pageHidden = handler.lastState;
        events.subscribe(Event.PAGE_VISIBILITY, function (hidden) {
            device.pageHidden = hidden;
        });
    }

    return installVisibility;
})(H5.VisibilityHandler, window.document, H5.Event);
