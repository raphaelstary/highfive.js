var PropertyManagement = (function (range) {
    "use strict";

    function PropertyManagement(windowView, input, pushDown) {
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
        this.pushDown = pushDown;
    }

    PropertyManagement.prototype.populateAll = function (people, decreasePeopleCounter) {
        this.people = people;
        this.decreasePeopleCounter = decreasePeopleCounter;

        for (var key in this.flats) {
            if (people.length > 0)
                this.populateSingle(key);
        }
    };

    PropertyManagement.prototype.populateSingle = function (flatKey) {
        var nrOfTenants = this.people.length;
        var randomTenantIndex = range(0, nrOfTenants - 1);
        var selectedTenant = this.people.splice(randomTenantIndex, 1)[0];

        var drawableWrapper = this.windowView['createDrawableAtSpot' + flatKey](selectedTenant + '_inside');
        this.flats[flatKey] = drawableWrapper;

        var self = this;
        this.input.add(drawableWrapper.input, function () {
            self.decreasePeopleCounter();
            self.windowView.remove(drawableWrapper.drawable);
            self.input.remove(drawableWrapper.input);
            self.pushDown(drawableWrapper.xFn, drawableWrapper.yFn, selectedTenant, function () {
                if (self.people.length > 0)
                    self.populateSingle(flatKey);
            });
        });
    };

    return PropertyManagement;
})(range);