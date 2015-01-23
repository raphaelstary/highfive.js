var ButtonFactory = (function () {
    "use strict";

    function ButtonFactory(stage, input, timer, font, playSoundCallback, primaryColor, primaryTextColor,
        primaryTextSize, primaryWidthFactor, secondaryColor, secondaryTextColor, secondaryTextSize,
        secondaryWidthFactor, zIndex) {
        this.stage = stage;
        this.input = input;
        this.font = font;
        this.playSound = playSoundCallback;
        this.timer = timer;
        this.primaryColor = primaryColor;
        this.primaryTextColor = primaryTextColor;
        this.primaryTextSize = primaryTextSize;
        this.primaryWidthFactor = primaryWidthFactor;
        this.secondaryColor = secondaryColor;
        this.secondaryTextColor = secondaryTextColor;
        this.secondaryTextSize = secondaryTextSize;
        this.secondaryWidthFactor = secondaryWidthFactor;
        this.zIndex = zIndex;
    }

    ButtonFactory.prototype.createPrimaryButton = function (xFn, yFn, msg, callback, multiSubmit) {
        function pressPrimaryButton(text, background) {
            background.alpha = 1;
        }

        function resetPrimaryButton(text, background) {
            background.alpha = 0.5;
        }

        return this.__createButton(xFn, yFn, msg, this.primaryTextSize, this.primaryColor, this.primaryTextColor, 1,
            callback, true, undefined, this.primaryWidthFactor, pressPrimaryButton, resetPrimaryButton, multiSubmit);
    };

    ButtonFactory.prototype.createSecondaryButton = function (xFn, yFn, msg, callback, multiSubmit) {
        function pressSecondaryButton(text, background) {
            text.alpha = 1;
            background.data.filled = true;
        }

        function resetSecondaryButton(text, background) {
            text.alpha = 0.5;
            background.data.filled = false;
        }

        return this.__createButton(xFn, yFn, msg, this.secondaryTextSize, this.secondaryColor, this.secondaryTextColor,
            0.5, callback, false, function () {
                return 1;
            }, this.secondaryWidthFactor, pressSecondaryButton, resetSecondaryButton, multiSubmit);
    };

    ButtonFactory.prototype.__createButton = function (xFn, yFn, msg, txtSizeFn, color, textColor, textAlpha, callback,
        backgroundFilled, lineWidthFn, widthMultiplier, pressButton, resetButton, multiSubmit) {

        var isMultiSubmitOn = multiSubmit !== undefined ? multiSubmit : false;

        var textDrawable = this.stage.drawText(xFn, yFn, msg, txtSizeFn, this.font, textColor, this.zIndex + 1,
            undefined, undefined,
            textAlpha);

        function getWidth() {
            return textDrawable.getWidth() * widthMultiplier;
        }

        function getHeight() {
            return textDrawable.getHeight() * 2;
        }

        var backgroundWrapper = this.stage.drawRectangleWithInput(xFn, yFn, getWidth, getHeight, color,
            backgroundFilled, lineWidthFn, this.zIndex, 0.5, undefined, undefined, [textDrawable]);

        var touchable = backgroundWrapper.input;
        var backgroundDrawable = backgroundWrapper.drawable;

        var returnObject = {
            text: textDrawable,
            background: backgroundDrawable,
            input: touchable,
            used: false,
            reset: true
        };

        var self = this;
        var extendedCallback = function () {
            if (!isMultiSubmitOn && returnObject.used)
                return;

            returnObject.used = true;
            pressButton(textDrawable, backgroundDrawable);

            self.playSound();

            if (returnObject.reset)
                self.timer.doLater(resetButton.bind(undefined, textDrawable, backgroundDrawable), 30);

            callback();
        };

        this.input.add(touchable, extendedCallback);

        return returnObject;
    };

    ButtonFactory.prototype.enable = function (button) {
        this.input.enable(button.input);
    };

    ButtonFactory.prototype.disable = function (button) {
        this.input.disable(button.input);
    };

    ButtonFactory.prototype.enableAll = function () {
        this.input.enableAll();
    };

    ButtonFactory.prototype.disableAll = function () {
        this.input.disableAll();
    };

    ButtonFactory.prototype.remove = function (button) {
        this.stage.remove(button.text);
        this.stage.remove(button.background);
        this.input.remove(button.input);
    };

    return ButtonFactory;
})();
