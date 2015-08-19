var NewStageAPI = (function (inheritMethods, changeCoords, wrap, Setter, iterateEntries) {
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

    /**
     * @param {boolean} [filled = false]
     * @return {Drawable}
     */
    NewStageAPI.prototype.createCircle = function (filled) {
        var drawable = this.stage.drawCircle(wrap(0), wrap(0), wrap(100), 'black', filled);
        return addCircleServiceMethods(addServiceMethods(drawable, this), this);
    };

    /**
     * @param {boolean} [filled = false]
     * @return {Drawable}
     */
    NewStageAPI.prototype.drawEqTriangle = function (filled) {
        var drawable = this.stage.drawEqTriangle(wrap(0), wrap(0), 0, wrap(100), 'black', filled);
        return addEqTriangleServiceMethods(addServiceMethods(drawable, this), this);
    };

    //NewStageAPI.prototype.move = function (drawable) {
    //    // todo implement
    //};
    //
    //NewStageAPI.prototype.moveCircular = function (drawable) {
    //    // todo implement
    //};
    //
    //NewStageAPI.prototype.moveRoundTrip = function (drawable) {
    //    //todo implement
    //};
    //
    //NewStageAPI.prototype.moveLater = function (drawable) {
    //    // todo implement
    //};
    //
    //NewStageAPI.prototype.mask = function (drawable) {
    //    // todo implement
    //};
    //
    //NewStageAPI.prototype.unmask = function (drawable) {
    //    // todo implement
    //};

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

    function addCircleServiceMethods(drawable, self) {
        drawable.setColor = Setter.setColor.bind(undefined, drawable);
        drawable.setLineWidth = Setter.setLineWidth.bind(self.sizeResizer, self.screen, drawable);
        drawable.setFilled = Setter.setFilled.bind(undefined, drawable);
        drawable.setRadius = Setter.setRadius.bind(self.widthResizer, self.screen, drawable);

        return drawable;
    }

    function addEqTriangleServiceMethods(drawable, self) {
        drawable.setColor = Setter.setColor.bind(undefined, drawable);
        drawable.setLineWidth = Setter.setLineWidth.bind(self.sizeResizer, self.screen, drawable);
        drawable.setFilled = Setter.setFilled.bind(undefined, drawable);
        drawable.setRadius = Setter.setRadius.bind(self.widthResizer, self.screen, drawable);
        drawable.setAngle = Setter.setAngle.bind(undefined, drawable);

        return drawable;
    }

    NewStageAPI.prototype.remove = function (drawable) {
        // todo 10000 removes
        this.stage.remove(drawable);
    };

    NewStageAPI.prototype.show = function (drawable) {
        this.stage.draw(drawable);
    };

    NewStageAPI.prototype.hide = function (drawable) {
        this.stage.remove(drawable);
    };

    NewStageAPI.prototype.has = function (drawable) {
        // todo 10000 has checks
        return this.stage.has(drawable);
    };

    NewStageAPI.prototype.update = function () {
        this.timer.update();
        this.stage.update();
    };

    NewStageAPI.prototype.resize = function (event) {
        this.screen.width = event.width;
        this.screen.height = event.height;
        if (this.gfx && this.gfx.resize)
            this.gfx.resize(event);
        this.stage.resize(event);

        // todo 1000 resizer update calls like: this.resizer.call(event.width, event.height);

        iterateEntries(this.collisions, function (detector) {
            detector.resize(event);
        });
    };

    return NewStageAPI;
})(inheritMethods, changeCoords, wrap, Setter, iterateEntries);