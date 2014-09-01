var PropertyManagement = (function (range) {
    "use strict";

    function PropertyManagement(windowView) {
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
    }

    PropertyManagement.prototype.populate = function (people) {
        this.people = people;

        for (var key in this.flats) {
            var nrOfTenants = this.people.length;
            var randomTenantIndex = range(0, nrOfTenants - 1);
            var selectedTenant = this.people.splice(randomTenantIndex, 1)[0];

            this.flats[key] = this.windowView['createDrawableAtSpot' + key](selectedTenant + '_inside');
        }
    };

    return PropertyManagement;
})(range);