var GameOver = (function (widthHalf, heightHalf, fontSize_30, getTopRaster, fontSize_15) {
    "use strict";

    function GameOver(stage, tapController) {
        this.stage = stage;
        this.tapController = tapController;
    }

    GameOver.prototype.show = function (nextScene) {
        var justTxt = this.stage.drawText(widthHalf, getTopRaster, "Damn, be more careful! People count on you!",
            fontSize_30, 'Arial', 'black');
        var wrapper = this.stage.drawTextWithInput(widthHalf, heightHalf,
            ">>Retry?<<",
            fontSize_15, 'Arial', 'black');

        var self = this;
        this.tapController.add(wrapper.input, function () {
            self.tapController.remove(wrapper.input);
            self.stage.remove(wrapper.drawable);
            self.stage.remove(justTxt);

            nextScene();
        });
    };

    return GameOver;
})(widthHalf, heightHalf, fontSize_30, getTopRaster, fontSize_15);