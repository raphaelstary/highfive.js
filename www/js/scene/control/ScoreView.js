var ScoreView = (function (calcScreenConst) {
    "use strict";

    function ScoreView(stage, screenWidth, screenHeight) {
        this.stage = stage;

        this.scoredPointsSprite = this.stage.getSprite('score-10-anim/score_10', 20, false);
        this.scoredPointsDrawable = this.stage.getDrawable(0, 0, 'score-10-anim/score_10_0000', 3);

        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
    }

    ScoreView.prototype._setDrawablePosition = function (x, y) {
        var yOffSet = calcScreenConst(this.screenHeight, 48, 5);

        this.scoredPointsDrawable.x = x;
        this.scoredPointsDrawable.y = y - yOffSet;

        this.lastX = x;
        this.lastY = y;
    };

    ScoreView.prototype.showScoredPoints = function (x, y) {
        this._setDrawablePosition(x, y);

        var self = this;
        this.stage.animate(this.scoredPointsDrawable, this.scoredPointsSprite, function () {
            self.stage.remove(self.scoredPointsDrawable);
        });
    };

    ScoreView.prototype.resize = function (width, height) {
        this.screenWidth = width;
        this.screenHeight = height;
        this._setDrawablePosition(this.lastX, this.lastY);
    };

    return ScoreView;
})(calcScreenConst);