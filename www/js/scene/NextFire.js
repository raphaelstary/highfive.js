var NextFire = (function (widthHalf, heightHalf, fontSize_30, setTimeout) {
    "use strict";

    function NextFire(stage) {
        this.stage = stage;
    }

    NextFire.prototype.show = function (nextScene) {
        var drawable = this.stage.drawText(widthHalf, heightHalf, "Next Fire! Fire Fire Fire!",
            fontSize_30, 'Arial', 'black');

        var self = this;
        setTimeout(function () {
            self.stage.remove(drawable);
            nextScene();
        }, 1000);
    };

    return NextFire;
})(widthHalf, heightHalf, fontSize_30, window.setTimeout);