var OdometerView = (function () {
    "use strict";

    function OdometerView(stage, countDrawables) {
        this.stage = stage;
        this.countDrawables = countDrawables;

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