var CollectView = (function () {
    "use strict";

    var COLLECT_HIGHLIGHT = 'collect_highlight/collect_highlight';
    var SHIP = 'ship';
    var DAMAGED_SHIP_3 = 'damaged_ship_3';
    var DAMAGED_SHIP_2 = 'damaged_ship_2';

    function CollectView(stage, shipDrawable, initialLives) {
        this.stage = stage;
        this.shipDrawable = shipDrawable;
        this.initialLives = initialLives;

        this.collectSprite = this.stage.getSprite(COLLECT_HIGHLIGHT, 30, false);
    }

    CollectView.prototype.collectStar = function (lives) {
        var self = this;
        this.stage.animate(this.shipDrawable, this.collectSprite, setRightShipImgAfterAnimation);

        function setRightShipImgAfterAnimation() {
            if (lives == self.initialLives - 1) {
                self.shipDrawable.img = self.stage.getSubImage(DAMAGED_SHIP_2);
            } else if (lives == self.initialLives - 2) {
                self.shipDrawable.img = self.stage.getSubImage(DAMAGED_SHIP_3);
            } else {
                self.shipDrawable.img = self.stage.getSubImage(SHIP);
            }
        }
    };

    return CollectView;
})();