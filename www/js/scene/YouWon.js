var YouWon = (function (widthHalf, heightHalf, fontSize_30) {
    "use strict";

    function YouWon(stage) {
        this.stage = stage;
    }

    YouWon.prototype.show = function (nextScene) {
        this.stage.drawText(widthHalf, heightHalf, "You really did it!!! You won!!! You are soo fucking awesome!!! " +
                "thanks so much for playing :)",
            fontSize_30, 'Arial', 'black', 3, undefined, 0, 1,
                window.innerWidth / 3, fontSize_30(window.innerWidth, window.innerHeight) + 5);

    };

    return YouWon;
})(widthHalf, heightHalf, fontSize_30);