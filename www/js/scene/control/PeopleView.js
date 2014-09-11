var PeopleView = (function () {
    "use strict";

    function PeopleView(peopleDrawable) {
        this.peopleDrawable = peopleDrawable;
    }

    PeopleView.prototype.set = function (numberOfPeople) {
        this.actualNumber = numberOfPeople;
        this.peopleDrawable.txt.msg = numberOfPeople + " left";
    };

    PeopleView.prototype.decrease = function () {
        this.set(--this.actualNumber);
    };

    return PeopleView;
})();