var MVVMScene = (function (iterateEntries, Width, Height, Event, Math) {
    "use strict";

    function MVVMScene(model, view, viewModel) {
        this.services = model;

        this.stage = model.newStage;
        this.sceneStorage = model.sceneStorage;
        this.messages = model.messages;
        this.timer = model.timer;
        this.device = model.device;
        this.loop = model.loop;
        this.events = model.events;
        this.sounds = model.sounds;

        this.view = view;
        this.viewModel = viewModel;
    }

    MVVMScene.prototype.show = function (next) {
        var self = this;
        var drawables = [];
        var taps = [];

        function isHit(pointer, drawable) {
            return pointer.x > drawable.getCornerX() && pointer.x < drawable.getEndX() &&
                pointer.y > drawable.getCornerY() && pointer.y < drawable.getEndY();
        }

        var tapListenerId = this.events.subscribe(Event.POINTER, function (pointer) {
            if (pointer.type == 'up') {
                taps.some(function (tap) {
                    if (isHit(pointer, tap.rectangle)) {
                        if (tap.up)
                            tap.up();
                        return true;
                    }
                    return false;
                });
            } else if (pointer.type == 'down') {
                taps.some(function (tap) {
                    if (isHit(pointer, tap.rectangle)) {
                        if (tap.down)
                            tap.down();
                        return true;
                    }
                    return false;
                });
            }
        });

        var sceneRect;

        function xFn(x) {
            return Width.get(sceneRect.width, x);
        }

        function yFn(y) {
            return Height.get(sceneRect.height, y);
        }

        function txtSize(size) {
            return function (width, height) {
                return calcScreenConst(height, sceneRect.height, size);
            };
        }

        function hasPositionTag_relativeToSize(tags) {
            return tags.some(function (tag) {
                return tag.position == 'relativeToSize';
            });
        }

        function hasAnchorTag_widthHalf(tags) {
            return tags.some(function (tag) {
                return tag.anchor == 'widthHalf';
            });
        }

        function getXPositionRelativeToSize_anchorWithHalf(sceneRect, relativeToSize_elemHeight, x) {
            return function (width, height) {
                return Math.floor(width / 2 +
                    ((x - sceneRect.width / 2) / relativeToSize_elemHeight) * yFn(relativeToSize_elemHeight)(height));
            };
        }

        iterateEntries(this.view, function (layers, layerKey) {
            if (layerKey == 'screen') {
                sceneRect = layers;
                return;
            }

            layers.forEach(function (elem) {

                var x = xFn(elem.x);
                var y = yFn(elem.y);

                var isRelativeToSize_widthHalf = elem.tags && hasPositionTag_relativeToSize(elem.tags) &&
                    hasAnchorTag_widthHalf(elem.tags);
                if (isRelativeToSize_widthHalf) {
                    // very specific use case
                    x = getXPositionRelativeToSize_anchorWithHalf(sceneRect, elem.height, elem.x);
                }

                var drawable;
                if (elem.type == 'image') {
                    var imgName = elem.filename.substring(0, elem.filename.lastIndexOf('.'));

                    drawable = this.stage.createImage(imgName).setPosition(x,
                        y).setAlpha(elem.alpha).setRotation(elem.rotation).setScale(elem.scale);
                    if (elem.zIndex != 3)
                        drawable.setZIndex(elem.zIndex);

                    drawables.push(drawable);
                    if (elem.viewId) {
                        this.viewModel[elem.viewId] = drawable;
                    }

                } else if (elem.type == 'text') {

                    drawable = this.stage.createText(elem.msg).setPosition(x,
                        y).setSize(txtSize(elem.size)).setFont(elem.font).setColor(elem.color).setRotation(elem.rotation).setAlpha(elem.alpha).setScale(elem.scale);
                    if (elem.zIndex != 3)
                        drawable.setZIndex(elem.zIndex);

                    drawables.push(drawable);
                    if (elem.viewId) {
                        this.viewModel[elem.viewId] = drawable;
                    }

                } else if (elem.type == 'rectangle') {
                    var isInput = elem.tags.some(function (tag) {
                        return tag == 'input';
                    });
                    if (isInput) {
                        var pointerUpFnName;
                        var hasUp = elem.tags.some(function (tag) {
                            var foundSmth = tag.up !== undefined;
                            if (foundSmth)
                                pointerUpFnName = tag.up;
                            return foundSmth;
                        });

                        var pointerDownFnName;
                        var hasDown = elem.tags.some(function (tag) {
                            var foundSmth = tag.down !== undefined;
                            if (foundSmth)
                                pointerDownFnName = tag.down;
                            return foundSmth;
                        });

                        var resetFnName;
                        var hasReset = elem.tags.some(function (tag) {
                            var foundSmth = tag.reset !== undefined;
                            if (foundSmth)
                                resetFnName = tag.reset;
                            return foundSmth;
                        });

                        drawable = this.stage.createRectangle().setPosition(x,
                            y).setWidth(xFn(elem.width)).setHeight(yFn(elem.height)).setColor('#fff');
                        drawable.hide();

                        drawables.push(drawable);
                        var tap = {
                            rectangle: drawable
                        };
                        if (hasDown) {
                            tap.down = this.viewModel[pointerDownFnName].bind(this.viewModel);
                        }
                        if (hasUp) {
                            tap.up = this.viewModel[pointerUpFnName].bind(this.viewModel);
                        }
                        if (hasReset) {
                            tap.reset = this.viewModel[resetFnName].bind(this.viewModel);
                        }
                        taps.push(tap);

                    } else {

                        drawable = this.stage.createRectangle(elem.filled).setPosition(x,
                            y).setWidth(xFn(elem.width)).setHeight(yFn(elem.height)).setColor(elem.color).setAlpha(elem.alpha).setRotation(elem.rotation).setScale(elem.scale);
                        if (elem.zIndex != 3)
                            drawable.setZIndex(elem.zIndex);

                        drawables.push(drawable);

                        if (elem.viewId) {
                            this.viewModel[elem.viewId] = drawable;
                        }
                    }

                } else if (elem.type == 'button') {

                    var btnUpFnName;
                    var hasBtnUp = elem.input.tags.some(function (tag) {
                        var foundSmth = tag.up !== undefined;
                        if (foundSmth)
                            btnUpFnName = tag.up;
                        return foundSmth;
                    });
                    var btnDownFnName;
                    var hasBtnDown = elem.input.tags.some(function (tag) {
                        var foundSmth = tag.down !== undefined;
                        if (foundSmth)
                            btnDownFnName = tag.down;
                        return foundSmth;
                    });
                    var btnResetFnName;
                    var hasBtnReset = elem.input.tags.some(function (tag) {
                        var foundSmth = tag.reset !== undefined;
                        if (foundSmth)
                            btnResetFnName = tag.reset;
                        return foundSmth;
                    });

                    drawable = this.stage.createRectangle().setPosition(xFn(elem.input.x),
                        yFn(elem.input.y)).setWidth(xFn(elem.input.width)).setHeight(yFn(elem.input.height)).setColor('#fff');
                    drawable.hide();
                    taps.push({
                        rectangle: drawable,
                        up: hasBtnUp ? this.viewModel[btnUpFnName].bind(this.viewModel) : undefined,
                        down: hasBtnDown ? this.viewModel[btnDownFnName].bind(this.viewModel) : undefined,
                        reset: hasBtnReset ? this.viewModel[btnResetFnName].bind(this.viewModel) : undefined
                    });
                    drawables.push(drawable);

                    drawable = this.stage.createText(elem.text.msg).setPosition(xFn(elem.text.x),
                        yFn(elem.text.y)).setSize(txtSize(elem.text.size)).setFont(elem.text.font).setColor(elem.text.color).setRotation(elem.text.rotation).setAlpha(elem.text.alpha).setScale(elem.text.scale);
                    if (elem.zIndex + 1 != 3)
                        drawable.setZIndex(elem.zIndex + 1);
                    drawables.push(drawable);

                    if (elem.background.type == 'image') {
                        var bgName = elem.background.filename.substring(0, elem.background.filename.lastIndexOf('.'));
                        drawable = this.stage.createImage(bgName).setPosition(xFn(elem.background.x),
                            yFn(elem.background.y)).setAlpha(elem.background.alpha).setRotation(elem.background.rotation).setScale(elem.background.scale);
                        if (elem.zIndex != 3)
                            drawable.setZIndex(elem.zIndex);
                        drawables.push(drawable);

                    } else if (elem.background.type == 'rectangle') {
                        drawable = this.stage.createRectangle(elem.background.filled).setPosition(xFn(elem.background.x),
                            yFn(elem.background.y)).setWidth(xFn(elem.background.width)).setHeight(yFn(elem.background.height)).setColor(elem.background.color).setAlpha(elem.background.alpha).setRotation(elem.background.rotation).setScale(elem.background.scale);
                        if (elem.zIndex != 3)
                            drawable.setZIndex(elem.zIndex);
                        drawables.push(drawable);
                    }

                }

                // at the moment it's not possible to move a button, because drawable ref points only to a single elem
                if (elem.animations) {
                    var animations = elem.animations;
                    if (animations.transform) {
                        moveWithKeyFrames(drawable, {
                            x: elem.x,
                            y: elem.y,
                            time: 0
                        }, animations.transform, true, isRelativeToSize_widthHalf ?
                            getXPositionRelativeToSize_anchorWithHalf.bind(undefined, sceneRect, elem.height) :
                            undefined);
                    }
                }

                function moveWithKeyFrames(drawable, currentFrame, frames, loop, customXFn, customYFn) {
                    if (loop) {
                        var framesCopy = frames.slice();
                    }

                    move(frames.shift(), currentFrame);

                    function move(frame, lastFrame) {
                        var duration = frame.time - lastFrame.time - 1;
                        if (frame.x == lastFrame.x && frame.y == lastFrame.y) {
                            if (duration == 0) {
                                continueMove();
                            } else {
                                self.timer.doLater(continueMove, duration);
                            }
                        } else {
                            var x = customXFn ? customXFn(frame.x) : xFn(frame.x);
                            var y = customYFn ? customYFn(frame.y) : yFn(frame.y);

                            drawable.moveTo(x, y).setDuration(duration).setCallback(continueMove);
                        }

                        function continueMove() {
                            if (frames.length > 0) {
                                move(frames.shift(), frame);
                            } else if (loop) {
                                moveWithKeyFrames(drawable, frame, framesCopy, loop, customXFn, customYFn);
                            }
                        }
                    }
                }

            }, this);
        }, this);

        if (this.viewModel.postConstruct)
            this.viewModel.postConstruct();

        function nextScene() {
            if (self.viewModel.preDestroy)
                self.viewModel.preDestroy();

            drawables.forEach(function (drawable) {
                drawable.remove();
            });
            self.events.unsubscribe(tapListenerId);

            next();
        }

        this.viewModel.nextScene = nextScene;
    };

    return MVVMScene;
})(iterateEntries, Width, Height, Event, Math);