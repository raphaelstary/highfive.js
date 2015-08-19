var NewStageAPI = (function (inheritMethods, changeCoords, wrap, Setter) {
    "use strict";

    function NewStageAPI(stage, gfx, positionResizer, sizeResizer, lengthResizer, heightResizer, maskResizer, width,
        height, timer) {

        this.stage = stage;
        this.gfx = gfx;

        this.positionResizer = positionResizer;
        this.sizeResizer = sizeResizer;
        this.widthResizer = lengthResizer;
        this.heightResizer = heightResizer;
        this.maskResizer = maskResizer;

        this.screen = {
            width: width,
            height: height
        };

        this.timer = timer;

        this.collisions = {};

        inheritMethods(stage, this, NewStageAPI.prototype);
    }

    /**
     * @param {string} imgName
     * @return {Drawable}
     */
    NewStageAPI.prototype.createImage = function (imgName) {
        return addServiceMethods(this.stage.drawFresh(wrap(0), wrap(0), imgName), this);
    };

    /**
     * @param {string} text
     * @return {Drawable}
     */
    NewStageAPI.prototype.createText = function (text) {
        var drawable = this.stage.drawText(wrap(0), wrap(0), text, wrap(60), 'Arial', 'black');
        return addTextServiceMethods(addServiceMethods(drawable, this), this);
    };

    /**
     * @param {boolean} [filled = false]
     * @return {Drawable}
     */
    NewStageAPI.prototype.createRectangle = function (filled) {
        var drawable = this.stage.drawRectangle(wrap(0), wrap(0), wrap(100), wrap(100), 'black', filled);
        return addRectangleServiceMethods(addServiceMethods(drawable, this), this);
    };

    function addServiceMethods(drawable, self) {
        drawable.setPosition = Setter.setPosition.bind(self.positionResizer, self.screen, drawable);
        drawable.setAlpha = Setter.setAlpha.bind(undefined, drawable);
        drawable.setRotation = Setter.setRotation.bind(undefined, drawable);
        drawable.setScale = Setter.setScale.bind(undefined, drawable);
        drawable.setZIndex = self.stage.changeZIndex.bind(self.stage, drawable);

        return drawable;
    }

    function addTextServiceMethods(drawable, self) {
        drawable.setText = Setter.setTextMessage.bind(undefined, drawable);
        drawable.setFont = Setter.setTextFont.bind(undefined, drawable);
        drawable.setColor = Setter.setColor.bind(undefined, drawable);
        drawable.setSize = Setter.setTextSize.bind(self.sizeResizer, self.screen, drawable);
        drawable.setMaxLineLength = Setter.setTextMaxLineLength.bind(self.widthResizer, self.screen, drawable);
        drawable.setLineHeight = Setter.setTextLineHeight.bind(self.heightResizer, self.screen, drawable);

        return drawable;
    }

    function addRectangleServiceMethods(drawable, self) {
        drawable.setColor = Setter.setColor.bind(undefined, drawable);
        drawable.setWidth = Setter.setWidth.bind(self.widthResizer, self.screen, drawable);
        drawable.setHeight = Setter.setHeight.bind(self.heightResizer, self.screen, drawable);
        drawable.setLineWidth = Setter.setLineWidth.bind(self.sizeResizer, self.screen, drawable);
        drawable.setFilled = Setter.setFilled.bind(undefined, drawable);

        return drawable;
    }

    return NewStageAPI;
})(inheritMethods, changeCoords, wrap, Setter);