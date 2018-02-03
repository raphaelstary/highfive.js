H5.VisibilityHandler = (function (document, Event) {
    'use strict';

    function VisibilityHandler(events) {
        this.events = events;
        this.lastState = document.hidden;
    }

    VisibilityHandler.prototype.handleVisibility = function () {
        var hidden = document.hidden;
        if (this.lastState !== hidden) {
            this.events.fireSync(Event.PAGE_VISIBILITY, hidden);
            this.lastState = hidden;
        }
    };

    return VisibilityHandler;
})(window.document, H5.Event);
