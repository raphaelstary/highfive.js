var ScoreView = (function (calcScreenConst) {
    "use strict";

    function ScoreView(stage, screenWidth, screenHeight) {
        this.stage = stage;

        this.scoredPointsSprite = this.stage.getSprite('score-10-anim/score_10', 20, false);
        this.scoredPointsDrawable = this.stage.getDrawable(0, 0, 'score-10-anim/score_10_0000', 3);

        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
    }

    ScoreView.prototype.showScoredPoints = function (x, y) {
        var yOffSet = calcScreenConst(this.screenHeight, 48, 5);

        this.scoredPointsDrawable.x = x;
        this.scoredPointsDrawable.y = y - yOffSet;

        var self = this;
        this.stage.animate(this.scoredPointsDrawable, this.scoredPointsSprite, function () {
            self.stage.remove(self.scoredPointsDrawable);
        });
    };

    return ScoreView;
})(calcScreenConst);