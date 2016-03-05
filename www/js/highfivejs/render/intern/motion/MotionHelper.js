H5.MotionHelper = (function () {
    "use strict";

    function MotionHelper(motions) {
        this.motions = motions;
    }

    MotionHelper.prototype.moveRoundTrip = function (drawable, pathTo, pathReturn, loopTheTrip, callbackTo,
        callbackReturn) {
        var self = this;

        function startRoundTrip() {
            if (callbackTo) {
                self.motions.animate(drawable, pathTo, function () {
                    callbackTo();
                    fromBtoA();
                });
            } else {
                self.motions.animate(drawable, pathTo, fromBtoA);
            }
        }

        function fromAtoB() {
            if (self.motions.has(drawable)) {
                startRoundTrip();
            }
        }

        function fromBtoA() {
            if (self.motions.has(drawable)) {
                if (loopTheTrip) {
                    if (callbackReturn) {
                        self.motions.animate(drawable, pathReturn, function () {
                            callbackReturn();
                            fromAtoB();
                        });
                    } else {
                        self.motions.animate(drawable, pathReturn, fromAtoB);
                    }
                } else {
                    if (callbackReturn) {
                        self.motions.animate(drawable, pathReturn, callbackReturn);
                    } else {
                        self.motions.animate(drawable, pathReturn);
                    }
                }
            }
        }

        startRoundTrip();
    };

    return MotionHelper;
})();