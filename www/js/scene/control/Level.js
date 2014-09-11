var Level = (function () {
    "use strict";

    function Level(initialData, timeView, peopleView, propertyMngmt, collisionDetector, fireFighterDrawable,
                   objectsToCatch, objectsToAvoid) {

        this.timeView = timeView;
        this.peopleView = peopleView;
        this.propertyMngmt = propertyMngmt;
        this.collisionDetector = collisionDetector;
        this.fireFighterDrawable = fireFighterDrawable;
        this.objectsToCatch = objectsToCatch;
        this.objectsToAvoid = objectsToAvoid;

        this.init(initialData);

        this.__runing = false;
        this.__tickCounter = 0;
    }

    Level.prototype.init = function (data) {
        this.timeLeft = data.time;
        this.timeView.set(data.time);
        this.peopleLeft = data.people.length;
        this.peopleView.set(data.people.length);

        this.propertyMngmt.populateAll(data.people, this.decreasePeopleCounter.bind(this));
    };

    Level.prototype.start = function () {
        this.__runing = true;
    };

    Level.prototype.tick = function () {
        if (!this.__runing)
            return;

        if (++this.__tickCounter >= 60) {
            this.__tickCounter = 0;
            this.decreaseTime();
        }

        var fireFighterCornerY = this.fireFighterDrawable.getCornerY();
        var self = this;
        for (var key in this.objectsToCatch) {
            var goodStuff = this.objectsToCatch[key];
            if (goodStuff.getEndY() >= fireFighterCornerY && self.collisionDetector.isHit(goodStuff)) {
                // do smth;
                console.log('HIT good');
            }
        }
//        this.objectsToAvoid.forEach(function (badStuff) {
//            if (badStuff.getEndY() >= fireFighterCornerY && self.collisionDetector.isHit(badStuff)) {
//                do smth;
//                console.log('HIT bad');
//            }
//        });
    };

    Level.prototype.decreaseTime = function () {
        this.timeView.set(--this.timeLeft);
    };

    Level.prototype.decreasePeopleCounter = function () {
        this.peopleView.set(--this.peopleLeft);
    };

    return Level;
})();