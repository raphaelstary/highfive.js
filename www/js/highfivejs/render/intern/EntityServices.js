var EntityServices = (function (Transition, changePath, TextWrapper, Rectangle) {
    "use strict";

    function duration(animation, duration) {
        animation.duration = duration;
        return animation;
    }

    function spacing(animation, spacing) {
        animation.timingFn = spacing;
        return animation;
    }

    function loop(animation, loop) {
        animation.loop = loop;
        return animation;
    }

    function callback(animation, callback) {
        animation.__callback = callback;
        return animation;
    }

    function addServiceMethods(animation) {
        animation.setDuration = duration.bind(undefined, animation);
        animation.setSpacing = spacing.bind(undefined, animation);
        animation.setLoop = loop.bind(undefined, animation);
        animation.setCallback = callback.bind(undefined, animation);

        return animation;
    }

    return {
        moveTo: function (stage, resizer, screen, drawable, xFn, yFn, resizeDependencies) {
            var pathId = {id: drawable.id + '_1'};

            var registerResizeAfterMove = function () {
                resizer.remove(pathId);

                if (drawable.data instanceof TextWrapper || drawable.data instanceof Rectangle) {
                    // todo add all other entity classes or refactor
                    var afterEntitySpecificStuff_nowXnYPosition_id = {id: drawable.id + '_2'};
                    resizer.add(afterEntitySpecificStuff_nowXnYPosition_id, function (width, height) {
                        changeCoords(drawable, xFn(width, height), yFn(height, width));
                    }, resizeDependencies);
                } else {
                    resizeDependencies = resizeDependencies.filter(function (element) {
                        return element.id != drawable.id;
                    });
                    resizer.add(drawable, function (width, height) {
                        changeCoords(drawable, xFn(width, height), yFn(height, width));
                    }, resizeDependencies);
                }
            };

            var path = stage.getPath(drawable.x, drawable.y, xFn(screen.width, screen.height),
                yFn(screen.height, screen.width), 120, Transition.LINEAR, false);

            var enhancedCallBack = function () {
                registerResizeAfterMove();
                if (path.__callback)
                    path.__callback();
            };

            stage.move(drawable, path, enhancedCallBack);

            if (resizeDependencies) {
                resizeDependencies.push(drawable);
            } else {
                resizeDependencies = [drawable];
            }

            resizer.add(pathId, function (width, height) {
                changePath(path, drawable.x, drawable.y, xFn(width, height), yFn(height, width));
            }, resizeDependencies);

            return addServiceMethods(path);
        },
        show: function (stage, drawable) {
            stage.draw(drawable);
            return drawable;
        },
        hide: function (stage, drawable) {
            stage.remove(drawable);
            return drawable;
        },
        remove: function (stage, drawable) {
            // todo 10000 removes
            stage.remove(drawable);
            return drawable;
        },
        pause: function (stage, drawable) {
            stage.pause(drawable);
            return drawable;
        },
        play: function (stage, drawable) {
            stage.play(drawable);
            return drawable;
        },
        rotateTo: function (stage, drawable, angle) {
            var enhancedCallBack = function () {
                if (animation.__callback)
                    animation.__callback();
            };
            var animation = stage.animateRotation(drawable, angle, 120, Transition.LINEAR, false, enhancedCallBack);
            return addServiceMethods(animation);
        },
        rotationPattern: function (stage, drawable, valuePairs, loop) {
            stage.animateRotationPattern(drawable, valuePairs, loop);
            return drawable;
        },
        opacityTo: function (stage, drawable, alpha) {
            var enhancedCallBack = function () {
                if (animation.__callback)
                    animation.__callback();
            };
            var animation = stage.animateAlpha(drawable, alpha, 120, Transition.LINEAR, false, enhancedCallBack);
            return addServiceMethods(animation);
        },
        opacityPattern: function (stage, drawable, valuePairs, loop) {
            stage.animateAlphaPattern(drawable, valuePairs, loop);
            return drawable;
        },
        scaleTo: function (stage, drawable, scale) {
            var enhancedCallBack = function () {
                if (animation.__callback)
                    animation.__callback();
            };
            var animation = stage.animateScale(drawable, scale, 120, Transition.LINEAR, false, enhancedCallBack);
            return addServiceMethods(animation);
        },
        scalePattern: function (stage, drawable, valuePairs, loop) {
            stage.animateScalePattern(drawable, valuePairs, loop);
            return drawable;
        },
        sprite: function (stage, drawable, imgPathName, numberOfFrames, loop) {
            var sprite = stage.getSprite(imgPathName, numberOfFrames, loop);
            var enhancedCallBack = function () {
                if (drawable.__callback)
                    drawable.__callback();
            };
            stage.animate(drawable, sprite, enhancedCallBack);

            return drawable;
        }
    };
})(Transition, changePath, TextWrapper, Rectangle);