var GetReady = (function (Transition) {
    "use strict";

    function GetReady(stage) {
        this.stage = stage;
    }

    GetReady.prototype.show = function () {
        var self = this;
        var readyDrawable = self.stage.getDrawable(-160, 480 / 3, 'ready-anim/get_ready_0010');

        var readyPath = self.stage.getPath(-160, 480 / 3, 320 + 160, 480 / 3, 90, Transition.EASE_OUT_IN_SIN);

        self.stage.move(readyDrawable, readyPath, function () {

            // create end event method to end scene, this is endGetReadyScene
            self.stage.remove(readyDrawable);

            self.next();
        });
    };

    GetReady.prototype.next = function () {

    };

    return GetReady;
})(Transition);