var GetReady = (function (Transition, calcScreenConst) {
    "use strict";

    function GetReady(stage) {
        this.stage = stage;
    }

    GetReady.prototype.show = function (nextScene, screenWidth, screenHeight) {
        var self = this;
        var heightThird = calcScreenConst(screenHeight, 3);
        var readyWidth = self.stage.getSubImage('getready').width;
        var readyDrawable = self.stage.getDrawable(- readyWidth, heightThird, 'getready');

        var readyPath = self.stage.getPath(- readyWidth, heightThird, screenWidth + readyWidth, heightThird, 90,
            Transition.EASE_OUT_IN_SIN);

        self.stage.move(readyDrawable, readyPath, function () {

            // create end event method to end scene, this is endGetReadyScene
            self.stage.remove(readyDrawable);

            nextScene();
        });
    };

    return GetReady;
})(Transition, calcScreenConst);