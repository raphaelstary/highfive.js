var ScoreView = (function () {
    "use strict";

    function ScoreView(stage) {
        this.stage = stage;

        this.scoredPointsSprite = this.stage.getSprite('score-10-anim/score_10', 20, false);
        this.scoredPointsDrawable = this.stage.getDrawable(0, 0, 'score-10-anim/score_10_0000', 3);
    }

    ScoreView.prototype.showScoredPoints = function (x, y) {
        var yOffSet = 50;

        this.scoredPointsDrawable.x = x;
        this.scoredPointsDrawable.y = y - yOffSet;

        var self = this;
        this.stage.animate(this.scoredPointsDrawable, this.scoredPointsSprite, function () {
            self.stage.remove(self.scoredPointsDrawable);
        });
    };

    return ScoreView;
})();