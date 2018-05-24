H5.EntityServices = (function (Transition, changePath, changeCoords, Math) {
    'use strict';

    function duration(animation, duration) {
        animation.duration = duration;
        return animation;
    }

    function spacing(animation, spacing) {
        animation.timingFn = spacing;
        return animation;
    }

    function looping(animation, loop) {
        animation.loop = loop;
        return animation;
    }

    function callback(animation, callback, thisArg) {
        animation.__callback = thisArg ? callback.bind(thisArg) : callback;
        return animation;
    }

    function finish(animation) {
        animation.duration = 0;
        return animation;
    }

    function addServiceMethods(animation) {
        animation.setDuration = duration.bind(undefined, animation);
        animation.setSpacing = spacing.bind(undefined, animation);
        animation.setLoop = looping.bind(undefined, animation);
        animation.setCallback = callback.bind(undefined, animation);
        animation.finish = finish.bind(undefined, animation);

        return animation;
    }

    return {
        moveTo: function (visuals, resizer, screen, drawable, xFn, yFn, resizeDependencies) {
            var registerResizeAfterMove = function () {
                resizer.removeKey('path', drawable);

                resizer.add('position', drawable, function (width, height) {
                    changeCoords(drawable, Math.floor(xFn(width, height)), Math.floor(yFn(height, width)));
                }, resizeDependencies);

            };

            var path = visuals.getPath(drawable.x, drawable.y, Math.floor(xFn(screen.width, screen.height)),
                Math.floor(yFn(screen.height, screen.width)), 120, Transition.LINEAR, false);

            var enhancedCallBack = function () {
                registerResizeAfterMove();
                if (path.__callback) {
                    path.__callback();
                }
            };

            visuals.move(drawable, path, enhancedCallBack);

            resizer.add('path', drawable, function (width, height) {
                changePath(path, drawable.x, drawable.y, Math.floor(xFn(width, height)),
                    Math.floor(yFn(height, width)));
            }, resizeDependencies);

            return addServiceMethods(path);
        },

        moveQuadTo: function (visuals, resizer, screen, drawable, property, xFn, yFn, resizeDependencies) {
            var registerResizeAfterMove = function () {
                resizer.removeKey('path_' + property, drawable);

                resizer.add('position_' + property, drawable, function (width, height) {
                    drawable.data[property + 'x'] = Math.floor(xFn(width, height));
                    drawable.data[property + 'y'] = Math.floor(yFn(height, width));
                }, resizeDependencies);

            };

            var path = visuals.getPath(drawable.data[property + 'x'], drawable.data[property + 'y'],
                Math.floor(xFn(screen.width, screen.height)), Math.floor(yFn(screen.height, screen.width)), 120,
                Transition.LINEAR, false);

            var enhancedCallBack = function () {
                registerResizeAfterMove();
                if (path.__callback) {
                    path.__callback();
                }
            };

            visuals.moveQuad(property, drawable, path, enhancedCallBack);

            resizer.add('path_' + property, drawable, function (width, height) {
                changePath(path, drawable.data[property + 'x'], drawable.data[property + 'y'],
                    Math.floor(xFn(width, height)), Math.floor(yFn(height, width)));
            }, resizeDependencies);

            return addServiceMethods(path);
        },

        moveFrom: function (visuals, resizer, screen, drawable, xFn, yFn, resizeDependencies) {
            var registerResizeAfterMove = function () {
                resizer.removeKey('path', drawable);
            };

            var fromX = Math.floor(xFn(screen.width, screen.height));
            var fromY = Math.floor(yFn(screen.height, screen.width));
            var path = visuals.getPath(fromX, fromY, drawable.x, drawable.y, 120, Transition.LINEAR, false);

            drawable.x = fromX;
            drawable.y = fromY;

            var enhancedCallBack = function () {
                registerResizeAfterMove();
                if (path.__callback) {
                    path.__callback();
                }
            };

            visuals.move(drawable, path, enhancedCallBack);

            resizer.add('path', drawable, function (width, height) {
                changePath(path, Math.floor(xFn(width, height)), Math.floor(yFn(height, width)), drawable.x,
                    drawable.y);
            }, resizeDependencies);

            return addServiceMethods(path);
        },
        setShow: function (drawable, value) {
            drawable.show = value;
            return drawable;
        },
        show: function (visuals, drawable) {
            visuals.draw(drawable);
            return drawable;
        },
        hide: function (visuals, drawable) {
            visuals.remove(drawable);
            return drawable;
        },
        unmask: function (visuals, resizer, drawable) {
            this.remove(visuals, resizer, drawable.mask);
        },
        remove: function (visuals, resizer, drawable) {
            resizer.remove(drawable);
            if (drawable.mask) {
                this.remove(visuals, resizer, drawable.mask);
                delete drawable.mask;
            }
            visuals.remove(drawable);
            return drawable;
        },
        pause: function (visuals, drawable) {
            visuals.pause(drawable);
            return drawable;
        },
        play: function (visuals, drawable) {
            visuals.play(drawable);
            return drawable;
        },
        rotateTo: function (visuals, drawable, angle) {
            var enhancedCallBack = function () {
                if (animation.__callback) {
                    animation.__callback();
                }
            };
            var animation = visuals.animateRotation(drawable, angle, 120, Transition.LINEAR, false, enhancedCallBack);
            return addServiceMethods(animation);
        },
        rotationPattern: function (visuals, drawable, valuePairs, loop) {
            visuals.animateRotationPattern(drawable, valuePairs, loop);
            return drawable;
        },
        opacityTo: function (visuals, drawable, alpha) {
            var enhancedCallBack = function () {
                if (animation.__callback) {
                    animation.__callback();
                }
            };
            var animation = visuals.animateAlpha(drawable, alpha, 120, Transition.LINEAR, false, enhancedCallBack);
            return addServiceMethods(animation);
        },
        opacityPattern: function (visuals, drawable, valuePairs, loop) {
            visuals.animateAlphaPattern(drawable, valuePairs, loop);
            return drawable;
        },
        scaleTo: function (visuals, drawable, scale) {
            var enhancedCallBack = function () {
                if (animation.__callback) {
                    animation.__callback();
                }
            };
            var animation = visuals.animateScale(drawable, scale, 120, Transition.LINEAR, false, enhancedCallBack);
            return addServiceMethods(animation);
        },
        scalePattern: function (visuals, drawable, valuePairs, loop) {
            visuals.animateScalePattern(drawable, valuePairs, loop);
            return drawable;
        },
        sprite: function (visuals, drawable, imgPathName, numberOfFrames, loop) {
            var sprite = visuals.getSprite(imgPathName, numberOfFrames, loop);
            var enhancedCallBack = function () {
                if (sprite.__callback) {
                    sprite.__callback();
                }
            };
            visuals.animate(drawable, sprite, enhancedCallBack);

            sprite.setLoop = looping.bind(undefined, sprite);
            sprite.setCallback = callback.bind(undefined, sprite);
            sprite.finish = function () {
                // todo: fix api soon plz -> should be prefixed as private member
                visuals.spriteAnimations.remove(drawable);
            };

            return sprite;
        },
        volumeTo: function (visuals, audio, volume) {
            var enhancedCallBack = function () {
                if (animation.__callback) {
                    animation.__callback();
                }
            };
            var animation = visuals.animateVolume(audio, volume, 120, Transition.LINEAR, false, enhancedCallBack);
            return addServiceMethods(animation);
        }
    };
})(H5.Transition, H5.changePath, H5.changeCoords, Math);
