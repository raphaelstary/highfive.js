H5.EntityServices = (function (Transition, changePath, changeCoords) {
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

    function callback(animation, callback, self) {
        animation.__callback = self ? callback.bind(self) : callback;
        return animation;
    }

    function finish(animation) {
        animation.duration = 0;
        return animation;
    }

    function addServiceMethods(animation) {
        animation.setDuration = duration.bind(undefined, animation);
        animation.setSpacing = spacing.bind(undefined, animation);
        animation.setLoop = loop.bind(undefined, animation);
        animation.setCallback = callback.bind(undefined, animation);
        animation.finish = finish.bind(undefined, animation);

        return animation;
    }

    return {
        moveTo: function (stage, resizer, screen, drawable, xFn, yFn, resizeDependencies) {
            var registerResizeAfterMove = function () {
                resizer.removeKey('path', drawable);

                resizer.add('position', drawable, function (width, height) {
                    changeCoords(drawable, xFn(width, height), yFn(height, width));
                }, resizeDependencies);

            };

            var path = stage.getPath(drawable.x, drawable.y, xFn(screen.width, screen.height),
                yFn(screen.height, screen.width), 120, Transition.LINEAR, false);

            var enhancedCallBack = function () {
                registerResizeAfterMove();
                if (path.__callback)
                    path.__callback();
            };

            stage.move(drawable, path, enhancedCallBack);

            resizer.add('path', drawable, function (width, height) {
                changePath(path, drawable.x, drawable.y, xFn(width, height), yFn(height, width));
            }, resizeDependencies);

            return addServiceMethods(path);
        },

        moveQuadTo: function (stage, resizer, screen, drawable, property, xFn, yFn, resizeDependencies) {
            var registerResizeAfterMove = function () {
                resizer.removeKey('path_' + property, drawable);

                resizer.add('position_' + property, drawable, function (width, height) {
                    drawable.data[property + 'x'] = xFn(width, height);
                    drawable.data[property + 'y'] = yFn(height, width);
                }, resizeDependencies);

            };

            var path = stage.getPath(drawable.data[property + 'x'], drawable.data[property + 'y'],
                xFn(screen.width, screen.height), yFn(screen.height, screen.width), 120, Transition.LINEAR, false);

            var enhancedCallBack = function () {
                registerResizeAfterMove();
                if (path.__callback)
                    path.__callback();
            };

            stage.moveQuad(property, drawable, path, enhancedCallBack);

            resizer.add('path_' + property, drawable, function (width, height) {
                changePath(path, drawable.data[property + 'x'], drawable.data[property + 'y'], xFn(width, height),
                    yFn(height, width));
            }, resizeDependencies);

            return addServiceMethods(path);
        },

        moveFrom: function (stage, resizer, screen, drawable, xFn, yFn, resizeDependencies) {
            var registerResizeAfterMove = function () {
                resizer.removeKey('path', drawable);

                //resizer.add('position', drawable, function (width, height) {
                //    changeCoords(drawable, xFn(width, height), yFn(height, width));
                //}, resizeDependencies);

            };

            var path = stage.getPath(xFn(screen.width, screen.height), yFn(screen.height, screen.width), drawable.x,
                drawable.y, 120, Transition.LINEAR, false);

            var enhancedCallBack = function () {
                registerResizeAfterMove();
                if (path.__callback)
                    path.__callback();
            };

            stage.move(drawable, path, enhancedCallBack);

            resizer.add('path', drawable, function (width, height) {
                changePath(path, xFn(width, height), yFn(height, width), drawable.x, drawable.y);
            }, resizeDependencies);

            return addServiceMethods(path);
        },
        setShow: function (drawable, value) {
            drawable.show = value;
            return drawable;
        },
        show: function (stage, drawable) {
            stage.draw(drawable);
            return drawable;
        },
        hide: function (stage, drawable) {
            stage.remove(drawable);
            return drawable;
        },
        unmask: function (stage, resizer, drawable) {
            this.remove(stage, resizer, drawable.mask);
        },
        remove: function (stage, resizer, drawable) {
            resizer.remove(drawable);
            if (drawable.mask) {
                this.remove(stage, resizer, drawable.mask);
                delete  drawable.mask;
            }
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
})(H5.Transition, H5.changePath, H5.changeCoords);