var OdometerView = (function () {
    "use strict";

    function OdometerView(stage, countDrawables) {
        this.stage = stage;
        this.countDrawables = countDrawables;

        var sprite0_1, sprite1_2, sprite2_3, sprite3_4, sprite4_5, sprite5_6, sprite6_7, sprite7_8, sprite8_9, sprite9_0;

        sprite0_1 = this.stage.getSprite('0_to_1/0_to_1', 15, false);
        sprite1_2 = this.stage.getSprite('1_to_2/1_to_2', 15, false);
        sprite2_3 = this.stage.getSprite('2_to_3/2_to_3', 15, false);
        sprite3_4 = this.stage.getSprite('3_to_4/3_to_4', 15, false);
        sprite4_5 = this.stage.getSprite('4_to_5/4_to_5', 15, false);
        sprite5_6 = this.stage.getSprite('5_to_6/5_to_6', 15, false);
        sprite6_7 = this.stage.getSprite('6_to_7/6_to_7', 15, false);
        sprite7_8 = this.stage.getSprite('7_to_8/7_to_8', 15, false);
        sprite8_9 = this.stage.getSprite('8_to_9/8_to_9', 15, false);
        sprite9_0 = this.stage.getSprite('9_to_0/9_to_0', 15, false);
        this.countSprites = [sprite0_1, sprite1_2, sprite2_3, sprite3_4, sprite4_5, sprite5_6, sprite6_7, sprite7_8, sprite8_9, sprite9_0];

        this.countStatics = [
            this.stage.getSubImage('numeral_0'),
            this.stage.getSubImage('numeral_1'),
            this.stage.getSubImage('numeral_2'),
            this.stage.getSubImage('numeral_3'),
            this.stage.getSubImage('numeral_4'),
            this.stage.getSubImage('numeral_5'),
            this.stage.getSubImage('numeral_6'),
            this.stage.getSubImage('numeral_7'),
            this.stage.getSubImage('numeral_8'),
            this.stage.getSubImage('numeral_9')
        ];
    }

    OdometerView.prototype.animateTransition = function (digitPosition, oldValue, newValue) {
        var self = this;

        var currentDrawable = this.countDrawables[digitPosition];
        var currentSprite = this.countSprites[oldValue];

        this.stage.animate(currentDrawable, currentSprite, function () {
            currentDrawable.img = self.countStatics[newValue];
        });
    };

    return OdometerView;
})();