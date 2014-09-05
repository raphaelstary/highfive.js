var WindowView = (function (WindowHelper) {
    "use strict";

    function WindowView(stage, backGroundDrawable) {
        this.stage = stage;
        this.bg = backGroundDrawable;
    }

    WindowView.prototype.createDrawableAtSpot1 = function (imgKey) {
        return this.stage.drawFresh(WindowHelper.getFirstColumn.bind(null, this.bg),
            WindowHelper.getFirstRow.bind(null, this.bg), imgKey);
    };

    WindowView.prototype.createDrawableAtSpot2 = function (imgKey) {
        return this.stage.drawFresh(WindowHelper.getSecondColumn.bind(null, this.bg),
            WindowHelper.getFirstRow.bind(null, this.bg), imgKey);
    };

    WindowView.prototype.createDrawableAtSpot3 = function (imgKey) {
        return this.stage.drawFresh(WindowHelper.getThirdColumn.bind(null, this.bg),
            WindowHelper.getFirstRow.bind(null, this.bg), imgKey);
    };

    WindowView.prototype.createDrawableAtSpot4 = function (imgKey) {
        return this.stage.drawFresh(WindowHelper.getFirstColumn.bind(null, this.bg),
            WindowHelper.getSecondRow.bind(null, this.bg), imgKey);
    };

    WindowView.prototype.createDrawableAtSpot5 = function (imgKey) {
        return this.stage.drawFresh(WindowHelper.getSecondColumn.bind(null, this.bg),
            WindowHelper.getSecondRow.bind(null, this.bg), imgKey);
    };

    WindowView.prototype.createDrawableAtSpot6 = function (imgKey) {
        return this.stage.drawFresh(WindowHelper.getThirdColumn.bind(null, this.bg),
            WindowHelper.getSecondRow.bind(null, this.bg), imgKey);
    };

    WindowView.prototype.createDrawableAtSpot7 = function (imgKey) {
        return this.stage.drawFresh(WindowHelper.getFirstColumn.bind(null, this.bg),
            WindowHelper.getThirdRow.bind(null, this.bg), imgKey);
    };

    WindowView.prototype.createDrawableAtSpot8 = function (imgKey) {
        return this.stage.drawFresh(WindowHelper.getSecondColumn.bind(null, this.bg),
            WindowHelper.getThirdRow.bind(null, this.bg), imgKey);
    };

    WindowView.prototype.createDrawableAtSpot9 = function (imgKey) {
        return this.stage.drawFresh(WindowHelper.getThirdColumn.bind(null, this.bg),
            WindowHelper.getThirdRow.bind(null, this.bg), imgKey);
    };

    return WindowView;
})(WindowHelper);