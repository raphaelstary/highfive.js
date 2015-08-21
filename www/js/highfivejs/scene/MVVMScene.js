var MVVMScene = (function (iterateEntries, Width, Height) {
    "use strict";

    function MVVMScene(model, view, viewModel) {
        this.services = model;

        this.stage = model.stage;
        this.newStage = model.newStage;
        this.sceneStorage = model.sceneStorage;
        this.buttons = model.buttons;
        this.messages = model.messages;
        this.timer = model.timer;
        this.device = model.device;
        this.loop = model.loop;
        this.events = model.events;
        this.tap = model.tap;
        this.sounds = model.sounds;

        this.view = view;
        this.viewModel = viewModel;
    }

    MVVMScene.prototype.show = function (next) {
        var drawables = [];
        var buttons = [];
        var taps = [];

        var sceneRect;

        function xFn(x) {
            return Width.get(sceneRect.width, x);
        }

        function yFn(y) {
            return Height.get(sceneRect.height, y);
        }

        iterateEntries(this.view, function (layers, layerKey) {
            if (layerKey == 'screen') {
                sceneRect = layers;
                return;
            }

            layers.forEach(function (elem) {

                var x = xFn(elem.x);
                var y = yFn(elem.y);

                if (elem.tags && elem.tags.some(function (tag) {
                        return tag.position == 'relativeToSize';
                    }) && elem.tags.some(function (tag) {
                        return tag.anchor == 'widthHalf';
                    })) {
                    // very specific use case

                    x = function (width, height) {
                        return Math.floor(width / 2 +
                            ((elem.x - sceneRect.width / 2) / elem.height) * yFn(elem.height)(height));
                    };

                }

                var drawable;
                if (elem.type == 'image') {
                    var imgName = elem.filename.substring(0, elem.filename.lastIndexOf('.'));
                    drawable = this.stage.drawFresh(x, y, imgName, elem.zIndex, undefined, elem.alpha, elem.rotation,
                        elem.scale);

                    drawable = this.newStage.createImage(imgName).setPosition(x,
                        y).setAlpha(elem.alpha).setRotation(elem.rotation).setScale(elem.scale);
                    if (elem.zIndex != 3)
                        drawable.setZIndex(elem.zIndex);

                    drawables.push(drawable);
                    if (elem.viewId) {
                        this.viewModel[elem.viewId] = drawable;
                    }

                } else if (elem.type == 'text') {
                    drawable = this.stage.drawText(x, y, elem.msg, yFn(elem.size), elem.font, elem.color, elem.zIndex,
                        undefined, elem.rotation, elem.alpha, undefined, undefined, elem.scale);

                    //drawable =
                    // this.newStage.createText(elem.msg).setSize(yFn(elem.size)).setFont(elem.font).setColor(elem.color).setRotation(elem.rotation).setAlpha(elem.alpha).setScale(elem.scale);
                    // if (elem.zIndex != 3) drawable.setZIndex(elem.zIndex);

                    drawables.push(drawable);
                    if (elem.viewId) {
                        this.viewModel[elem.viewId] = drawable;
                    }

                } else if (elem.type == 'rectangle') {
                    var isInput = elem.tags.some(function (tag) {
                        return tag == 'input';
                    });
                    if (isInput) {
                        var fnName;
                        elem.tags.some(function (tag) {
                            var foundSmth = tag.tap !== undefined;
                            if (foundSmth)
                                fnName = tag.tap;
                            return foundSmth;
                        });
                        var wrapper = this.stage.drawRectangleWithInput(x, y, xFn(elem.width), yFn(elem.height),
                            '#fff');
                        this.tap.add(wrapper.input, this.viewModel[fnName].bind(this.viewModel));

                        this.stage.hide(wrapper.drawable); //todo: clean up this mess and stop this drawable/input shit
                        drawables.push(wrapper.drawable);
                        taps.push(wrapper.input);

                    } else {
                        drawable = this.stage.drawRectangle(x, y, xFn(elem.width), yFn(elem.height), elem.color,
                            elem.filled, undefined, elem.zIndex, elem.alpha, elem.rotation, elem.scale, undefined);
                        drawables.push(drawable);

                        if (elem.viewId) {
                            this.viewModel[elem.viewId] = drawable;
                        }
                    }

                } else if (elem.type == 'button') {
                    //x = xFn(elem.text.x);
                    //y = yFn(elem.text.y);

                    //var callbackFnName;
                    //elem.input.tags.some(function (tag) {
                    //    var foundSmth = tag.tap !== undefined;
                    //    if (foundSmth)
                    //        callbackFnName = tag.tap;
                    //    return foundSmth;
                    //});

                    //drawable = this.buttons.createPrimaryButton(x, y, elem.text.msg,
                    //    this.viewModel[callbackFnName].bind(this.viewModel), elem.zIndex, false,
                    // xFn(elem.background.width), yFn(elem.background.height)); //todo: rethink this shit with buttons
                    //   buttons.push(drawable);  if (elem.viewId) {  this.viewModel[elem.viewId] = drawable;  }

                    var btnFnName;
                    elem.input.tags.some(function (tag) {
                        var foundSmth = tag.tap !== undefined;
                        if (foundSmth)
                            btnFnName = tag.tap;
                        return foundSmth;
                    });
                    var inputWrapper = this.stage.drawRectangleWithInput(xFn(elem.input.x), yFn(elem.input.y),
                        xFn(elem.input.width), yFn(elem.input.height), '#fff');
                    this.tap.add(inputWrapper.input, this.viewModel[btnFnName].bind(this.viewModel));

                    this.stage.hide(inputWrapper.drawable); //todo: clean up this mess and stop this drawable/input shit
                    drawables.push(inputWrapper.drawable);
                    taps.push(inputWrapper.input);

                    drawable = this.stage.drawText(xFn(elem.text.x), yFn(elem.text.y), elem.text.msg,
                        yFn(elem.text.size), elem.text.font, elem.text.color, elem.zIndex + 1, undefined,
                        elem.text.rotation, elem.text.alpha, undefined, undefined, elem.text.scale);
                    drawables.push(drawable);

                    if (elem.background.type == 'image') {
                        var bgName = elem.background.filename.substring(0, elem.background.filename.lastIndexOf('.'));
                        drawable = this.stage.drawFresh(xFn(elem.background.x), yFn(elem.background.y), bgName,
                            elem.zIndex, undefined, elem.background.alpha, elem.background.rotation,
                            elem.background.scale);
                        drawables.push(drawable);

                    } else if (elem.background.type == 'rectangle') {
                        drawable = this.stage.drawRectangle(xFn(elem.background.x), yFn(elem.background.y),
                            xFn(elem.background.width), yFn(elem.background.height), elem.background.color,
                            elem.background.filled, undefined, elem.zIndex, elem.background.alpha,
                            elem.background.rotation, elem.background.scale, undefined);
                        drawables.push(drawable);
                    }

                }

                if (elem.animations) {
                    var animations = elem.animations;
                    if (animations.transform) {
                        animations.transform.forEach(function (frame) {

                        });
                    }
                }

            }, this);
        }, this);

        if (this.viewModel.postConstruct)
            this.viewModel.postConstruct();

        var self = this;

        function nextScene() {
            if (self.viewModel.preDestroy)
                self.viewModel.preDestroy();

            drawables.forEach(self.stage.remove.bind(self.stage));
            buttons.forEach(self.buttons.remove.bind(self.buttons));
            taps.forEach(self.tap.remove.bind(self.tap));

            next();
        }

        this.viewModel.nextScene = nextScene;
    };

    return MVVMScene;
})(iterateEntries, Width, Height);