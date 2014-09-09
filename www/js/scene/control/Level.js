var Level = (function () {
    "use strict";

    function Level(initialData, timeView, peopleView, fireFighterView, propertyMngmt) {
        this.timeView = timeView;
        this.peopleView = peopleView;
        this.fireFighterView = fireFighterView;
        this.propertyMngmt = propertyMngmt;

        this.init(initialData);

        this.__runing = false;
    }

    Level.prototype.init = function (data) {
        this.timeView.set(data.time);
        this.peopleView.set(data.people.length);

        this.propertyMngmt.populateAll(data.people);
    };

    Level.prototype.start = function () {
        this.__runing = true;

        this.fireFighterView.start();
    };

    Level.prototype.tick = function () {
        if (!this.__runing)
            return;

        this.fireFighterView.tick();
    };

    Level.prototype.resize = function (width, height) {
        this.fireFighterView.resize(width);
    };

    return Level;
})();