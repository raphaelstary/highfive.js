var WindowView = (function (WindowHelper) {
    "use strict";

    function WindowView(stage, backGroundDrawable) {
        this.stage = stage;
        this.bg = backGroundDrawable;
    }

    WindowView.prototype.createDrawableAtSpot1 = function (imgKey) {
        return this.__createDrawable(WindowHelper.getFirstColumn.bind(null, this.bg),
            WindowHelper.getFirstRow.bind(null, this.bg), imgKey);
    };

    WindowView.prototype.createDrawableAtSpot2 = function (imgKey) {
        return this.__createDrawable(WindowHelper.getSecondColumn.bind(null, this.bg),
            WindowHelper.getFirstRow.bind(null, this.bg), imgKey);
    };

    WindowView.prototype.createDrawableAtSpot3 = function (imgKey) {
        return this.__createDrawable(WindowHelper.getThirdColumn.bind(null, this.bg),
            WindowHelper.getFirstRow.bind(null, this.bg), imgKey);
    };

    WindowView.prototype.createDrawableAtSpot4 = function (imgKey) {
        return this.__createDrawable(WindowHelper.getFirstColumn.bind(null, this.bg),
            WindowHelper.getSecondRow.bind(null, this.bg), imgKey);
    };

    WindowView.prototype.createDrawableAtSpot5 = function (imgKey) {
        return this.__createDrawable(WindowHelper.getSecondColumn.bind(null, this.bg),
            WindowHelper.getSecondRow.bind(null, this.bg), imgKey);
    };

    WindowView.prototype.createDrawableAtSpot6 = function (imgKey) {
        return this.__createDrawable(WindowHelper.getThirdColumn.bind(null, this.bg),
            WindowHelper.getSecondRow.bind(null, this.bg), imgKey);
    };

    WindowView.prototype.createDrawableAtSpot7 = function (imgKey) {
        return this.__createDrawable(WindowHelper.getFirstColumn.bind(null, this.bg),
            WindowHelper.getThirdRow.bind(null, this.bg), imgKey);
    };

    WindowView.prototype.createDrawableAtSpot8 = function (imgKey) {
        return this.__createDrawable(WindowHelper.getSecondColumn.bind(null, this.bg),
            WindowHelper.getThirdRow.bind(null, this.bg), imgKey);
    };

    WindowView.prototype.createDrawableAtSpot9 = function (imgKey) {
        return this.__createDrawable(WindowHelper.getThirdColumn.bind(null, this.bg),
            WindowHelper.getThirdRow.bind(null, this.bg), imgKey);
    };

    WindowView.prototype.__createDrawable = function (xFn, yFn, imgKey) {
        var wrapper = this.stage.drawFreshWithInput(xFn, yFn, imgKey);
        return {
            drawable: wrapper.drawable,
            input: wrapper.input,
            xFn: xFn,
            yFn: yFn
        };
    };

    WindowView.prototype.remove = function (drawable) {
        this.stage.remove(drawable);
    };

    return WindowView;
})(WindowHelper);