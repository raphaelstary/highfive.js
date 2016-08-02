H5.ButtonFactory = (function (Math, Width) {
    "use strict";

    function ButtonFactory(stage, input, timer, font, playSoundCallback, primaryColor, primaryTextColor,
        primaryTextSize, primaryWidthFactor, secondaryColor, secondaryTextColor, secondaryTextSize,
        secondaryWidthFactor) {
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
    }

    ButtonFactory.prototype.createPrimaryButton = function (xFn, yFn, msg, callback, zIndex, multiSubmit, widthFn,
        heightFn, hitWidthFn, hitHeightFn) {
        function pressPrimaryButton(text, background) {
            background.alpha = 1;
        }

        function resetPrimaryButton(text, background) {
            background.alpha = 0.5;
        }

        return this.__createButton(xFn, yFn, msg, this.primaryTextSize, this.primaryColor, this.primaryTextColor, 1,
            callback, true, undefined, this.primaryWidthFactor, pressPrimaryButton, resetPrimaryButton, zIndex,
            multiSubmit, widthFn, heightFn, hitWidthFn, hitHeightFn);
    };

    ButtonFactory.prototype.createSecondaryButton = function (xFn, yFn, msg, callback, zIndex, multiSubmit, widthFn,
        heightFn, hitWidthFn, hitHeightFn) {

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
            }, this.secondaryWidthFactor, pressSecondaryButton, resetSecondaryButton, zIndex, multiSubmit, widthFn,
            heightFn, hitWidthFn, hitHeightFn);
    };

    ButtonFactory.prototype.__createButton = function (xFn, yFn, msg, txtSizeFn, color, textColor, textAlpha, callback,
        backgroundFilled, lineWidthFn, widthMultiplier, pressButton, resetButton, zIndex, multiSubmit, widthFn,
        heightFn, customHitWidthFn, customHitHeightFn) {

        var isMultiSubmitOn = multiSubmit !== undefined ? multiSubmit : false;

        var textDrawable = this.stage.createText(msg).setPosition(xFn,
            yFn).setSize(txtSizeFn).setFont(this.font).setColor(textColor).setZIndex(zIndex + 1).setAlpha(textAlpha);

        function getWidth(width) {
            var max = Width.get(10, 9)(width);
            var myWidth = textDrawable.getWidth() * widthMultiplier;
            return myWidth <= max ? myWidth : max;
        }

        function getHeight() {
            return Math.floor(textDrawable.getHeight() * 2.5);
        }

        var backgroundDrawable = this.stage.createRectangle(backgroundFilled).setPosition(xFn, yFn,
            [textDrawable]).setWidth(widthFn ? widthFn : getWidth).setHeight(heightFn ? heightFn :
                getHeight).setColor(color).setZIndex(zIndex).setAlpha(0.5);
        if (lineWidthFn)
            backgroundDrawable.setLineWidth(lineWidthFn);

        var touchable = this.stage.createRectangle().setPosition(xFn, yFn).setColor('black');
        if (customHitWidthFn) {
            touchable.setWidth(customHitWidthFn);
        } else if (widthFn) {
            touchable.setWidth(widthFn);
        } else {
            touchable.setWidth(getWidth);
        }
        if (customHitHeightFn) {
            touchable.setHeight(customHitHeightFn);
        } else if (heightFn) {
            touchable.setHeight(heightFn);
        } else {
            touchable.setHeight(getHeight);
        }
        touchable.hide();

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
        button.text.remove();
        button.background.remove();
        button.input.remove();
        this.input.remove(button.input);
    };

    return ButtonFactory;
})(Math, H5.Width);