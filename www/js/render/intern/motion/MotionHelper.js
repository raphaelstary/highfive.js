var MotionHelper = (function () {
    "use strict";

    function MotionHelper(motions) {
        this.motions = motions;
    }

    MotionHelper.prototype.moveRoundTrip = function (drawable, pathTo, pathReturn, loopTheTrip, callbackTo,
        callbackReturn) {
        var self = this;

        function startRoundTrip() {
            if (callbackTo) {
                self.motions.move(drawable, pathTo, function () {
                    callbackTo();
                    fromBtoA();
                });
            } else {
                self.motions.move(drawable, pathTo, fromBtoA);
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
                        self.motions.move(drawable, pathReturn, function () {
                            callbackReturn();
                            fromAtoB();
                        });
                    } else {
                        self.motions.move(drawable, pathReturn, fromAtoB);
                    }
                } else {
                    if (callbackReturn) {
                        self.motions.move(drawable, pathReturn, callbackReturn);
                    } else {
                        self.motions.move(drawable, pathReturn);
                    }
                }
            }
        }

        startRoundTrip();
    };

    return MotionHelper;
})();