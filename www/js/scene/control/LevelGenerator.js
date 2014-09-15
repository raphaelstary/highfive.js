var LevelGenerator = (function (range) {
    "use strict";

    function LevelGenerator(windowView, input, pusher) {
        this.flats = {
            1: null,
            2: null,
            3: null,
            4: null,
            5: null,
            6: null,
            7: null,
            8: null,
            9: null
        };

        this.windowView = windowView;
        this.input = input;
        this.pusher = pusher;
        this.__runing = true;
    }

    LevelGenerator.prototype.populateAll = function (people, decreasePeopleCounter, bulkyWaste,
                                                     percentageForPeopleOverWaste) {
        this.people = people;
        this.waste = bulkyWaste;
        this.percentageForPeople = percentageForPeopleOverWaste;
        this.decreasePeopleCounter = decreasePeopleCounter;

        for (var key in this.flats) {
            if (people.length > 0 || bulkyWaste.length > 0)
                this.populateSingle(key);
        }
    };

    LevelGenerator.prototype.populateSingle = function (flatKey) {
        if (range(1, 100) <= this.percentageForPeople && this.people.length > 0 || this.waste.length < 1) {
            this.__populateFlat(this.people, this.decreasePeopleCounter, this.pusher.pushDown.bind(this.pusher),
                flatKey);
        } else if (this.waste.length > 0) {
            this.__populateFlat(this.waste, function () {}, this.pusher.throwDown.bind(this.pusher), flatKey);
        }
    };

    LevelGenerator.prototype.__populateFlat = function (stuff, callback, pushFn, flatKey) {
        var self = this;
        var nrOfTenants = stuff.length;
        var randomTenantIndex = range(0, nrOfTenants - 1);
        var selectedTenant = stuff.splice(randomTenantIndex, 1)[0];

        var drawableWrapper = self.windowView['createDrawableAtSpot' + flatKey](selectedTenant + '_inside');
        self.flats[flatKey] = drawableWrapper;

        self.input.add(drawableWrapper.input, function () {
            callback();
            self.windowView.remove(drawableWrapper.drawable);
            self.input.remove(drawableWrapper.input);
            pushFn(drawableWrapper.xFn, drawableWrapper.yFn, selectedTenant, function () {
                if (self.__runing && stuff.length > 0)
                    self.populateSingle(flatKey);
            });
        });
    };

    LevelGenerator.prototype.clearAll = function () {
        for (var key in this.flats) {
            var tenant = this.flats[key];
            if (tenant == null) {
                continue;
            }
            this.input.remove(tenant.input);
            this.windowView.remove(tenant.drawable);
        }
    };

    return LevelGenerator;
})(range);