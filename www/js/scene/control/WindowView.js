var WindowView = (function (calcScreenConst) {
    "use strict";

    function WindowView(stage, backGroundDrawable) {
        this.stage = stage;
        this.bg = backGroundDrawable;
    }

    WindowView.prototype.createDrawableAtSpot1 = function (imgKey) {
        return this.stage.drawFresh(getFirstColumn.bind(null, this.bg), getFirstRow.bind(null, this.bg), imgKey);
    };

    WindowView.prototype.createDrawableAtSpot2 = function (imgKey) {
        return this.stage.drawFresh(getSecondColumn.bind(null, this.bg), getFirstRow.bind(null, this.bg), imgKey);
    };

    WindowView.prototype.createDrawableAtSpot3 = function (imgKey) {
        return this.stage.drawFresh(getThirdColumn.bind(null, this.bg), getFirstRow.bind(null, this.bg), imgKey);
    };

    WindowView.prototype.createDrawableAtSpot4 = function (imgKey) {
        return this.stage.drawFresh(getFirstColumn.bind(null, this.bg), getSecondRow.bind(null, this.bg), imgKey);
    };

    WindowView.prototype.createDrawableAtSpot5 = function (imgKey) {
        return this.stage.drawFresh(getSecondColumn.bind(null, this.bg), getSecondRow.bind(null, this.bg), imgKey);
    };

    WindowView.prototype.createDrawableAtSpot6 = function (imgKey) {
        return this.stage.drawFresh(getThirdColumn.bind(null, this.bg), getSecondRow.bind(null, this.bg), imgKey);
    };

    WindowView.prototype.createDrawableAtSpot7 = function (imgKey) {
        return this.stage.drawFresh(getFirstColumn.bind(null, this.bg), getThirdRow.bind(null, this.bg), imgKey);
    };

    WindowView.prototype.createDrawableAtSpot8 = function (imgKey) {
        return this.stage.drawFresh(getSecondColumn.bind(null, this.bg), getThirdRow.bind(null, this.bg), imgKey);
    };

    WindowView.prototype.createDrawableAtSpot9 = function (imgKey) {
        return this.stage.drawFresh(getThirdColumn.bind(null, this.bg), getThirdRow.bind(null, this.bg), imgKey);
    };

    function getFirstColumn(bg) {
        return bg.getCornerX() + calcScreenConst(bg.getWidth(), 10, 3);
    }

    function getSecondColumn(bg) {
        return bg.getCornerX() + calcScreenConst(bg.getWidth(), 2);
    }

    function getThirdColumn(bg) {
        return bg.getCornerX() + calcScreenConst(bg.getWidth(), 10, 7);
    }

    function getFirstRow(bg) {
        return bg.getCornerY() + calcScreenConst(bg.getHeight(), 100, 26);
    }

    function getSecondRow(bg) {
        return bg.getCornerY() + calcScreenConst(bg.getHeight(), 100, 39);
    }

    function getThirdRow(bg) {
        return bg.getCornerY() + calcScreenConst(bg.getHeight(), 100, 52);
    }

    return WindowView;
})(calcScreenConst);