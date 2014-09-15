var Ready = (function (widthHalf, heightHalf, fontSize_30, getTopRaster, fontSize_15) {
    "use strict";

    function Ready(stage, tapController, fsController) {
        this.stage = stage;
        this.tapController = tapController;
        this.goFS = fsController;
    }

    Ready.prototype.show = function (nextScene) {
        var justTxt = this.stage.drawText(widthHalf, getTopRaster, "Fire Fire Fire! Let's rescue some Cats!",
            fontSize_30, 'Arial', 'black');
        var wrapper = this.stage.drawTextWithInput(widthHalf, heightHalf, ">>LET's GO<<",
            fontSize_15, 'Arial', 'black');
        var self = this;
        this.tapController.add(wrapper.input, function () {
            self.goFS.request();
            self.tapController.remove(wrapper.input);
            self.stage.remove(wrapper.drawable);
            self.stage.remove(justTxt);

            nextScene();
        });
    };

    return Ready;
})(widthHalf, heightHalf, fontSize_30, getTopRaster, fontSize_15);