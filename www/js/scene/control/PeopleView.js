var PeopleView = (function () {
    "use strict";

    function PeopleView(peopleDrawable) {
        this.peopleDrawable = peopleDrawable;
    }

    PeopleView.prototype.set = function (numberOfPeople) {
        this.peopleDrawable.txt.msg = numberOfPeople + " left";
    };

    return PeopleView;
})();