H5.StageAPI = (function (Setter, iterateEntries, EntityServices) {
    'use strict';

    function StageAPI(stage, gfx, resizer, width, height, timer) {
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

    /**
     * creates a new image drawable
     *
     * @param imgName
     * @return Drawable
     */
    StageAPI.prototype.createImage = function (imgName) {
        return addImageServiceMethods(addServiceMethods(this.stage.drawFresh(0, 0, imgName), this), this);
    };

    /**
     * creates a new text drawable
     *
     * @param text
     * @return Drawable
     */
    StageAPI.prototype.createText = function (text) {
        var drawable = this.stage.drawText(0, 0, text, 60, 'Arial', 'black');
        return addTextServiceMethods(addServiceMethods(drawable, this), this);
    };

    /**
     * creates a new rectangle drawable
     *
     * @param filled default false
     * @return Drawable
     */
    StageAPI.prototype.createRectangle = function (filled) {
        var drawable = this.stage.drawRectangle(0, 0, 100, 100, 'black', filled);
        return addRectangleServiceMethods(addServiceMethods(drawable, this), this);
    };

    StageAPI.prototype.createQuadrilateral = function (filled) {
        var drawable = this.stage.drawQuadrilateral(0, 0, 0, 100, 100, 100, 100, 0, 'black', filled);
        return addQuadrilateralServiceMethods(drawable, this);
    };

    StageAPI.prototype.createABLine = function () {
        var drawable = this.stage.drawABLine(0, 0, 0, 100, 'black');
        return addABLineServiceMethods(drawable, this);
    };

    /**
     * creates a new circle drawable
     *
     * @param filled default false
     * @return Drawable
     */
    StageAPI.prototype.createCircle = function (filled) {
        var drawable = this.stage.drawCircle(0, 0, 100, 'black', filled);
        return addCircleServiceMethods(addServiceMethods(drawable, this), this);
    };

    /**
     * creates a new line drawable
     *
     * @return Drawable
     */
    StageAPI.prototype.createLine = function () {
        var drawable = this.stage.drawLine(0, 0, 100, 'black');
        return addLineServiceMethods(addServiceMethods(drawable, this), this);
    };

    /**
     * creates a new triangle drawable
     *
     * @param filled default false
     * @return Drawable
     */
    StageAPI.prototype.createEqTriangle = function (filled) {
        var drawable = this.stage.drawEqTriangle(0, 0, 0, 100, 'black', filled);
        return addEqTriangleServiceMethods(addServiceMethods(drawable, this), this);
    };

    StageAPI.prototype.createHexagon = function (filled) {
        var drawable = this.stage.drawHexagon(0, 0, 0, 100, 'black', filled);
        return addHexagonServiceMethods(addServiceMethods(drawable, this), this);
    };

    function addServiceMethods(drawable, self) {
        drawable.setPosition = Setter.setPosition.bind(undefined, self.resizer.add.bind(self.resizer, 'position'),
            self.screen, drawable);
        drawable.setAnchor = Setter.setAnchor.bind(undefined, self.resizer.add.bind(self.resizer, 'anchor'),
            self.screen, drawable);
        drawable.setAlpha = Setter.setAlpha.bind(undefined, drawable);
        drawable.setRotation = Setter.setRotation.bind(undefined, drawable);
        drawable.setScale = Setter.setScale.bind(undefined, drawable);
        drawable.setZIndex = self.stage.changeZIndex.bind(self.stage, drawable);
        drawable.setMask = Setter.setMask.bind(undefined, drawable);

        drawable.moveTo = EntityServices.moveTo.bind(undefined, self.stage, self.resizer, self.screen, drawable);
        drawable.moveFrom = EntityServices.moveFrom.bind(undefined, self.stage, self.resizer, self.screen, drawable);
        drawable.setShow = EntityServices.setShow.bind(undefined, drawable);
        drawable.addToStage = EntityServices.show.bind(undefined, self.stage, drawable);
        drawable.hide = EntityServices.hide.bind(undefined, self.stage, drawable);
        drawable.remove = EntityServices.remove.bind(EntityServices, self.stage, self.resizer, drawable);
        drawable.unmask = EntityServices.unmask.bind(EntityServices, self.stage, self.resizer, drawable);
        drawable.pause = EntityServices.pause.bind(undefined, self.stage, drawable);
        drawable.play = EntityServices.play.bind(undefined, self.stage, drawable);
        drawable.setCallback = function (callback, self) {
            // for sprite animations
            drawable.__callback = self ? callback.bind(self) : callback;
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
        drawable.setStyle = Setter.setTextStyle.bind(undefined, drawable);
        drawable.setColor = Setter.setColor.bind(undefined, drawable);
        drawable.setSize = Setter.setTextSize.bind(undefined, self.resizer.add.bind(self.resizer, 'size'), self.screen,
            drawable);
        drawable.setMaxLineLength = Setter.setTextMaxLineLength.bind(undefined,
            self.resizer.add.bind(self.resizer, 'lineLength'), self.screen, drawable);
        drawable.setLineHeight = Setter.setTextLineHeight.bind(undefined,
            self.resizer.add.bind(self.resizer, 'lineHeight'), self.screen, drawable);
        drawable.setBaseLine = Setter.setTextBaseLine.bind(undefined, drawable);
        drawable.setAlign = Setter.setTextAlign.bind(undefined, drawable);

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
        drawable.setLineDash = Setter.setLineDash.bind(undefined, self.resizer.add.bind(self.resizer, 'lineDash'),
            self.screen, drawable);
        drawable.setFilled = Setter.setFilled.bind(undefined, drawable);

        return drawable;
    }

    function addQuadrilateralServiceMethods(drawable, self) {
        // base stuff
        drawable.setAlpha = Setter.setAlpha.bind(undefined, drawable);
        drawable.setRotation = Setter.setRotation.bind(undefined, drawable);
        drawable.setScale = Setter.setScale.bind(undefined, drawable);
        drawable.setZIndex = self.stage.changeZIndex.bind(self.stage, drawable);
        drawable.setMask = Setter.setMask.bind(undefined, drawable);

        drawable.addToStage = EntityServices.show.bind(undefined, self.stage, drawable);
        drawable.removeFromStage = EntityServices.hide.bind(undefined, self.stage, drawable);
        drawable.remove = EntityServices.remove.bind(EntityServices, self.stage, self.resizer, drawable);
        drawable.unmask = EntityServices.unmask.bind(EntityServices, self.stage, self.resizer, drawable);
        drawable.pause = EntityServices.pause.bind(undefined, self.stage, drawable);
        drawable.play = EntityServices.play.bind(undefined, self.stage, drawable);

        drawable.rotateTo = EntityServices.rotateTo.bind(undefined, self.stage, drawable);
        drawable.rotationPattern = EntityServices.rotationPattern.bind(undefined, self.stage, drawable);
        drawable.scaleTo = EntityServices.scaleTo.bind(undefined, self.stage, drawable);
        drawable.scalePattern = EntityServices.scalePattern.bind(undefined, self.stage, drawable);
        drawable.opacityTo = EntityServices.opacityTo.bind(undefined, self.stage, drawable);
        drawable.opacityPattern = EntityServices.opacityPattern.bind(undefined, self.stage, drawable);

        // quad stuff
        drawable.setColor = Setter.setColor.bind(undefined, drawable);
        drawable.setLineWidth = Setter.setLineWidth.bind(undefined, self.resizer.add.bind(self.resizer, 'lineWidth'),
            self.screen, drawable);
        drawable.setFilled = Setter.setFilled.bind(undefined, drawable);
        drawable.setA = Setter.setQuadPosition.bind(undefined, self.resizer.add.bind(self.resizer, 'position_a'),
            self.screen, drawable, 'a');
        drawable.setB = Setter.setQuadPosition.bind(undefined, self.resizer.add.bind(self.resizer, 'position_b'),
            self.screen, drawable, 'b');
        drawable.setC = Setter.setQuadPosition.bind(undefined, self.resizer.add.bind(self.resizer, 'position_c'),
            self.screen, drawable, 'c');
        drawable.setD = Setter.setQuadPosition.bind(undefined, self.resizer.add.bind(self.resizer, 'position_d'),
            self.screen, drawable, 'd');

        drawable.moveATo = EntityServices.moveQuadTo.bind(undefined, self.stage, self.resizer, self.screen, drawable,
            'a');
        drawable.moveBTo = EntityServices.moveQuadTo.bind(undefined, self.stage, self.resizer, self.screen, drawable,
            'b');
        drawable.moveCTo = EntityServices.moveQuadTo.bind(undefined, self.stage, self.resizer, self.screen, drawable,
            'c');
        drawable.moveDTo = EntityServices.moveQuadTo.bind(undefined, self.stage, self.resizer, self.screen, drawable,
            'd');

        return drawable;
    }

    function addABLineServiceMethods(drawable, self) {
        // base stuff
        drawable.setAlpha = Setter.setAlpha.bind(undefined, drawable);
        drawable.setRotation = Setter.setRotation.bind(undefined, drawable);
        drawable.setScale = Setter.setScale.bind(undefined, drawable);
        drawable.setZIndex = self.stage.changeZIndex.bind(self.stage, drawable);
        drawable.setMask = Setter.setMask.bind(undefined, drawable);

        drawable.addToStage = EntityServices.show.bind(undefined, self.stage, drawable);
        drawable.removeFromStage = EntityServices.hide.bind(undefined, self.stage, drawable);
        drawable.remove = EntityServices.remove.bind(EntityServices, self.stage, self.resizer, drawable);
        drawable.unmask = EntityServices.unmask.bind(EntityServices, self.stage, self.resizer, drawable);
        drawable.pause = EntityServices.pause.bind(undefined, self.stage, drawable);
        drawable.play = EntityServices.play.bind(undefined, self.stage, drawable);

        drawable.rotateTo = EntityServices.rotateTo.bind(undefined, self.stage, drawable);
        drawable.rotationPattern = EntityServices.rotationPattern.bind(undefined, self.stage, drawable);
        drawable.scaleTo = EntityServices.scaleTo.bind(undefined, self.stage, drawable);
        drawable.scalePattern = EntityServices.scalePattern.bind(undefined, self.stage, drawable);
        drawable.opacityTo = EntityServices.opacityTo.bind(undefined, self.stage, drawable);
        drawable.opacityPattern = EntityServices.opacityPattern.bind(undefined, self.stage, drawable);

        // quad stuff
        drawable.setColor = Setter.setColor.bind(undefined, drawable);
        drawable.setLineWidth = Setter.setLineWidth.bind(undefined, self.resizer.add.bind(self.resizer, 'lineWidth'),
            self.screen, drawable);

        drawable.setA = Setter.setQuadPosition.bind(undefined, self.resizer.add.bind(self.resizer, 'position_a'),
            self.screen, drawable, 'a');
        drawable.setB = Setter.setQuadPosition.bind(undefined, self.resizer.add.bind(self.resizer, 'position_b'),
            self.screen, drawable, 'b');

        drawable.moveATo = EntityServices.moveQuadTo.bind(undefined, self.stage, self.resizer, self.screen, drawable,
            'a');
        drawable.moveBTo = EntityServices.moveQuadTo.bind(undefined, self.stage, self.resizer, self.screen, drawable,
            'b');

        return drawable;
    }

    function addLineServiceMethods(drawable, self) {
        drawable.setColor = Setter.setColor.bind(undefined, drawable);
        drawable.setLength = Setter.setLength.bind(undefined, self.resizer.add.bind(self.resizer, 'length'),
            self.screen, drawable);
        drawable.setLineWidth = Setter.setLineWidth.bind(undefined, self.resizer.add.bind(self.resizer, 'lineWidth'),
            self.screen, drawable);

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

    function addHexagonServiceMethods(drawable, self) {
        drawable.setColor = Setter.setColor.bind(undefined, drawable);
        drawable.setLineWidth = Setter.setLineWidth.bind(undefined, self.resizer.add.bind(self.resizer, 'lineWidth'),
            self.screen, drawable);
        drawable.setFilled = Setter.setFilled.bind(undefined, drawable);
        drawable.setRadius = Setter.setRadius.bind(undefined, self.resizer.add.bind(self.resizer, 'radius'),
            self.screen, drawable);
        drawable.setAngle = Setter.setAngle.bind(undefined, drawable);

        return drawable;
    }

    StageAPI.prototype.clear = function () {
        this.stage.clear();
    };

    StageAPI.prototype.updateMove = function () {
        this.timer.update();
        this.stage.updateMove();
    };

    StageAPI.prototype.updateDraw = function () {
        this.stage.updateDraw();
    };

    StageAPI.prototype.resize = function (event) {
        this.screen.width = event.width;
        this.screen.height = event.height;
        if (this.gfx && this.gfx.resize) {
            this.gfx.resize(event);
        }
        this.stage.resize(event);
        this.resizer.call(event.width, event.height);
        iterateEntries(this.collisions, function (detector) {
            detector.resize(event);
        });
    };

    StageAPI.prototype.getGraphic = function (imgPathName) {
        return this.stage.getGraphic(imgPathName);
    };

    StageAPI.prototype.playAll = function () {
        this.stage.playAll();
    };

    StageAPI.prototype.pauseAll = function () {
        this.stage.pauseAll();
    };

    StageAPI.prototype.audioVolumeTo = function (audio, volume) {
        return EntityServices.volumeTo(this.stage, audio, volume);
    };

    return StageAPI;
})(H5.Setter, H5.iterateEntries, H5.EntityServices);