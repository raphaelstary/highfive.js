var MVVMScene = (function (iterateEntries, Width, Height, Event, Math) {
    "use strict";

    function MVVMScene(model, view, viewModel, parentSceneRect, anchorXFn, anchorYFn) {
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

        // sub scene
        this.parentSceneRect = parentSceneRect;
        this.anchorXFn = anchorXFn;
        this.anchorYFn = anchorYFn;
    }

    MVVMScene.prototype.show = function (next) {
        var self = this;
        var drawables = [];
        var taps = [];

        function isHit(pointer, drawable) {
            return pointer.x > drawable.getCornerX() && pointer.x < drawable.getEndX() &&
                pointer.y > drawable.getCornerY() && pointer.y < drawable.getEndY();
        }

        //var currentFrameNumber = 0;
        //var tick = 0;
        //var frameListenerId = this.events.subscribe(Event.TICK_START, function () {
        //    if (++tick % 2 == 0)
        //        currentFrameNumber++;
        //});

        var paused = false;
        var tapListenerId = this.events.subscribe(Event.POINTER, function (pointer) {
            if (paused)
                return;

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
            if (self.anchorXFn && self.parentSceneRect) {
                var subSceneWidth = Width.get(self.parentSceneRect.width, sceneRect.width);
                var subSceneWidthHalf = multiply(subSceneWidth, 0.5);
                var subSceneCornerX = subtract(self.anchorXFn, subSceneWidthHalf);
                var relativeElemPosition = function (width, height) {
                    return Width.get(sceneRect.width, x)(subSceneWidth(width, height));
                };
                return add(subSceneCornerX, relativeElemPosition);
            }
            return Width.get(sceneRect.width, x);
        }

        function yFn(y) {
            if (self.anchorYFn && self.parentSceneRect) {
                var subSceneHeight = Height.get(self.parentSceneRect.height, sceneRect.height);
                var subSceneHeightHalf = multiply(subSceneHeight, 0.5);
                var subSceneCornerY = subtract(self.anchorYFn, subSceneHeightHalf);
                var relativeElemPosition = function (height, width) {
                    return Height.get(sceneRect.height, y)(subSceneHeight(height, width));
                };
                return add(subSceneCornerY, relativeElemPosition);
            }
            return Height.get(sceneRect.height, y);
        }

        function txtSize(size) {
            if (self.anchorYFn && self.parentSceneRect) {
                var subSceneHeight = Height.get(self.parentSceneRect.height, sceneRect.height);
                var subSceneHeightHalf = multiply(subSceneHeight, 0.5);
                var subSceneCornerY = subtract(self.anchorYFn, subSceneHeightHalf);
                var relativeElemPosition = function (width, height) {
                    return calcScreenConst(subSceneHeight(height, width), sceneRect.height, size);
                };
                return add(subSceneCornerY, relativeElemPosition);
            }

            return function (width, height) {
                return calcScreenConst(height, sceneRect.height, size);
            };
        }

        function hasTag(name, value) { // todo use instead of all other crap
            return function (tags) {
                return tags.some(function (tag) {
                    return tag[name] == value;
                });
            }
        }

        function getTagValue(name) {
            return function (tags) {
                var returnValue;
                var foundSmth = tags.some(function (tag) {
                    if (tag[name] != undefined) {
                        returnValue = tag[name];
                        return true;
                    }
                    return false;
                });
                if (foundSmth)
                    return returnValue;
                return false;
            }
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
            if (self.anchorXFn && self.parentSceneRect) {
                var subSceneWidth = Width.get(self.parentSceneRect.width, sceneRect.width);
                var subSceneWidthHalf = multiply(subSceneWidth, 0.5);
                var subSceneCornerX = subtract(self.anchorXFn, subSceneWidthHalf);
                var relativeElemPosition = function (width, height) {
                    // todo fix this - it's clearly not right - or at least not tested if it's right
                    return Math.floor(width / 2 +
                        (self.parentSceneRect.width / 2 / (x - sceneRect.width / 2) / relativeToSize_elemHeight) *
                        yFn(relativeToSize_elemHeight)(height));
                };
                return add(subSceneCornerX, relativeElemPosition);
            }

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

                var isRelativeToSize_widthHalf = elem.tags && hasPositionTag_relativeToSize(elem.tags);
                //&& hasAnchorTag_widthHalf(elem.tags);
                if (isRelativeToSize_widthHalf) {
                    // very specific use case
                    x = getXPositionRelativeToSize_anchorWithHalf(sceneRect, elem.height, elem.x);
                }

                var drawable;
                if (elem.type == 'image') {
                    var imgName = elem.filename.substring(0, elem.filename.lastIndexOf('.'));

                    drawable = this.stage.createImage(imgName).setPosition(x,
                        y).setAlpha(elem.alpha).setRotation(elem.rotation).setScale(elem.scale);
                    if (elem.zIndex != undefined && elem.zIndex != 3)
                        drawable.setZIndex(elem.zIndex);

                    drawables.push(drawable);
                    if (elem.viewId) {
                        this.viewModel[elem.viewId] = drawable;
                    }

                } else if (elem.type == 'text') {

                    drawable = this.stage.createText(elem.msg).setPosition(x,
                        y).setSize(txtSize(elem.size)).setFont(elem.font).setColor(elem.color).setRotation(elem.rotation).setAlpha(elem.alpha).setScale(elem.scale);
                    if (elem.zIndex != undefined && elem.zIndex != 3)
                        drawable.setZIndex(elem.zIndex);

                    drawables.push(drawable);
                    if (elem.viewId) {
                        this.viewModel[elem.viewId] = drawable;
                    }

                } else if (elem.type == 'line') {
                    drawable = this.stage.createLine().setPosition(x,
                        y).setLength(txtSize(elem.length)).setColor(elem.color);

                    drawable.setLineWidth(txtSize(elem.lineWidth));
                    drawable.setAlpha(elem.alpha).setRotation(elem.rotation).setScale(elem.scale);

                    if (elem.zIndex != undefined && elem.zIndex != 3)
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
                        if (elem.zIndex != undefined && elem.zIndex != 3)
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
                        if (elem.zIndex != undefined && elem.zIndex != 3)
                            drawable.setZIndex(elem.zIndex);
                        drawables.push(drawable);

                    } else if (elem.background.type == 'rectangle') {
                        drawable = this.stage.createRectangle(elem.background.filled).setPosition(xFn(elem.background.x),
                            yFn(elem.background.y)).setWidth(xFn(elem.background.width)).setHeight(yFn(elem.background.height)).setColor(elem.background.color).setAlpha(elem.background.alpha).setRotation(elem.background.rotation).setScale(elem.background.scale);
                        if (elem.zIndex != undefined && elem.zIndex != 3)
                            drawable.setZIndex(elem.zIndex);
                        drawables.push(drawable);
                    }

                }

                if (elem.mask) {
                    var maskX = xFn(elem.mask.x);
                    var maskY = yFn(elem.mask.y);

                    if (isRelativeToSize_widthHalf) {
                        // very specific use case
                        maskX = getXPositionRelativeToSize_anchorWithHalf(sceneRect, elem.mask.height, elem.mask.x);
                    }

                    var mask = this.stage.createRectangle().setPosition(maskX,
                        maskY).setWidth(xFn(elem.mask.width)).setHeight(yFn(elem.mask.height)).setRotation(elem.mask.rotation);
                    drawable.setMask(mask);
                }

                // at the moment it's not possible to move a button, because drawable ref points only to a single elem
                if (elem.animations) {
                    var animationTiming = elem.animations.lastFrame;
                    elem.tags.some(function (tag) {
                        var foundSmth = tag.time !== undefined;
                        if (foundSmth)
                            animationTiming = tag.time;
                        return foundSmth;
                    });
                    var isLoop = true;
                    elem.tags.some(function (tag) {
                        var foundSmth = tag.loop !== undefined;
                        if (foundSmth)
                            isLoop = tag.loop == 'true';
                        return foundSmth;
                    });
                    var isInitialDelay = true;
                    elem.tags.some(function (tag) {
                        var foundSmth = tag.initialDelay !== undefined;
                        if (foundSmth)
                            isInitialDelay = tag.initialDelay == 'true';
                        return foundSmth;
                    });

                    var callbackMethodName = getTagValue('end')(elem.tags);
                    var callback;
                    if (callbackMethodName) {
                        callback = new CallbackCounter(this.viewModel[callbackMethodName].bind(this.viewModel));
                    }

                    var animations = elem.animations;
                    if (animations.position) {
                        var customXFn = isRelativeToSize_widthHalf ?
                            getXPositionRelativeToSize_anchorWithHalf.bind(undefined, sceneRect, elem.height) :
                            undefined;
                        var currentFrame = {
                            x: elem.x,
                            y: elem.y,
                            time: 0
                        };
                        moveWithKeyFrames(drawable, currentFrame, animations.position, isLoop, isInitialDelay,
                            animationTiming, customXFn, undefined, callback ? callback.register() : undefined);
                    }
                    if (animations.opacity) {
                        var currentOpacityFrame = {
                            opacity: elem.alpha,
                            time: 0
                        };
                        fadeWithKeyFrames(drawable, currentOpacityFrame, animations.opacity, isLoop, isInitialDelay,
                            animationTiming, callback ? callback.register() : undefined);
                    }
                    if (animations.scale) {
                        var currentScaleFrame = {
                            scale: elem.scale,
                            time: 0
                        };
                        scaleWithKeyFrames(drawable, currentScaleFrame, animations.scale, isLoop, isInitialDelay,
                            animationTiming, callback ? callback.register() : undefined);
                    }
                    if (animations.rotation) {
                        var currentRotationFrame = {
                            rotation: elem.rotation,
                            time: 0
                        };
                        rotateWithKeyFrames(drawable, currentRotationFrame, animations.rotation, isLoop, isInitialDelay,
                            animationTiming, callback ? callback.register() : undefined);
                    }
                }

                if (elem.animations && elem.animations.mask) {
                    animations = elem.animations.mask;
                    if (animations.position) {
                        var customMaskXFn = isRelativeToSize_widthHalf ?
                            getXPositionRelativeToSize_anchorWithHalf.bind(undefined, sceneRect, elem.mask.height) :
                            undefined;
                        var currentMaskFrame = {
                            x: elem.mask.x,
                            y: elem.mask.y,
                            time: 0
                        };
                        moveWithKeyFrames(mask, currentMaskFrame, animations.position, isLoop, isInitialDelay,
                            animationTiming, customMaskXFn, undefined, callback ? callback.register() : undefined);
                    }
                    if (animations.scale) {
                        var currentMaskScaleFrame = {
                            scale: elem.mask.scale,
                            time: 0
                        };
                        scaleWithKeyFrames(mask, currentMaskScaleFrame, animations.scale, isLoop, isInitialDelay,
                            animationTiming, callback ? callback.register() : undefined);
                    }
                    if (animations.rotation) {
                        var currentMaskRotationFrame = {
                            rotation: elem.mask.rotation,
                            time: 0
                        };
                        rotateWithKeyFrames(mask, currentMaskRotationFrame, animations.rotation, isLoop, isInitialDelay,
                            animationTiming, callback ? callback.register() : undefined);
                    }
                }

                function fadeWithKeyFrames(drawable, currentFrame, frames, loop, initialDelay, timing, callback) {
                    if (loop)
                        var framesCopy = frames.slice();

                    move(frames.shift(), currentFrame);

                    function move(frame, lastFrame) {
                        var duration = (frame.time - lastFrame.time) * 2 - 1;
                        if (frame.opacity == lastFrame.opacity) {
                            if (duration < 1) {
                                continueMove();
                            } else {
                                //if (lastFrame.time != currentFrameNumber % timing) {
                                //    console.log(drawable.id + " starts alpha do_later - from: " + lastFrame.time +
                                //        " @ " + currentFrameNumber % timing + " to: " + frame.time + " value: " +
                                //        frame.opacity);
                                //}

                                self.timer.doLater(continueMove, duration);
                            }
                        } else {
                            //if (lastFrame.time != currentFrameNumber % timing) {
                            //    console.log(drawable.id + " starts alpha animation - from: " + lastFrame.time + " @ "
                            // + currentFrameNumber % timing + " to: " + frame.time + " value: " + frame.opacity); }
                            drawable.opacityTo(frame.opacity).setDuration(duration).setCallback(continueMove);
                        }

                        function continueMove() {
                            //if (frame.time != currentFrameNumber % timing) {
                            //    console.log(drawable.id + " ends alpha - from: " + frame.time + " @ " +
                            //        currentFrameNumber % timing + " value: " + frame.opacity);
                            //}
                            if (itIsOver)
                                return;

                            if (frames.length > 0) {
                                move(frames.shift(), frame);
                            } else if (loop) {

                                if (timing) {
                                    var duration = (timing - frame.time) * 2 - 1;
                                    self.timer.doLater(function () {
                                        if (itIsOver)
                                            return;
                                        if (initialDelay) {
                                            drawable.setAlpha(currentFrame.opacity);
                                            fadeWithKeyFrames(drawable, currentFrame, framesCopy, loop, initialDelay,
                                                timing);
                                        } else {
                                            drawable.setAlpha(framesCopy[0].opacity);
                                            fadeWithKeyFrames(drawable, framesCopy[0], framesCopy, loop, initialDelay,
                                                timing);
                                        }
                                    }, duration);
                                } else {
                                    if (initialDelay) {
                                        drawable.setAlpha(currentFrame.opacity);
                                        fadeWithKeyFrames(drawable, currentFrame, framesCopy, loop, initialDelay,
                                            timing);
                                    } else {
                                        drawable.setAlpha(framesCopy[0].opacity);
                                        fadeWithKeyFrames(drawable, framesCopy[0], framesCopy, loop, initialDelay,
                                            timing);
                                    }
                                }
                            } else {
                                if (callback)
                                    callback();
                            }
                        }
                    }
                }

                function rotateWithKeyFrames(drawable, currentFrame, frames, loop, initialDelay, timing, callback) {
                    if (loop)
                        var framesCopy = frames.slice();

                    move(frames.shift(), currentFrame);

                    function move(frame, lastFrame) {
                        var duration = (frame.time - lastFrame.time) * 2 - 1;
                        if (frame.rotation == lastFrame.rotation) {
                            if (duration < 1) {
                                continueMove();
                            } else {
                                //if (lastFrame.time != currentFrameNumber % timing) {
                                //    console.log(drawable.id + " starts rotate do_later - from: " + lastFrame.time +
                                //        " @ " + currentFrameNumber % timing + " to: " + frame.time + " value: " +
                                //        frame.rotation);
                                //}
                                self.timer.doLater(continueMove, duration);
                            }
                        } else {
                            //if (lastFrame.time != currentFrameNumber % timing) {
                            //    console.log(drawable.id + " starts rotate animation - from: " + lastFrame.time + " @
                            // " + currentFrameNumber % timing + " to: " + frame.time + " value: " + frame.rotation); }
                            drawable.rotateTo(frame.rotation).setDuration(duration).setCallback(continueMove);
                        }

                        function continueMove() {
                            //if (frame.time != currentFrameNumber % timing) {
                            //    console.log(drawable.id + " ends rotate - from: " + frame.time + " @ " +
                            //        currentFrameNumber % timing + " value: " + frame.rotation);
                            //}
                            if (itIsOver)
                                return;

                            if (frames.length > 0) {
                                move(frames.shift(), frame);
                            } else if (loop) {
                                if (timing) {
                                    var duration = (timing - frame.time) * 2 - 2;
                                    self.timer.doLater(function () {
                                        if (itIsOver)
                                            return;
                                        if (initialDelay) {
                                            drawable.setRotation(currentFrame.rotation);
                                            rotateWithKeyFrames(drawable, currentFrame, framesCopy, loop, initialDelay,
                                                timing);
                                        } else {
                                            drawable.setRotation(framesCopy[0].rotation);
                                            rotateWithKeyFrames(drawable, framesCopy[0], framesCopy, loop, initialDelay,
                                                timing);
                                        }
                                    }, duration);
                                } else {
                                    if (initialDelay) {
                                        drawable.setRotation(currentFrame.rotation);
                                        rotateWithKeyFrames(drawable, currentFrame, framesCopy, loop, initialDelay,
                                            timing);
                                    } else {
                                        drawable.setRotation(framesCopy[0].rotation);
                                        rotateWithKeyFrames(drawable, framesCopy[0], framesCopy, loop, initialDelay,
                                            timing);
                                    }
                                }
                            } else {
                                if (callback)
                                    callback();
                            }
                        }
                    }
                }

                function scaleWithKeyFrames(drawable, currentFrame, frames, loop, initialDelay, timing, callback) {
                    if (loop)
                        var framesCopy = frames.slice();

                    move(frames.shift(), currentFrame);

                    function move(frame, lastFrame) {
                        var duration = (frame.time - lastFrame.time) * 2 - 1;
                        if (frame.scale == lastFrame.scale) {
                            if (duration < 1) {
                                continueMove();
                            } else {
                                //if (lastFrame.time != currentFrameNumber % timing) {
                                //    console.log(drawable.id + " starts scale do_later - from: " + lastFrame.time +
                                //        " @ " + currentFrameNumber % timing + " to: " + frame.time + " value: " +
                                //        frame.scale);
                                //}
                                self.timer.doLater(continueMove, duration);
                            }
                        } else {
                            //if (lastFrame.time != currentFrameNumber % timing) {
                            //    console.log(drawable.id + " starts scale animation - from: " + lastFrame.time + " @ "
                            // + currentFrameNumber % timing + " to: " + frame.time + " value: " + frame.scale); }
                            drawable.scaleTo(frame.scale).setDuration(duration).setCallback(continueMove);
                        }

                        function continueMove() {
                            //if (frame.time != currentFrameNumber % timing) {
                            //    console.log(drawable.id + " ends scale - from: " + frame.time + " @ " +
                            //        currentFrameNumber % timing + " value: " + frame.scale);
                            //}
                            if (itIsOver)
                                return;

                            if (frames.length > 0) {
                                move(frames.shift(), frame);
                            } else if (loop) {

                                if (timing) {
                                    var duration = (timing - frame.time) * 2 - 2;
                                    self.timer.doLater(function () {
                                        if (itIsOver)
                                            return;
                                        if (initialDelay) {
                                            drawable.setScale(currentFrame.scale);
                                            scaleWithKeyFrames(drawable, currentFrame, framesCopy, loop, initialDelay,
                                                timing);
                                        } else {
                                            drawable.setScale(framesCopy[0].scale);
                                            scaleWithKeyFrames(drawable, framesCopy[0], framesCopy, loop, initialDelay,
                                                timing);
                                        }

                                    }, duration);
                                } else {
                                    if (initialDelay) {
                                        drawable.setScale(currentFrame.scale);
                                        scaleWithKeyFrames(drawable, currentFrame, framesCopy, loop, initialDelay,
                                            timing);
                                    } else {
                                        drawable.setScale(framesCopy[0].scale);
                                        scaleWithKeyFrames(drawable, framesCopy[0], framesCopy, loop, initialDelay,
                                            timing);
                                    }
                                }
                            } else {
                                if (callback)
                                    callback();
                            }
                        }
                    }
                }

                function moveWithKeyFrames(drawable, currentFrame, frames, loop, initialDelay, timing, customXFn,
                    customYFn, callback) {
                    if (loop)
                        var framesCopy = frames.slice();

                    move(frames.shift(), currentFrame);

                    function move(frame, lastFrame) {
                        var duration = (frame.time - lastFrame.time) * 2 - 1;
                        if (frame.x == lastFrame.x && frame.y == lastFrame.y) {
                            if (duration < 1) {
                                continueMove();
                            } else {
                                //if (lastFrame.time != currentFrameNumber % timing) {
                                //    console.log(drawable.id + " starts move do_later - from: " + lastFrame.time +
                                //        " @ " + currentFrameNumber % timing + " to: " + frame.time + " value: " +
                                //        frame.x + " " + frame.y);
                                //}
                                self.timer.doLater(continueMove, duration);
                            }
                        } else {
                            var x = customXFn ? customXFn(frame.x) : xFn(frame.x);
                            var y = customYFn ? customYFn(frame.y) : yFn(frame.y);
                            //if (lastFrame.time != currentFrameNumber % timing) {
                            //    console.log(drawable.id + " starts move animation - from: " + lastFrame.time + " @ " +
                            //        currentFrameNumber % timing + " to: " + frame.time + " value: " + frame.x + " " +
                            //        frame.y);
                            //}
                            drawable.moveTo(x, y).setDuration(duration).setCallback(continueMove);
                        }

                        function continueMove() {
                            //if (frame.time != currentFrameNumber % timing) {
                            //    console.log(drawable.id + " ends move - from: " + frame.time + " @ " +
                            //        currentFrameNumber % timing + " value: " + frame.x + " " + frame.y);
                            //}
                            if (itIsOver)
                                return;

                            if (frames.length > 0) {
                                move(frames.shift(), frame);
                            } else if (loop) {

                                if (timing) {
                                    var duration = (timing - frame.time) * 2 - 2;
                                    self.timer.doLater(function () {

                                        if (itIsOver)
                                            return;
                                        var x;
                                        var y;
                                        if (initialDelay) {
                                            x = customXFn ? customXFn(currentFrame.x) : xFn(currentFrame.x);
                                            y = customYFn ? customYFn(currentFrame.y) : yFn(currentFrame.y);
                                            drawable.setPosition(x, y);
                                            moveWithKeyFrames(drawable, currentFrame, framesCopy, loop, initialDelay,
                                                timing, customXFn, customYFn);
                                        } else {
                                            var initialFrame = framesCopy[0];
                                            x = customXFn ? customXFn(initialFrame.x) : xFn(initialFrame.x);
                                            y = customYFn ? customYFn(initialFrame.y) : yFn(initialFrame.y);
                                            drawable.setPosition(x, y);
                                            moveWithKeyFrames(drawable, initialFrame, framesCopy, loop, initialDelay,
                                                timing, customXFn, customYFn);
                                        }
                                    }, duration);
                                } else {
                                    var x;
                                    var y;
                                    if (initialDelay) {
                                        x = customXFn ? customXFn(currentFrame.x) : xFn(currentFrame.x);
                                        y = customYFn ? customYFn(currentFrame.y) : yFn(currentFrame.y);
                                        drawable.setPosition(x, y);
                                        moveWithKeyFrames(drawable, currentFrame, framesCopy, loop, initialDelay,
                                            timing, customXFn, customYFn);
                                    } else {
                                        var initialFrame = framesCopy[0];
                                        x = customXFn ? customXFn(initialFrame.x) : xFn(initialFrame.x);
                                        y = customYFn ? customYFn(initialFrame.y) : yFn(initialFrame.y);
                                        drawable.setPosition(x, y);
                                        moveWithKeyFrames(drawable, initialFrame, framesCopy, loop, initialDelay,
                                            timing, customXFn, customYFn);
                                    }
                                }
                            } else {
                                if (callback)
                                    callback();
                            }
                        }
                    }
                }

            }, this);
        }, this);

        if (this.viewModel.postConstruct)
            this.viewModel.postConstruct();

        var itIsOver = false;

        function nextScene() {
            if (itIsOver)
                return;
            itIsOver = true;

            if (self.viewModel.preDestroy)
                self.viewModel.preDestroy();

            drawables.forEach(function (drawable) {
                drawable.remove();
            });
            self.events.unsubscribe(tapListenerId);
            //self.events.unsubscribe(frameListenerId);

            next();
        }

        // dependency injection for globals inside your view model
        this.viewModel.nextScene = nextScene;
        //this.viewModel.sceneRect = sceneRect;

        this.events.subscribe(Event.PAUSE, function () {
            paused = true;
        });

        this.events.subscribe(Event.RESUME, function () {
            paused = false;
        });
    };

    return MVVMScene;
})(iterateEntries, Width, Height, Event, Math);