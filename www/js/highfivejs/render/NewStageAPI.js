var NewStageAPI = (function (changeCoords, wrap, Setter, iterateEntries, EntityServices) {
    "use strict";

    function NewStageAPI(stage, gfx, resizer, width, height, timer) {
        this.stage = stage;
        this.gfx = gfx;
        this.resizer = resizer;
        this.screen = {
            width: width,
            height: height
        };
        this.timer = timer;
        this.collisions = {};
    }

    NewStageAPI.prototype.createImage = function (imgName) {
        return addImageServiceMethods(addServiceMethods(this.stage.drawFresh(wrap(0), wrap(0), imgName), this), this);
    };

    NewStageAPI.prototype.createText = function (text) {
        var drawable = this.stage.drawText(wrap(0), wrap(0), text, wrap(60), 'Arial', 'black');
        return addTextServiceMethods(addServiceMethods(drawable, this), this);
    };

    NewStageAPI.prototype.createRectangle = function (filled) {
        var drawable = this.stage.drawRectangle(wrap(0), wrap(0), wrap(100), wrap(100), 'black', filled);
        return addRectangleServiceMethods(addServiceMethods(drawable, this), this);
    };

    NewStageAPI.prototype.createCircle = function (filled) {
        var drawable = this.stage.drawCircle(wrap(0), wrap(0), wrap(100), 'black', filled);
        return addCircleServiceMethods(addServiceMethods(drawable, this), this);
    };

    NewStageAPI.prototype.createEqTriangle = function (filled) {
        var drawable = this.stage.drawEqTriangle(wrap(0), wrap(0), 0, wrap(100), 'black', filled);
        return addEqTriangleServiceMethods(addServiceMethods(drawable, this), this);
    };

    function addServiceMethods(drawable, self) {
        drawable.setPosition = Setter.setPosition.bind(undefined, self.resizer.add.bind(self.resizer, 'position'),
            self.screen, drawable);
        drawable.setAlpha = Setter.setAlpha.bind(undefined, drawable);
        drawable.setRotation = Setter.setRotation.bind(undefined, drawable);
        drawable.setScale = Setter.setScale.bind(undefined, drawable);
        drawable.setZIndex = self.stage.changeZIndex.bind(self.stage, drawable);

        drawable.moveTo = EntityServices.moveTo.bind(undefined, self.stage, self.resizer, self.screen, drawable);
        drawable.show = EntityServices.show.bind(undefined, self.stage, drawable);
        drawable.hide = EntityServices.hide.bind(undefined, self.stage, drawable);
        drawable.remove = EntityServices.remove.bind(undefined, self.stage, self.resizer, drawable);
        drawable.pause = EntityServices.pause.bind(undefined, self.stage, drawable);
        drawable.play = EntityServices.play.bind(undefined, self.stage, drawable);
        drawable.setCallback = function (callback) {
            // for sprite animations
            drawable.__callback = callback;
            return drawable;
        };
        drawable.animate = EntityServices.sprite.bind(undefined, self.stage, drawable);
        drawable.rotateTo = EntityServices.rotateTo.bind(undefined, self.stage, drawable);
        drawable.rotationPattern = EntityServices.rotationPattern.bind(undefined, self.stage, drawable);
        drawable.scaleTo = EntityServices.scaleTo.bind(undefined, self.stage, drawable);
        drawable.scalePattern = EntityServices.scalePattern.bind(undefined, self.stage, drawable);
        drawable.opacityTo = EntityServices.opacityTo.bind(undefined, self.stage, drawable);
        drawable.opacityPattern = EntityServices.opacityPattern.bind(undefined, self.stage, drawable);

        return drawable;
    }

    function addImageServiceMethods(drawable, self) {
        drawable.setGraphic = Setter.setGraphic.bind(undefined, self.stage, drawable);
        return drawable;
    }

    function addTextServiceMethods(drawable, self) {
        drawable.setText = Setter.setTextMessage.bind(undefined, drawable);
        drawable.setFont = Setter.setTextFont.bind(undefined, drawable);
        drawable.setColor = Setter.setColor.bind(undefined, drawable);
        drawable.setSize = Setter.setTextSize.bind(undefined, self.resizer.add.bind(self.resizer, 'size'), self.screen,
            drawable);
        drawable.setMaxLineLength = Setter.setTextMaxLineLength.bind(undefined,
            self.resizer.add.bind(self.resizer, 'lineLength'), self.screen, drawable);
        drawable.setLineHeight = Setter.setTextLineHeight.bind(undefined,
            self.resizer.add.bind(self.resizer, 'lineHeight'), self.screen, drawable);

        return drawable;
    }

    function addRectangleServiceMethods(drawable, self) {
        drawable.setColor = Setter.setColor.bind(undefined, drawable);
        drawable.setWidth = Setter.setWidth.bind(undefined, self.resizer.add.bind(self.resizer, 'width'), self.screen,
            drawable);
        drawable.setHeight = Setter.setHeight.bind(undefined, self.resizer.add.bind(self.resizer, 'height'),
            self.screen, drawable);
        drawable.setLineWidth = Setter.setLineWidth.bind(undefined, self.resizer.add.bind(self.resizer, 'lineWidth'),
            self.screen, drawable);
        drawable.setFilled = Setter.setFilled.bind(undefined, drawable);

        return drawable;
    }

    function addCircleServiceMethods(drawable, self) {
        drawable.setColor = Setter.setColor.bind(undefined, drawable);
        drawable.setLineWidth = Setter.setLineWidth.bind(undefined, self.resizer.add.bind(self.resizer, 'lineWidth'),
            self.screen, drawable);
        drawable.setFilled = Setter.setFilled.bind(undefined, drawable);
        drawable.setRadius = Setter.setRadius.bind(undefined, self.resizer.add.bind(self.resizer, 'radius'),
            self.screen, drawable);

        return drawable;
    }

    function addEqTriangleServiceMethods(drawable, self) {
        drawable.setColor = Setter.setColor.bind(undefined, drawable);
        drawable.setLineWidth = Setter.setLineWidth.bind(undefined, self.resizer.add.bind(self.resizer, 'lineWidth'),
            self.screen, drawable);
        drawable.setFilled = Setter.setFilled.bind(undefined, drawable);
        drawable.setRadius = Setter.setRadius.bind(undefined, self.resizer.add.bind(self.resizer, 'radius'),
            self.screen, drawable);
        drawable.setAngle = Setter.setAngle.bind(undefined, drawable);

        return drawable;
    }

    NewStageAPI.prototype.clear = function () {
        this.stage.clear();
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
        this.resizer.call(event.width, event.height);
        iterateEntries(this.collisions, function (detector) {
            detector.resize(event);
        });
    };

    return NewStageAPI;
})(changeCoords, wrap, Setter, iterateEntries, EntityServices);