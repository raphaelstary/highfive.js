var ButtonFactory = (function () {
    "use strict";

    function ButtonFactory(stage, input, timer, font, playSoundCallback, primaryColor, primaryTextColor, secondaryColor,
        secondaryTextColor) {
        this.stage = stage;
        this.input = input;
        this.font = font;
        this.playSound = playSoundCallback;
        this.timer = timer;
        this.primaryColor = primaryColor;
        this.primaryTextColor = primaryTextColor;
        this.secondaryColor = secondaryColor;
        this.secondaryTextColor = secondaryTextColor;
    }

    ButtonFactory.prototype.createPrimaryButton = function (xFn, yFn, msg, txtSizeFn, callback) {
        function pressPrimaryButton(text, background) {
            background.alpha = 1;
        }

        function resetPrimaryButton(text, background) {
            background.alpha = 0.5;
        }

        return this.__createButton(xFn, yFn, msg, txtSizeFn, this.primaryColor, this.primaryTextColor, 1, callback,
            true, pressPrimaryButton, resetPrimaryButton);
    };

    ButtonFactory.prototype.createSecondaryButton = function (xFn, yFn, msg, txtSizeFn, callback) {
        function pressSecondaryButton(text, background) {
            text.alpha = 1;
            background.data.filled = true;
        }

        function resetSecondaryButton(text, background) {
            text.alpha = 0.5;
            background.data.filled = false;
        }

        return this.__createButton(xFn, yFn, msg, txtSizeFn, this.secondaryColor, this.secondaryTextColor, 0.5,
            callback, false, pressSecondaryButton, resetSecondaryButton);
    };

    ButtonFactory.prototype.__createButton = function (xFn, yFn, msg, txtSizeFn, color, textColor, textAlpha, callback,
        backgroundFilled, pressButton, resetButton) {

        var textDrawable = this.stage.drawText(xFn, yFn, msg, txtSizeFn, this.font, textColor, 3, undefined, undefined,
            textAlpha);

        function getWidth() {
            return textDrawable.getWidth() * 3;
        }

        function getHeight() {
            return textDrawable.getHeight() * 2;
        }

        var backgroundWrapper = this.stage.drawRectangleWithInput(xFn, yFn, getWidth, getHeight, color,
            backgroundFilled, undefined, 2, 0.5, undefined, undefined, [textDrawable]);

        var touchable = backgroundWrapper.input;
        var backgroundDrawable = backgroundWrapper.drawable;

        var self = this;
        var extendedCallback = function () {
            pressButton(textDrawable, backgroundDrawable);

            self.playSound();

            self.timer.doLater(resetButton.bind(undefined, textDrawable, backgroundDrawable), 30);

            callback();
        };

        this.input.add(touchable, extendedCallback);

        return {
            text: textDrawable,
            background: backgroundDrawable,
            input: touchable
        };
    };

    return ButtonFactory;
})();
