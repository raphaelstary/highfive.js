var TimeView = (function () {
    "use strict";

    function TimeView(timeDrawable) {
        this.timeDrawable = timeDrawable;
    }

    TimeView.prototype.set = function (timeInSeconds) {
        this.time = timeInSeconds;

        var min = Math.floor(timeInSeconds / 60);
        var sec = timeInSeconds % 60;
        var msg = "";
        if (min.toString().length < 2) {
            msg += '0' + min + ':';
        } else {
            msg += min + ':';
        }
        if (sec.toString().length < 2) {
            msg += '0' + sec;
        } else {
            msg += sec;
        }

        this.timeDrawable.txt.msg = msg;
    };

    TimeView.prototype.decrease = function () {
        this.set(--this.time);
    };

    return TimeView;
})();