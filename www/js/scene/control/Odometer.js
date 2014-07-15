var Odometer = (function () {
    "use strict";

    function Odometer(stage, countDrawables) {
        this.stage = stage;
        this.countDrawables = countDrawables;

        this.totalScore = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this._initRenderStuff();
    }

    Odometer.prototype._initRenderStuff = function () {
        var sprite0_1, sprite1_2, sprite2_3, sprite3_4, sprite4_5, sprite5_6, sprite6_7, sprite7_8, sprite8_9, sprite9_0;

        sprite0_1 = this.stage.getSprite('0_1-anim/0_1', 15, false);
        sprite1_2 = this.stage.getSprite('1_2-anim/1_2', 15, false);
        sprite2_3 = this.stage.getSprite('2_3-anim/2_3', 15, false);
        sprite3_4 = this.stage.getSprite('3_4-anim/3_4', 15, false);
        sprite4_5 = this.stage.getSprite('4_5-anim/4_5', 15, false);
        sprite5_6 = this.stage.getSprite('5_6-anim/5_6', 15, false);
        sprite6_7 = this.stage.getSprite('6_7-anim/6_7', 15, false);
        sprite7_8 = this.stage.getSprite('7_8-anim/7_8', 15, false);
        sprite8_9 = this.stage.getSprite('8_9-anim/8_9', 15, false);
        sprite9_0 = this.stage.getSprite('9_0-anim/9_0', 15, false);
        this.countSprites = [sprite0_1, sprite1_2, sprite2_3, sprite3_4, sprite4_5, sprite5_6, sprite6_7, sprite7_8, sprite8_9, sprite9_0];

        this.countStatics = [this.stage.getSubImage('num/numeral0'), this.stage.getSubImage('num/numeral1'), this.stage.getSubImage('num/numeral2'),
            this.stage.getSubImage('num/numeral3'), this.stage.getSubImage('num/numeral4'), this.stage.getSubImage('num/numeral5'),
            this.stage.getSubImage('num/numeral6'), this.stage.getSubImage('num/numeral7'), this.stage.getSubImage('num/numeral8'),
            this.stage.getSubImage('num/numeral9')];
    };

    Odometer.prototype.addScore = function (score) {
        var self = this;
        var scoreString = score.toString();

        var u = 0,
            overflow = 0;

        for (var i = scoreString.length - 1; i > -1; i--) {
            addDigit(parseInt(scoreString[i], 10));
        }
        while (overflow > 0) {
            addDigit(0);
        }

        function addDigit(intToAdd) {
            var currentDigit = self.totalScore[u];
            var tmpAmount = currentDigit + intToAdd + overflow;
            overflow = Math.floor(tmpAmount / 10);
            var newDigit = tmpAmount % 10;

            var delta = tmpAmount - currentDigit;
            var currentDrawable = self.countDrawables[u];
            for (var v = 0; v < delta; v++) {
                var currentSprite = self.countSprites[(currentDigit + v) % 10];
                (function (currentDrawable, currentDigit, v) {
                    self.stage.animate(currentDrawable, currentSprite, function () {
                        currentDrawable.img = self.countStatics[(currentDigit + 1 + v) % 10];
                    })
                })(currentDrawable, currentDigit, v);
                if ((currentDigit + v) % 10 === newDigit) {
                    break;
                }
            }

            self.totalScore[u] = newDigit;

            u++;
        }
    };

    return Odometer;
})();