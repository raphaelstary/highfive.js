var CollectView = (function () {
    "use strict";

    function CollectView(stage, shipDrawable, initialLives) {
        this.stage = stage;
        this.shipDrawable = shipDrawable;
        this.initialLives = initialLives;

        this.collectSprite = this.stage.getSprite('collect-star-anim/collect_star', 30, false);
    }

    CollectView.prototype.collectStar = function (lives) {
        var self = this;
        this.stage.animate(this.shipDrawable, this.collectSprite, setRightShipImgAfterAnimation);

        function setRightShipImgAfterAnimation() {
            if (lives == self.initialLives - 1) {
                self.shipDrawable.img = self.stage.getSubImage('damaged-ship2');
            } else if (lives == self.initialLives - 2) {
                self.shipDrawable.img = self.stage.getSubImage('damaged-ship3');
            } else {
                self.shipDrawable.img = self.stage.getSubImage('ship');
            }
        }
    };

    return CollectView;
})();