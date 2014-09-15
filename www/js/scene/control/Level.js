var Level = (function () {
    "use strict";

    function Level(initialData, timeView, peopleView, propertyMngmt, pusher,
                   objectsToCatch, objectsToAvoid, stage, drawables) {

        this.timeView = timeView;
        this.peopleView = peopleView;
        this.propertyMngmt = propertyMngmt;
        this.pusher = pusher;
        this.objectsToCatch = objectsToCatch;
        this.objectsToAvoid = objectsToAvoid;
        this.stage = stage;
        this.commonDrawables = drawables;

        this.init(initialData);

        this.__runing = false;
        this.__tickCounter = 0;
    }

    Level.prototype.init = function (data) {
        this.timeLeft = data.time;
        this.timeView.set(data.time);
        this.peopleLeftInHouse = data.people.length;
        this.peopleLeftToSave = data.people.length;
        this.peopleView.set(data.people.length);

        var self = this;
        var fireFighters = [];
        data.fireFighters.forEach(function (fireFighterInfo) {
            var wrapper = FireFighterHelper.init(self.stage, self.commonDrawables.backGround, fireFighterInfo.speed);
            fireFighters.push({
                drawable: wrapper.drawable,
                pathTo: wrapper.pathTo,
                pathReturn: wrapper.pathReturn,
                collisionDetector: self.stage.getCollisionDetector(wrapper.drawable)
            })
        });
        this.fireFighters = fireFighters;

        this.pusher.setKillCallback(this.killPerson.bind(this));

        this.propertyMngmt.populateAll(data.people, this.decreasePeopleCounter.bind(this));
    };

    Level.prototype.start = function () {
        this.__runing = true;
        this.propertyMngmt.__runing = true;
    };

    Level.prototype.stop = function () {
        this.__runing = false;
        this.propertyMngmt.__runing = false;

        var self = this;
        this.fireFighters.forEach(function (fireFighter) {
            self.stage.pause(fireFighter.drawable);
        });
    };

    Level.prototype.tick = function () {
        if (!this.__runing)
            return;

        if (++this.__tickCounter >= 60) {
            this.__tickCounter = 0;
            this.decreaseTime();
        }
        var self = this;

        self.fireFighters.forEach(function (fireFighter) {
            var fireFighterCornerY = fireFighter.drawable.getCornerY();

            var key;
            for (key in self.objectsToCatch) {
                var goodStuff = self.objectsToCatch[key];
                if (goodStuff.getEndY() >= fireFighterCornerY && fireFighter.collisionDetector.isHit(goodStuff)) {

                    self.personSaved(goodStuff);
                }
            }
            for (key in self.objectsToAvoid) {
                var badStuff = self.objectsToAvoid[key];
                if (badStuff.getEndY() >= fireFighterCornerY && fireFighter.collisionDetector.isHit(badStuff)) {

                    self.killFireFighter(fireFighter.drawable);
                    console.log('HIT bad');
                }
            }
        });
    };

    Level.prototype.decreaseTime = function () {
        this.timeView.set(--this.timeLeft);

        if (this.timeLeft < 1) {
            this.timeIsOver();
        }
    };

    Level.prototype.decreasePeopleCounter = function () {
        this.peopleView.set(--this.peopleLeftInHouse);
    };

    Level.prototype.killFireFighter = function () {
        this.failure();
    };

    Level.prototype.personSaved = function (drawable) {
        this.stage.remove(drawable);
        delete this.objectsToCatch[drawable.id];

        this.peopleLeftToSave--;
        if (this.peopleLeftToSave == 0) {
            this.rescueComplete();
        }
    };

    Level.prototype.killPerson = function () {
        this.end(this.failure);
    };

    Level.prototype.timeIsOver = function () {
        this.end(this.failure);
    };

    Level.prototype.rescueComplete = function () {
        this.end(this.success);
    };

    Level.prototype.end = function (callback) {
        this.stop();
        this.preDestroy();
        callback();
    };

    Level.prototype.preDestroy = function () {
        this.propertyMngmt.clearAll();

        var self = this;
        this.fireFighters.forEach(function (fireFighter) {
            self.stage.detachCollisionDetector(fireFighter.collisionDetector);
            self.stage.remove(fireFighter.drawable);
        });

        var key;
        for (key in this.objectsToCatch) {
            delete this.objectsToCatch[key];
        }
        for (key in this.objectsToAvoid) {
            delete this.objectsToAvoid[key];
        }
    };

    return Level;
})();