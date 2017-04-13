var H5 = {};
var G = {};
H5.iterateEntries = (function (Object) {
    'use strict';

    function iterateEntries(dictionary, callback, self) {
        Object.keys(dictionary).forEach(function (key) {
            callback.call(self, dictionary[key], key);
        });
    }

    return iterateEntries;
})(Object);

H5.iterateSomeEntries = (function () {
    'use strict';

    function iterateSomeEntries(dictionary, callback, self) {
        return Object.keys(dictionary).some(function (key) {
            return callback.call(self, dictionary[key]);
        });
    }

    return iterateSomeEntries;
})();

H5.concatenateProperties = (function (Object) {
    'use strict';

    function concatenateProperties(source, target) {
        Object.keys(source).forEach(function (property) {
            target[property] = source[property];
        });
    }

    return concatenateProperties;
})(Object);

H5.getFunctionName = (function () {
    'use strict';

    function getFunctionName(fn) {
        var fnString = fn.toString();
        var startIndex = 'function '.length;
        var endIndex = fnString.indexOf('(');

        return fnString.slice(startIndex, endIndex);
    }

    return getFunctionName;
})();
H5.Vectors = (function (Math) {
    'use strict';

    return {
        get: function (pointA_X, pointA_Y, pointB_X, pointB_Y) {
            return {
                x: pointB_X - pointA_X,
                y: pointB_Y - pointA_Y
            };
        },

        magnitude: function (x, y) {
            return Math.sqrt(x * x + y * y);
        },

        squaredMagnitude: function (x, y) {
            return x * x + y * y;
        },

        normalize: function (x, y) {
            var magnitude = this.magnitude(x, y);

            return this.normalizeWithMagnitude(x, y, magnitude);
        },

        normalizeWithMagnitude: function (x, y, magnitude) {
            return {
                x: x / magnitude,
                y: y / magnitude
            };
        },

        normalRight: function (x, y) {
            //noinspection JSSuspiciousNameCombination
            return {
                x: -y,
                y: x
            };
        },

        normalLeft: function (x, y) {
            //noinspection JSSuspiciousNameCombination
            return {
                x: y,
                y: -x
            };
        },

        dotProduct: function (vectorA_X, vectorA_Y, vectorB_X, vectorB_Y) {
            return vectorA_X * vectorB_X + vectorA_Y * vectorB_Y;
        },

        toRadians: function (degrees) {
            return degrees * Math.PI / 180;
        },

        toDegrees: function (radians) {
            return radians * 180 / Math.PI;
        },

        normalizeAngle: function (degree) {//todo: find out what's the right wording? shift, translate, transform, normalise?
            return (degree + 180 + 360) % 360 - 180;
        },

        getX: function (pointX, magnitude, angle) {
            return pointX + magnitude * Math.cos(angle);
        },

        getY: function (pointY, magnitude, angle) {
            return pointY + magnitude * Math.sin(angle);
        },

        getAngle: function (x, y) {
            return Math.atan2(y, x);
        },

        getIntersectionPoint: function (a1_x, a1_y, a2_x, a2_y, b1_x, b1_y, b2_x, b2_y) {
            var denominator = ( b2_y - b1_y) * (a2_x - a1_x) - (b2_x - b1_x) * (a2_y - a1_y);
            var ua = ((b2_x - b1_x) * (a1_y - b1_y) - (b2_y - b1_y) * (a1_x - b1_x)) / denominator;
            return {
                x: a1_x + ua * (a2_x - a1_x),
                y: a1_y + ua * (a2_y - a1_y)
            };
        }
    };
})(Math);

H5.EqTriangles = (function (Math) {
    'use strict';

    /**
     * equilateral triangle formulas:
     *
     * h = Math.sqrt(3) / 2 * a
     * p = 3 * a
     * A = a*a * Math.sqrt(3) / 4
     * R = Math.sqrt(3) / 3 * a
     * r = Math.sqrt(3) / 6 * a
     * r = R / 2
     * angle = 60
     *
     * \----/\
     *  \L / R\   'left' triangle center: (x = a / 2 , y = r)
     *   \/____\  'right' triangle center: (x = a , y = R)
     *
     */
    return {
        radius: function (a) {
            return Math.sqrt(3) / 3 * a;
        },

        inRadius: function (a) {
            return this.radius(a) / 2;
        },

        height: function (a) {
            return Math.sqrt(3) / 2 * a;
        },

        rightX: function (u, v, a) {
            return a + a / 2 * v + a * u;
        },

        rightY: function rightY(u, v, a) {
            return this.radius(a) + this.height(a) * v;
        },
        leftX: function (u, v, a) {
            return a / 2 + a / 2 * v + a * u;
        },

        leftY: function (u, v, a) {
            return this.inRadius(a) + this.height(a) * v;
        }
    };
})(Math);
H5.Strings = (function () {
    'use strict';

    return {
        startsWidth: function (actualString, searchString) {
            return actualString.indexOf(searchString, 0) === 0;
        },

        includes: function (actualString, searchString) {
            return actualString.indexOf(searchString) !== -1;
        }
    };
})();
H5.CallbackCounter = (function () {
    'use strict';

    function CallbackCounter(callback, forcedCount) {
        this.__countForced = forcedCount !== undefined;
        this.counter = forcedCount !== undefined ? forcedCount : 0;
        this.callback = callback;
    }

    CallbackCounter.prototype.register = function () {
        if (!this.__countForced) {
            this.counter++;
        }
        return this.__onProgress.bind(this);
    };

    CallbackCounter.prototype.__onProgress = function () {
        if (--this.counter === 0) {
            this.__onComplete();
        }
    };

    CallbackCounter.prototype.__onComplete = function () {
        this.counter = 0;
        if (this.callback) {
            this.callback();
        }
    };

    return CallbackCounter;
})();
H5.Promise = (function (CallbackCounter) {
    'use strict';

    function Promise(executor) {
        this.__isFulfilled = false;

        if (executor) {
            executor(this.__resolve.bind(this));
        }
    }

    Promise.resolve = function (value) {
        return new Promise(function (resolve) {
            resolve(value);
        });
    };

    Promise.all = function (promises) {
        var promise = new Promise();
        var counter = new CallbackCounter(promise.__resolve.bind(promise), promises.length);
        promises.forEach(function (promise) {
            promise.then(counter.register());
        });
        return promise;
    };

    Promise.race = function (iterable) {
        // todo implement
    };

    Promise.prototype.then = function (callback) {
        this.__callback = callback;

        this.__next = new Promise();

        if (this.__isFulfilled) {
            var promise = this.__callback(this.__argument);
            if (promise instanceof Promise) {
                promise.then(this.__next.__resolve.bind(this.__next));
            } else {
                this.__next.__resolve();
            }
        }

        return this.__next;
    };

    Promise.prototype.__resolve = function (argument) {
        if (this.__isFulfilled) {
            return;
        }

        this.__isFulfilled = true;

        if (this.__callback) {
            var promise = this.__callback(argument);
            if (promise instanceof Promise) {
                promise.then(this.__next.__resolve.bind(this.__next));
            } else {
                this.__next.__resolve();
            }
        } else {
            this.__argument = argument;
        }
    };

    return Promise;
})(H5.CallbackCounter);
H5.calcCantorPairing = (function () {
    'use strict';

    return function (x, y) {
        return (x + y) * (x + y + 1) / 2 + y;
    };
})();
H5.checkAndSet30fps = (function (Math) {
    'use strict';

    function checkAndSet30fps(sceneStorage, stage, shaker) {
        var fpsMean = Math.round(sceneStorage.fpsTotal / sceneStorage.fpsCount);
        var msMean = Math.round(sceneStorage.msTotal / sceneStorage.msCount);
        sceneStorage.fpsTotal = 0;
        sceneStorage.fpsCount = 0;
        sceneStorage.msTotal = 0;
        sceneStorage.msCount = 0;

        sceneStorage.lowPerformance = msMean > 15;
        if (fpsMean < 40) {
            sceneStorage.do30fps = true;
            stage.stage.spriteAnimations.set30fps();
            if (shaker) {
                shaker.__init(true);
            }
        } else {
            sceneStorage.do30fps = false;
            stage.stage.spriteAnimations.set30fps(false);
        }

        return {
            fps: fpsMean,
            ms: msMean
        };
    }

    return checkAndSet30fps;
})(Math);
H5.ValueChecker = (function (Math, isFinite) {
    'use strict';

    function isInteger(value) {
        return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
    }

    function isNoPositiveInteger(value) {
        return !isInteger(value) || value < 0;
    }

    return {
        isInteger: isInteger,
        isNoPositiveInteger: isNoPositiveInteger
    };
})(Math, isFinite);
H5.Stats = (function (Math, Date) {
    'use strict';
    var startTime = Date.now(), previousTime = startTime;
    var ms = 0, msMin = Infinity, msMax = 0;
    var fps = 0, fpsMin = Infinity, fpsMax = 0;
    var frames = 0;

    return {
        getFps: function () {
            return fps;
        },
        getMs: function () {
            return ms;
        },
        start: function () {
            startTime = Date.now();
        },
        end: function () {
            var time = Date.now();

            ms = time - startTime;
            msMin = Math.min(msMin, ms);
            msMax = Math.max(msMax, ms);

            //this.data.ms = ms;
            //this.data.msMin = msMin;
            //this.data.msMax = msMax;

            frames++;

            if (time > previousTime + 1000) {

                fps = Math.round(( frames * 1000 ) / ( time - previousTime ));
                fpsMin = Math.min(fpsMin, fps);
                fpsMax = Math.max(fpsMax, fps);

                //this.data.fps = fps;
                //this.data.fpsMin = fpsMin;
                //this.data.fpsMax = fpsMax;

                previousTime = time;
                frames = 0;
            }
        }
    };
})(Math, Date);
H5.getGamepads = (function (navigator) {
    'use strict';

    function getGamepads() {
        return [];
    }

    return navigator.getGamepads ? navigator.getGamepads.bind(navigator) : getGamepads;
})(window.navigator);
H5.getDevicePixelRatio = (function (window) {
    'use strict';

    var calculatedDevicePixelRatio;
    if ('screen' in window) {
        calculatedDevicePixelRatio = window.screen.deviceXDPI / window.screen.logicalXDPI;
    }
    var devicePixelRatio = window.devicePixelRatio || calculatedDevicePixelRatio || 1;

    return function () {
        return devicePixelRatio;
    };
})(window);
H5.Event = {
    // system events
    RESIZE: 'resize',
    SCREEN_ORIENTATION: 'orientation',
    FULL_SCREEN: 'full_screen',
    KEY_BOARD: 'key_board',
    GAME_PAD: 'game_pad',
    POINTER: 'pointer',
    DEVICE_ORIENTATION: 'device_orientation',
    PAGE_VISIBILITY: 'page_visibility',
    WHEEL: 'wheel',

    TICK_START: 'tick_start',
    TICK_INPUT: 'tick_input',
    TICK_POST_INPUT: 'tick_post_input',
    TICK_MOVE: 'tick_move',
    TICK_COLLISION: 'tick_collision',
    TICK_POST_COLLISION: 'tick_post_collision',
    TICK_POST_POST_COLLISION: 'tick_post_post_collision',
    TICK_CAMERA: 'tick_camera',
    TICK_DRAW: 'tick_draw',
    TICK_END: 'tick_end',

    ANALYTICS: 'analytics',

    // custom events
    PAUSE: 'pause',
    RESUME: 'resume',
    REMOVE_GO_FULL_SCREEN: 'remove_go_full_screen',
    SHOW_GO_FULL_SCREEN: 'show_go_full_screen',
    REMOVE_ROTATE_DEVICE: 'remove_rotate_device',
    SHOW_ROTATE_DEVICE: 'show_rotate_device',
    RESUME_SETTINGS: 'resume_settings'
};
H5.Transition = (function (Math) {
    'use strict';

    function linearTweening(currentTime, startValue, changeInValue, duration) {
        return changeInValue * currentTime / duration + startValue;
    }

    function exponentialEasingInAndOut(currentTime, startValue, changeInValue, duration) {
        if (currentTime == 0) {
            return startValue;
        }
        if (currentTime == duration) {
            return startValue + changeInValue;
        }
        if ((currentTime /= duration / 2) < 1) {
            return changeInValue / 2 * Math.pow(2, 10 * (currentTime - 1)) + startValue;
        }

        return changeInValue / 2 * (-Math.pow(2, -10 * --currentTime) + 2) + startValue;
    }

    function elasticEasingInAndOut(currentTime, startValue, changeInValue, duration) {
        if (currentTime == 0) {
            return startValue;
        }

        if ((currentTime /= duration) == 1) {
            return startValue + changeInValue;
        }

        var period = duration * .3, s = changeInValue < Math.abs(changeInValue) ? period / 4 :
            period / (2 * Math.PI) * Math.asin(changeInValue / changeInValue);

        return changeInValue * Math.pow(2, -10 * currentTime) *
            Math.sin((currentTime * duration - s) * (2 * Math.PI) / period) + changeInValue + startValue;
    }

    function elasticEasingOut(currentTime, startValue, changeInValue, duration) {
        if (currentTime == 0) {
            return startValue;
        }
        if ((currentTime /= duration) == 1) {
            return startValue + changeInValue;
        }
        var period = duration * .3;
        var s;
        if (changeInValue < Math.abs(changeInValue)) {
            s = period / 4;
        } else {
            s = period / (2 * Math.PI) * Math.asin(changeInValue / changeInValue);
        }
        return changeInValue * Math.pow(2, -10 * currentTime) *
            Math.sin((currentTime * duration - s) * (2 * Math.PI) / period) + changeInValue + startValue;
    }

    function quadraticEasingInAndOut(currentTime, startValue, changeInValue, duration) {
        if ((currentTime /= duration / 2) < 1) {
            return changeInValue / 2 * currentTime * currentTime + startValue;
        }

        return -changeInValue / 2 * ((--currentTime) * (currentTime - 2) - 1) + startValue;
    }

    function exponentialEasingIn(currentTime, startValue, changeInValue, duration) {
        if (currentTime != 0) {
            return changeInValue * Math.pow(2, 10 * (currentTime / duration - 1)) + startValue;
        }
        return startValue;
    }

    function exponentialEasingOut(currentTime, startValue, changeInValue, duration) {
        if (currentTime == duration) {
            return startValue + changeInValue;
        } else {
            return changeInValue * (-Math.pow(2, -10 * currentTime / duration) + 1) + startValue;
        }
    }

    function quadraticEasingIn(currentTime, startValue, changeInValue, duration) {
        return changeInValue * (currentTime /= duration) * currentTime + startValue;
    }

    function quadraticEasingOut(currentTime, startValue, changeInValue, duration) {
        return -changeInValue * (currentTime /= duration) * (currentTime - 2) + startValue;
    }

    //    not working :( ... don't copy random shit from the fucking internet
    function quinticEasingOutAndIn(currentTime, startValue, changeInValue, duration) {
        currentTime /= duration / 2;
        return changeInValue / 2 * (--currentTime * currentTime * currentTime * currentTime * currentTime + 1) +
            startValue;
    }

    function sinusoidalEasingOutAndIn(currentTime, startValue, changeInValue, duration) {
        if ((currentTime /= duration / 2) < 1) {
            return changeInValue / 2 * (Math.sin(Math.PI * currentTime / 2) ) + startValue;
        }
        return -changeInValue / 2 * (Math.cos(Math.PI * --currentTime / 2) - 2) + startValue;
    }

    function sinusoidalEasingIn(currentTime, startValue, changeInValue, duration) {
        return -changeInValue / 2 * (Math.cos(Math.PI * currentTime / duration) - 1) + startValue;
    }

    function sinusoidalEasingOut(currentTime, startValue, changeInValue, duration) {
        return changeInValue * Math.sin(currentTime / duration * (Math.PI / 2)) + startValue;
    }

    // sinusoidal easing in/out - accelerating until halfway, then decelerating
    function sinusoidalEasingInAndOut(currentTime, startValue, changeInValue, duration) {
        return -changeInValue / 2 * (Math.cos(Math.PI * currentTime / duration) - 1) + startValue;
    }

    function bouncingEasingOut(currentTime, startValue, changeInValue, duration) {
        if ((currentTime /= duration) < (1 / 2.75)) {
            return changeInValue * (7.5625 * currentTime * currentTime) + startValue;
        } else if (currentTime < (2 / 2.75)) {
            return changeInValue * (7.5625 * (currentTime -= (1.5 / 2.75)) * currentTime + .75) + startValue;
        } else if (currentTime < (2.5 / 2.75)) {
            return changeInValue * (7.5625 * (currentTime -= (2.25 / 2.75)) * currentTime + .9375) + startValue;
        } else {
            return changeInValue * (7.5625 * (currentTime -= (2.625 / 2.75)) * currentTime + .984375) + startValue;
        }
    }

    function easeInBack(currentTime, startValue, changeInValue, duration) {
        return changeInValue * (currentTime /= duration) * currentTime * ((1.70158 + 1) * currentTime - 1.70158) +
            startValue;
    }

    function easeOutBack(currentTime, startValue, changeInValue, duration) {
        return changeInValue *
            ((currentTime = currentTime / duration - 1) * currentTime * ((1.70158 + 1) * currentTime + 1.70158) + 1) +
            startValue;
    }

    function easeInOutBack(currentTime, startValue, changeInValue, duration) {
        var s = 1.70158;
        if ((currentTime /= duration / 2) < 1) {
            return changeInValue / 2 * (currentTime * currentTime * (((s *= (1.525)) + 1) * currentTime - s)) +
                startValue;
        }
        return changeInValue / 2 * ((currentTime -= 2) * currentTime * (((s *= (1.525)) + 1) * currentTime + s) + 2) +
            startValue;
    }

    return {
        LINEAR: linearTweening,

        EASE_OUT_BOUNCE: bouncingEasingOut,

        EASE_OUT_ELASTIC: elasticEasingOut,
        EASE_IN_OUT_ELASTIC: elasticEasingInAndOut,

        EASE_IN_EXPO: exponentialEasingIn,
        EASE_OUT_EXPO: exponentialEasingOut,
        EASE_IN_OUT_EXPO: exponentialEasingInAndOut,

        EASE_IN_QUAD: quadraticEasingIn,
        EASE_OUT_QUAD: quadraticEasingOut,
        EASE_IN_OUT_QUAD: quadraticEasingInAndOut,

        EASE_OUT_IN_QUINT: quinticEasingOutAndIn,

        EASE_IN_SIN: sinusoidalEasingIn,
        EASE_OUT_SIN: sinusoidalEasingOut,
        EASE_OUT_IN_SIN: sinusoidalEasingOutAndIn,
        EASE_IN_OUT_SIN: sinusoidalEasingInAndOut,

        EASE_IN_BACK: easeInBack,
        EASE_OUT_BACK: easeOutBack,
        EASE_IN_OUT_BACK: easeInOutBack
    };
})(Math);
H5.HtmlAudioManager = (function (iterateEntries) {
    'use strict';

    function HtmlAudioManager(audioDict) {
        this.audioDict = audioDict;
    }

    HtmlAudioManager.prototype.get = function (name) {
        return this.audioDict[name];
    };

    HtmlAudioManager.prototype.muteAll = function () {
        iterateEntries(this.audioDict, function (sound) {
            sound.muted = true;
        });
    };

    HtmlAudioManager.prototype.unmuteAll = function () {
        iterateEntries(this.audioDict, function (sound) {
            sound.muted = false;
        });
    };

    HtmlAudioManager.prototype.setMasterVolume = function (value) {
        iterateEntries(this.audioDict, function (sound) {
            sound.volume = value;
        });
    };

    HtmlAudioManager.prototype.onEnded = function (audio, fn, self, once) {
        function extendedCallback() {
            if (once) {
                audio.removeEventListener('ended', extendedCallback);
            }
            if (self) {
                fn.call(self);
            } else {
                fn();
            }
        }

        audio.addEventListener('ended', extendedCallback);
    };

    return HtmlAudioManager;
})(H5.iterateEntries);
H5.HtmlAudioSprite = (function (Array, Transition) {
    'use strict';

    function HtmlAudioTrack(audioElement) {
        this.element = audioElement;
        this.playing = false;

        this.currentInfo = undefined;
        this.currentSound = undefined;
    }

    function AudioNode() {
        this.started = false;
        this.ended = false;
        this.volume = 1;
        this.mute = false;
        this.loop = false;
        this.callback = undefined;
    }

    function HtmlAudioSprite(info, audioElementOrElements, timer, stage) {
        this.info = info;

        if (audioElementOrElements instanceof Array) {
            this.tracks = audioElementOrElements.map(function (audioElem) {
                return new HtmlAudioTrack(audioElem);
            });
        } else {
            this.tracks = [new HtmlAudioTrack(audioElementOrElements)];
        }

        this.timer = timer;
        this.stage = stage;

        this.masterVolume = 1;
    }

    HtmlAudioSprite.prototype.update = function () {
        this.tracks.forEach(function (track) {
            if (!track.playing) {
                return;
            }

            if (track.element.currentTime < track.currentInfo.end) {
                return;
            }

            if (track.currentSound.loop) {
                track.element.currentTime = track.currentInfo.start;
                if (track.currentSound.callback) {
                    track.currentSound.callback();
                }

            } else {
                this.__stop(track);
            }
        }, this);
    };

    HtmlAudioSprite.prototype.__stop = function (track) {
        track.element.pause();
        track.playing = false;
        track.currentSound.ended = true;
        if (track.currentSound.callback) {
            track.currentSound.callback();
        }
    };

    HtmlAudioSprite.prototype.muteAll = function () {
        this.tracks.forEach(function (track) {
            track.element.volume = 0;
            if (track.currentSound) {
                track.currentSound.mute = true;
            }
        });
    };

    HtmlAudioSprite.prototype.unmuteAll = function () {
        this.tracks.forEach(function (track) {
            if (track.playing) {
                track.element.volume = track.currentSound.volume;
                if (track.currentSound) {
                    track.currentSound.mute = false;
                }
            } else {
                track.element.volume = this.masterVolume;
            }
        }, this);
    };

    HtmlAudioSprite.prototype.pauseAll = function () {
        this.tracks.forEach(function (track) {
            if (track.playing) {
                track.element.pause();
            }
        });
    };

    HtmlAudioSprite.prototype.resumeAll = function () {
        this.tracks.forEach(function (track) {
            if (track.playing) {
                track.element.play();
            }
        });
    };

    HtmlAudioSprite.prototype.stopAll = function () {
        this.tracks.forEach(function (track) {
            if (track.playing) {
                this.__stop(track);
            }
        }, this);
    };

    HtmlAudioSprite.prototype.setMasterVolume = function (value) {
        this.masterVolume = value;
        this.tracks.forEach(function (track) {
            if (track.playing) {
                track.currentSound.volume = value;
            }
            track.element.volume = value;
        });
    };

    HtmlAudioSprite.prototype.masterVolumeTo = function (value, duration, callback, self) {
        this.masterVolume = value;
        this.tracks.forEach(function (track) {
            if (track.playing) {
                track.currentSound.volume = value;
            }
            this.stage.audioVolumeTo(track.element, value)
                .setDuration(duration);
        }, this);
        this.timer.in(duration, callback, self);
    };

    var animationMock = {
        isAnimation: false,
        setDuration: returnThis,
        setSpacing: returnThis,
        setLoop: returnThis,
        setCallback: returnThis,
        finish: returnThis
    };

    function returnThis() {
        return this;
    }

    var audioMock = {
        trackAvailable: false,
        stop: function () {
        },
        mute: returnThis,
        unmute: returnThis,
        volumeTo: function () {
            return animationMock;
        },
        setCallback: function (callback, self) {
            if (self) {
                callback.call(self);
            } else {
                callback();
            }
            return this;
        },
        setLoop: returnThis,
        setVolume: returnThis,
        hasEnded: function () {
            return true;
        }
    };

    HtmlAudioSprite.prototype.play = function (name) {
        var self = this;
        var currentTrack;

        function startTrack() {

            self.tracks.some(function (track) {
                if (!track.playing) {
                    currentTrack = track;
                }
                return !track.playing;
            });

            if (!currentTrack) {
                console.log('no audio track available');
                return audioMock;
            }

            currentTrack.element.currentTime = spriteInfo.start;
            currentTrack.element.volume = self.masterVolume;

            if (currentSound.mute) {
                currentTrack.element.volume = 0;
            } else if (currentSound.volume !== 1) {
                currentTrack.element.volume = currentSound.volume;
            }

            currentTrack.element.play();
            currentTrack.playing = true;
            currentTrack.currentInfo = spriteInfo;
            currentTrack.currentSound = currentSound;

            currentSound.started = true;
        }

        var spriteInfo = this.info[name];
        var currentSound = new AudioNode();

        return {
            trackAvailable: true,
            start: function () {
                if (currentSound.started) {
                    return this;
                }
                startTrack();
                return this;
            },
            stop: function () {
                if (currentSound.ended || !currentSound.started) {
                    return this;
                }

                self.__stop(currentTrack);
                return this;
            },
            mute: function () {
                currentSound.mute = true;
                if (!currentSound.ended && currentSound.started) {
                    currentTrack.element.volume = 0;
                }
                return this;
            },
            unmute: function () {
                currentSound.mute = false;
                if (!currentSound.ended && currentSound.started) {
                    currentTrack.element.volume = currentSound.volume;
                }
                return this;
            },
            volumeTo: function (value, duration, callback, that) {
                if (currentSound.ended || !currentSound.started) {
                    return animationMock;
                }

                currentSound.volume = value;
                self.stage.audioVolumeTo(currentTrack.element, value)
                    .setDuration(duration)
                    .setSpacing(Transition.EASE_OUT_EXPO)
                    .setCallback(callback, that);

                return this;
            },
            setCallback: function (callback, self) {
                currentSound.callback = self ? callback.bind(self) : callback;
                return this;
            },
            setLoop: function (loop) {
                currentSound.loop = loop;
                return this;
            },
            setVolume: function (value) {
                if (currentSound.ended) {
                    return this;
                }
                if (!currentSound.started) {
                    currentSound.volume = value;
                    return this;
                }
                currentTrack.element.volume = currentSound.volume = value;
                return this;
            },
            hasEnded: function () {
                return currentSound.ended;
            }
        };
    };

    return HtmlAudioSprite;
})(Array, H5.Transition);
H5.WebAudioSprite = (function (iterateEntries) {
    'use strict';

    function WebAudioSprite(info, buffer, audioContext, timer) {
        this.info = info;
        this.buffer = buffer;
        this.ctx = audioContext;
        this.timer = timer;

        this.masterVolume = 1;
        this.tracks = {};

        this.frameRate = 60;
    }

    WebAudioSprite.prototype.muteAll = function () {
        iterateEntries(this.tracks, this.__mute, this);
    };

    WebAudioSprite.prototype.unmuteAll = function () {
        iterateEntries(this.tracks, this.__unmute, this);
    };

    WebAudioSprite.prototype.pauseAll = function () {
        if (this.ctx.state === 'running') {
            this.ctx.suspend();
        }
    };

    WebAudioSprite.prototype.resumeAll = function () {
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    };

    WebAudioSprite.prototype.stopAll = function () {
        iterateEntries(this.tracks, this.__stop, this);
    };

    WebAudioSprite.prototype.setMasterVolume = function (value) {
        this.masterVolume = value;
        iterateEntries(this.tracks, this.__setVolume.bind(this, value));
    };

    WebAudioSprite.prototype.masterVolumeTo = function (value, duration, callback, self) {
        this.masterVolume = value;
        iterateEntries(this.tracks, this.__volumeTo.bind(this, value, duration, null, null));
        this.timer.in(duration, callback, self);
    };

    WebAudioSprite.prototype.play = function (name) {

        var spriteInfo = this.info[name];
        var currentAudio = new AudioNode();
        var source = this.ctx.createBufferSource();
        var gainNode = this.ctx.createGain();
        var track = new WebAudioTrack(source, gainNode, currentAudio);

        this.tracks[track.id] = track;

        source.onended = this.__ended.bind(this, track);
        source.buffer = this.buffer;
        source.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        function startTrack() {

            if (currentAudio.loop) {
                source.loop = true;
                source.loopStart = spriteInfo.start;
                source.loopEnd = spriteInfo.end;
            }

            if (currentAudio.mute) {
                gainNode.gain.value = 0;
            } else if (currentAudio.volume !== 1) {
                gainNode.gain.value = currentAudio.volume;
            } else if (self.masterVolume !== 1) {
                gainNode.gain.value = self.masterVolume;
            }

            if (currentAudio.loop) {
                source.start(0, spriteInfo.start);
            } else {
                source.start(0, spriteInfo.start, spriteInfo.end - spriteInfo.start);
            }

            currentAudio.started = true;
        }

        var self = this;
        return {
            trackAvailable: true,
            start: function () {
                if (currentAudio.started) {
                    return this;
                }
                startTrack();
                return this;
            },
            stop: function () {
                if (currentAudio.ended || !currentAudio.started) {
                    return this;
                }

                self.__stop(track);
                return this;
            },
            mute: function () {
                self.__mute(track);
                return this;
            },
            unmute: function () {
                self.__unmute(track);
                return this;
            },
            volumeTo: function (value, duration, callback, that) {
                self.__volumeTo(value, duration, callback, that, track);
                return this;
            },
            setCallback: function (callback, self) {
                currentAudio.callback = self ? callback.bind(self) : callback;
                return this;
            },
            setLoop: function (loop) {
                currentAudio.loop = loop;
                return this;
            },
            setVolume: function (value) {
                self.__setVolume(value, track);
                return this;
            },
            hasEnded: function () {
                return currentAudio.ended;
            }
        };
    };

    WebAudioSprite.prototype.__ended = function (track) {
        track.node.ended = true;
        if (track.node.callback) {
            track.node.callback();
        }
        delete this.tracks[track.id];
    };

    WebAudioSprite.prototype.__stop = function (track) {
        track.source.stop();
    };

    WebAudioSprite.prototype.__setVolume = function (value, track) {
        track.node.volume = value;
        if (track.node.started) {
            track.gain.gain.value = value;
        }
    };

    WebAudioSprite.prototype.__mute = function (track) {
        track.node.mute = true;
        if (track.node.started) {
            track.gain.gain.value = 0;
        }
    };

    WebAudioSprite.prototype.__unmute = function (track) {
        track.node.mute = false;
        if (track.node.started) {
            track.gain.gain.value = track.node.volume;
        }
    };

    WebAudioSprite.prototype.__volumeTo = function (value, duration, callback, self, track) {
        track.node.volume = value;
        track.gain.gain.exponentialRampToValueAtTime(value, this.ctx.currentTime + duration / this.frameRate);
        if (callback) {
            this.timer.in(duration, callback, self);
        }
    };

    function AudioNode() {
        this.started = false;
        this.ended = false;
        this.volume = 1;
        this.mute = false;
        this.loop = false;
        this.callback = undefined;
    }

    var idGenerator = 0;

    function WebAudioTrack(source, gain, node) {
        this.id = idGenerator++;
        this.source = source;
        this.gain = gain;
        this.node = node;
    }

    return WebAudioSprite;
})(H5.iterateEntries);
H5.SoundResources = (function (Object, HtmlAudioManager) {
    'use strict';

    function SoundResources(resourceLoader, path, extension) {
        this.resourceLoader = resourceLoader;
        this.path = path || 'sfx/';
        this.extension = extension || '.mp3';
    }

    SoundResources.prototype.createHtmlAudioSounds = function (soundNamesToPathsDict) {
        var dictKeys = Object.keys(soundNamesToPathsDict);

        function toAudioFile(soundKey) {
            return this.resourceLoader.addAudio(this.path + soundNamesToPathsDict[soundKey] + this.extension);
        }

        function filesToDict(soundDict, sound, index) {
            soundDict[soundNamesToPathsDict[dictKeys[index]]] = sound;
            return soundDict;
        }

        var soundDict = dictKeys.map(toAudioFile, this).reduce(filesToDict, {});
        return new HtmlAudioManager(soundDict);
    };

    return SoundResources;
})(Object, H5.HtmlAudioManager);
H5.installHtmlAudioSprite = (function (Event) {
    'use strict';

    function installHtmlAudioSprite(events, audioSprite) {
        events.subscribe(Event.TICK_MOVE, audioSprite.update.bind(audioSprite));

        events.subscribe(Event.PAGE_VISIBILITY, function (hidden) {
            if (hidden) {
                audioSprite.pauseAll();
            } else {
                audioSprite.resumeAll();
            }
        });
    }

    return installHtmlAudioSprite;
})(H5.Event);
H5.installWebAudioSprite = (function (Event) {
    'use strict';

    function installHtmlAudioSprite(events, audioSprite) {
        events.subscribe(Event.PAGE_VISIBILITY, function (hidden) {
            if (hidden) {
                audioSprite.pauseAll();
            } else {
                audioSprite.resumeAll();
            }
        });
    }

    return installHtmlAudioSprite;
})(H5.Event);
H5.LinePath = (function () {
    'use strict';

    function LinePath(startX, startY, endX, endY, vectorX, vectorY, unitVectorX, unitVectorY, length) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.vectorX = vectorX;
        this.vectorY = vectorY;
        this.unitVectorX = unitVectorX;
        this.unitVectorY = unitVectorY;
        this.length = length;
    }

    return LinePath;
})();

H5.CirclePath = (function () {
    'use strict';

    function CirclePath(x, y, radius, startAngle, endAngle) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
    }

    return CirclePath;
})();
H5.BezierCurvePath = (function () {
    'use strict';

    function BezierCurvePath(pointA_x, pointA_y, pointB_x, pointB_y, pointC_x, pointC_y, pointD_x, pointD_y) {
        this.pointA_x = pointA_x;
        this.pointA_y = pointA_y;
        this.pointB_x = pointB_x;
        this.pointB_y = pointB_y;
        this.pointC_x = pointC_x;
        this.pointC_y = pointC_y;
        this.pointD_x = pointD_x;
        this.pointD_y = pointD_y;
    }

    return BezierCurvePath;
})();

H5.Repository = (function (Object) {
    'use strict';

    function Repository() {
        this.dict = {};
    }

    Repository.prototype.add = function (item, fn, dependencies) {
        this.dict[item.id] = {
            fn: fn,
            dependencies: dependencies
        };
    };

    Repository.prototype.has = function (item) {
        return this.dict[item.id] !== undefined;
    };

    Repository.prototype.remove = function (item) {
        delete this.dict[item.id];
    };

    Repository.prototype.call = function (arg1, arg2) {
        var self = this;
        var alreadyCalledMap = {};

        Object.keys(this.dict).forEach(function (key) {
            var wrapper = this.dict[key];
            callItem(key, wrapper.fn, wrapper.dependencies);
        }, this);

        function callItem(id, fn, dependencies) {
            alreadyCalledMap[id] = true;
            if (dependencies) {
                dependencies.forEach(function (dependency) {
                    var dependencyNotAlreadyCalled = dependency && !alreadyCalledMap[dependency.id];
                    if (dependencyNotAlreadyCalled) {
                        var wrapper = self.dict[dependency.id];
                        if (wrapper) {
                            callItem(dependency.id, wrapper.fn, wrapper.dependencies);
                        }
                    }
                });
            }

            fn(arg1, arg2);
        }
    };

    return Repository;
})(Object);
H5.KeyRepository = (function (Object) {
    'use strict';

    function KeyRepository(keysInOrderToCall) {
        this.keys = keysInOrderToCall;
        this.dict = {};
    }

    KeyRepository.prototype.add = function (key, item, fn, dependencies) {
        var wrapper = {
            fn: fn,
            dependencies: dependencies
        };
        var ref = this.dict[item.id];
        if (ref) {
            ref[key] = wrapper;
        } else {
            this.dict[item.id] = {};
            this.dict[item.id][key] = wrapper;
        }
    };

    KeyRepository.prototype.has = function (item) {
        return this.dict[item.id] !== undefined;
    };

    KeyRepository.prototype.remove = function (item) {
        delete this.dict[item.id];
    };

    KeyRepository.prototype.removeKey = function (key, item) {
        delete this.dict[item.id][key];
    };

    KeyRepository.prototype.call = function (arg1, arg2) {
        var self = this;
        var alreadyCalledMap = {};

        Object.keys(this.dict).forEach(function (idKey) {
            var wrapper = this.dict[idKey];
            callWrapper(idKey, wrapper);
        }, this);

        function callWrapper(id, keyWrapper) {
            alreadyCalledMap[id] = true;

            var dependencies = [];
            self.keys.forEach(function (key) {
                if (keyWrapper[key] && keyWrapper[key].dependencies) {
                    dependencies.push.apply(dependencies, keyWrapper[key].dependencies);
                }
            });

            dependencies.forEach(function (dependency) {
                var dependencyNotAlreadyCalled = dependency && !alreadyCalledMap[dependency.id];
                if (dependencyNotAlreadyCalled) {
                    var wrapper = self.dict[dependency.id];
                    if (wrapper) {
                        callWrapper(dependency.id, wrapper);
                    }
                }
            });

            self.keys.forEach(function (key) {
                if (keyWrapper[key]) {
                    keyWrapper[key].fn(arg1, arg2);
                }
            });

        }
    };

    return KeyRepository;
})(Object);
H5.changePath = (function (BezierCurvePath, LinePath, Vectors, CirclePath) {
    'use strict';

    function changePath(path, startX_or_x, startY_or_y, endX_or_radius, endY, p1_x, p1_y, p2_x, p2_y) {

        var curve = path.curve;
        if (curve instanceof LinePath) {
            var vector = Vectors.get(startX_or_x, startY_or_y, endX_or_radius, endY);
            var length = Vectors.magnitude(vector.x, vector.y);
            var unitVector = Vectors.normalize(vector.x, vector.y);

            curve.startX = startX_or_x;
            curve.startY = startY_or_y;
            curve.endX = endX_or_radius;
            curve.endY = endY;
            curve.length = length;
            curve.unitVectorX = unitVector.x;
            curve.unitVectorY = unitVector.y;
            curve.vectorX = vector.x;
            curve.vectorY = vector.y;

        } else if (curve instanceof CirclePath) {
            curve.x = startX_or_x;
            curve.y = startY_or_y;
            curve.radius = endX_or_radius;

        } else if (curve instanceof BezierCurvePath) {
            curve.pointA_x = startX_or_x;
            curve.pointA_y = startY_or_y;
            curve.pointB_x = p1_x;
            curve.pointB_y = p1_y;
            curve.pointC_x = p2_x;
            curve.pointC_y = p2_y;
            curve.pointD_x = endX_or_radius;
            curve.pointD_y = endY;
        }
    }

    return changePath;
})(H5.BezierCurvePath, H5.LinePath, H5.Vectors, H5.CirclePath);
H5.changeCoords = (function () {
    'use strict';

    function changeCoords(drawable, x, y) {
        drawable.x = x;
        drawable.y = y;
    }

    return changeCoords;
})();
H5.changeTouchable = (function () {
    'use strict';

    function changeTouchable(touchable, x, y, width, height) {
        touchable.x = x;
        touchable.y = y;
        touchable.width = width;
        touchable.height = height;
    }

    return changeTouchable;
})();
H5.changeRectangle = (function () {
    'use strict';

    function changeRectangle(rectangle, width, height, lineWidth) {
        rectangle.width = width;
        rectangle.height = height;
        rectangle.lineWidth = lineWidth;
    }

    return changeRectangle;
})();

H5.changeMask = (function () {
    'use strict';

    function changeMask(mask, a_x, a_y, b_x, b_y) {
        mask.x = a_x;
        mask.y = a_y;
        mask.width = b_x - mask.x;
        mask.height = b_y - mask.y;
    }

    return changeMask;
})();

H5.fetchDrawableIntoTouchable = (function (changeTouchable) {
    'use strict';

    function fetchDrawableIntoTouchable(touchable, drawable) {
        changeTouchable(touchable, drawable.getCornerX(), drawable.getCornerY(), drawable.getWidth(),
            drawable.getHeight());
    }

    return fetchDrawableIntoTouchable;
})(H5.changeTouchable);
H5.calcScreenConst = (function (Math) {
    'use strict';

    function calcScreenConst(domain, denominator, numerator) {
        return Math.floor(domain / denominator * (numerator !== undefined ? numerator : 1));
    }

    return calcScreenConst;
})(Math);
H5.add = (function () {
    'use strict';

    function add(fn1, fn2) {
        return function (arg1, arg2) {
            return fn1(arg1, arg2) + fn2(arg1, arg2);
        };
    }

    return add;
})();
H5.changeSign = (function () {
    'use strict';

    function changeSign(fn) {
        return function (arg1, arg2) {
            return -fn(arg1, arg2);
        };
    }

    return changeSign;
})();
H5.subtract = (function () {
    'use strict';

    function subtract(fn1, fn2) {
        return function (arg1, arg2) {
            return fn1(arg1, arg2) - fn2(arg1, arg2);
        };
    }

    return subtract;
})();
H5.multiply = (function () {
    'use strict';

    function multiply(fn, factor) {
        return function (arg1, arg2) {
            return fn(arg1, arg2) * factor;
        };
    }

    return multiply;
})();

H5.zero = (function () {
    'use strict';

    function zero() {
        return 0;
    }

    return zero;
})();
H5.wrap = (function () {
    'use strict';

    function wrap(value_OrObject, optionalObjectKey) {
        if (optionalObjectKey) {
            return function () {
                return value_OrObject[optionalObjectKey];
            };
        }
        return function () {
            return value_OrObject;
        };
    }

    return wrap;
})();

H5.Height = (function (calcScreenConst) {
    'use strict';

    return {
        FULL: function (height) {
            return height;
        },
        FIFTH: function (height) {
            return calcScreenConst(height, 5);
        },
        FOUR_FIFTH: function (height) {
            return calcScreenConst(height, 5, 4);
        },
        HALF: function (screenHeight) {
            return calcScreenConst(screenHeight, 2);
        },
        QUARTER: function (screenHeight) {
            return calcScreenConst(screenHeight, 4);
        },
        THIRD: function (height) {
            return calcScreenConst(height, 3);
        },
        THREE_FIFTH: function (height) {
            return calcScreenConst(height, 5, 3);
        },
        THREE_QUARTER: function (height) {
            return calcScreenConst(height, 4, 3);
        },
        TWO_FIFTH: function (height) {
            return calcScreenConst(height, 5, 2);
        },
        TWO_THIRD: function (height) {
            return calcScreenConst(height, 3, 2);
        },
        get: function (denominator, numerator) {
            return function (height) {
                return calcScreenConst(height, denominator, numerator);
            };
        }
    };
})(H5.calcScreenConst);
H5.Width = (function (calcScreenConst) {
    'use strict';

    return {
        FULL: function (width) {
            return width;
        },
        HALF: function (width) {
            return calcScreenConst(width, 2);
        },
        QUARTER: function (width) {
            return calcScreenConst(width, 4);
        },
        THIRD: function (width) {
            return calcScreenConst(width, 3);
        },
        THREE_QUARTER: function (width) {
            return calcScreenConst(width, 4, 3);
        },
        TWO_THIRD: function (width) {
            return calcScreenConst(width, 3, 2);
        },
        get: function (denominator, numerator) {
            return function (width) {
                return calcScreenConst(width, denominator, numerator);
            };
        }
    };
})(H5.calcScreenConst);

H5.Font = (function (calcScreenConst) {
    'use strict';

    return {
        _5: function (width, height) {
            return calcScreenConst(height, 5);
        },
        _10: function (width, height) {
            return calcScreenConst(height, 10);
        },
        _15: function (width, height) {
            return calcScreenConst(height, 15);
        },
        _20: function (width, height) {
            return calcScreenConst(height, 20);
        },
        _25: function (width, height) {
            return calcScreenConst(height, 25);
        },
        _30: function (width, height) {
            return calcScreenConst(height, 30);
        },
        _35: function (width, height) {
            return calcScreenConst(height, 35);
        },
        _40: function (width, height) {
            return calcScreenConst(height, 40);
        },
        _60: function (width, height) {
            return calcScreenConst(height, 60);
        },
        get: function (denominator, numerator) {
            return function (width, height) {
                return calcScreenConst(height, denominator, numerator);
            };
        }
    };
})(H5.calcScreenConst);
H5.RectangleMask = (function () {
    'use strict';

    function RectangleMask(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    return RectangleMask;
})();

H5.ScreenShaker = (function (Math, Object, calcScreenConst) {
    'use strict';

    function ScreenShaker(device) {
        this.shaker = {};
        this.device = device;
        this.__init();
    }

    ScreenShaker.prototype.__init = function (is30fps) {
        this.shaking = false;
        this.smallShaking = false;
        this.bigShaking = false;

        this.time = 0;
        this.duration = is30fps ? 30 : 60;

        this.__150 = calcScreenConst(this.device.height, 480, 150);
        this.__50 = calcScreenConst(this.device.height, 480, 50);
        this.__25 = calcScreenConst(this.device.height, 480, 25);
        this.__5 = calcScreenConst(this.device.height, 480, 5);
    };

    ScreenShaker.prototype.startBigShake = function () {
        if (this.shaking) {
            if (this.smallShaking) {
                this.smallShaking = false;
            }

            Object.keys(this.shaker).forEach(function (key) {
                var item = this.shaker[key];
                if (item._startValueX !== undefined) {
                    item.x = item._startValueX;
                }
            }, this);

            if (this.bigShaking) {
                Object.keys(this.shaker).forEach(function (key) {
                    var item = this.shaker[key];
                    if (item._startValueY !== undefined) {
                        item.y = item._startValueY;
                    }
                }, this);
            }
        }

        this.shaking = true;
        this.time = 0;
        this.bigShaking = true;
    };

    ScreenShaker.prototype.startSmallShake = function () {
        if (this.shaking) {
            if (this.bigShaking) {
                return;
            }
            Object.keys(this.shaker).forEach(function (key) {
                var item = this.shaker[key];
                if (item._startValueX !== undefined) {
                    item.x = item._startValueX;
                }
            }, this);
        }

        this.shaking = true;
        this.time = 0;
        this.smallShaking = true;
    };

    ScreenShaker.prototype.update = function () {
        if (this.shaking) {
            if (this.smallShaking) {
                var offSet = elasticOutShake(this.time, this.duration, this.__25, this.__5);

                Object.keys(this.shaker).forEach(function (key) {
                    var item = this.shaker[key];
                    if (this.time === 0 || item._startValueX === undefined) {
                        item._startValueX = item.x;
                    }

                    if (offSet !== 0) {
                        item.x = item._startValueX + offSet;
                    } else {
                        item.x = item._startValueX;
                    }
                }, this);

            } else if (this.bigShaking) {
                var amplitude = this.__150;
                var period = this.__5;
                var offSetX = elasticOutShake(this.time, this.duration, amplitude - this.__50, period + this.__5);
                var offSetY = elasticOutShake(this.time, this.duration, amplitude, period);

                Object.keys(this.shaker).forEach(function (key) {
                    var item = this.shaker[key];
                    if (this.time === 0 || item._startValueX === undefined) {
                        item._startValueX = item.x;
                        item._startValueY = item.y;
                    }
                    if (offSetX !== 0) {
                        item.x = item._startValueX + offSetX;
                    } else {
                        item.x = item._startValueX;
                    }
                    if (offSetY !== 0) {
                        item.y = item._startValueY + offSetY;
                    } else {
                        item.y = item._startValueY;
                    }
                }, this);
            }

            this.time++;
            if (this.time >= this.duration) {
                this.time = 0;
                this.shaking = false;

                Object.keys(this.shaker).forEach(function (key) {
                    var item = this.shaker[key];
                    item.x = item._startValueX;
                    delete item._startValueX;

                    if (this.bigShaking) {
                        item.y = item._startValueY;
                        delete item._startValueY;
                    }
                }, this);

                this.smallShaking = false;
                this.bigShaking = false;
            }
        }
    };

    function elasticOutShake(currentTime, duration, amplitude, period) {
        if (currentTime === 0 || (currentTime /= duration) === 1) {
            return 0;
        }

        return Math.floor(
            amplitude * Math.pow(2, -10 * currentTime) * Math.sin((currentTime * duration) * (2 * Math.PI) / period));
    }

    ScreenShaker.prototype.add = function (drawable) {
        this.shaker[drawable.id] = drawable;
    };

    ScreenShaker.prototype.remove = function (drawable) {
        delete this.shaker[drawable.id];
    };

    ScreenShaker.prototype.resize = function (event) {
        this.bigShaking = false;
        this.smallShaking = false;
        this.shaking = false;
        this.time = 0;

        var self = this;
        Object.keys(this.shaker).forEach(function (key) {
            var item = self.shaker[key];
            if (item._startValueX) {
                item._startValueX = item.x;
            }
        });

        this.__150 = calcScreenConst(event.height, 480, 150);
        this.__50 = calcScreenConst(event.height, 480, 50);
        this.__25 = calcScreenConst(event.height, 480, 25);
        this.__5 = calcScreenConst(event.height, 480, 5);
    };

    ScreenShaker.prototype.reset = function (is30fps) {
        this.shaker = {};
        this.__init(is30fps);
    };

    return ScreenShaker;
})(Math, Object, H5.calcScreenConst);
H5.FixRezScreenShaker = (function (Math, Object) {
    'use strict';

    function FixRezScreenShaker() {
        this.shaker = {};
        this.__init();
    }

    FixRezScreenShaker.prototype.__init = function () {
        this.shaking = false;
        this.smallShaking = false;
        this.bigShaking = false;

        this.time = 0;
        this.duration = 30;

        this.__150 = 150;
        this.__50 = 50;
        this.__25 = 25;
        this.__5 = 5;
    };

    FixRezScreenShaker.prototype.startBigShake = function () {
        if (this.shaking) {
            if (this.smallShaking) {
                this.smallShaking = false;
            }

            Object.keys(this.shaker).forEach(function (key) {
                var item = this.shaker[key];
                if (item._startValueX !== undefined) {
                    item.x = item._startValueX;
                }
            }, this);

            if (this.bigShaking) {
                Object.keys(this.shaker).forEach(function (key) {
                    var item = this.shaker[key];
                    if (item._startValueY !== undefined) {
                        item.y = item._startValueY;
                    }
                }, this);
            }
        }

        this.shaking = true;
        this.time = 0;
        this.bigShaking = true;
    };

    FixRezScreenShaker.prototype.startSmallShake = function () {
        if (this.shaking) {
            if (this.bigShaking) {
                return;
            }
            Object.keys(this.shaker).forEach(function (key) {
                var item = this.shaker[key];
                if (item._startValueX !== undefined) {
                    item.x = item._startValueX;
                }
            }, this);
        }

        this.shaking = true;
        this.time = 0;
        this.smallShaking = true;
    };

    FixRezScreenShaker.prototype.update = function () {
        if (this.shaking) {
            if (this.smallShaking) {
                var offSet = elasticOutShake(this.time, this.duration, this.__25, this.__5);

                Object.keys(this.shaker).forEach(function (key) {
                    var item = this.shaker[key];
                    if (this.time === 0 || item._startValueX === undefined) {
                        item._startValueX = item.x;
                    }

                    if (offSet !== 0) {
                        item.x = item._startValueX + offSet;
                    } else {
                        item.x = item._startValueX;
                    }
                }, this);

            } else if (this.bigShaking) {
                var amplitude = this.__150;
                var period = this.__5;
                var offSetX = elasticOutShake(this.time, this.duration, amplitude - this.__25, period + this.__5);
                var offSetY = elasticOutShake(this.time, this.duration, amplitude, period);

                Object.keys(this.shaker).forEach(function (key) {
                    var item = this.shaker[key];
                    if (this.time === 0 || item._startValueX === undefined) {
                        item._startValueX = item.x;
                        item._startValueY = item.y;
                    }
                    if (offSetX !== 0) {
                        item.x = item._startValueX + offSetX;
                    } else {
                        item.x = item._startValueX;
                    }
                    if (offSetY !== 0) {
                        item.y = item._startValueY + offSetY;
                    } else {
                        item.y = item._startValueY;
                    }
                }, this);
            }

            this.time++;
            if (this.time >= this.duration) {
                this.time = 0;
                this.shaking = false;

                Object.keys(this.shaker).forEach(function (key) {
                    var item = this.shaker[key];
                    item.x = item._startValueX;
                    delete item._startValueX;

                    if (this.bigShaking) {
                        item.y = item._startValueY;
                        delete item._startValueY;
                    }
                }, this);

                this.smallShaking = false;
                this.bigShaking = false;
            }
        }
    };

    function elasticOutShake(currentTime, duration, amplitude, period) {
        if (currentTime === 0 || (currentTime /= duration) === 1) {
            return 0;
        }

        return Math.floor(
            amplitude * Math.pow(2, -10 * currentTime) * Math.sin((currentTime * duration) * (2 * Math.PI) / period));
    }

    FixRezScreenShaker.prototype.add = function (drawable) {
        this.shaker[drawable.id] = drawable;
    };

    FixRezScreenShaker.prototype.remove = function (drawable) {
        delete this.shaker[drawable.id];
    };

    FixRezScreenShaker.prototype.reset = function (is30fps) {
        this.shaker = {};
        this.__init(is30fps);
    };

    return FixRezScreenShaker;
})(Math, Object);
H5.UniversalTranslator = (function (defaultLanguage, Repository) {
    'use strict';

    function UniversalTranslator(locales) {
        this.locales = locales;
        this.defaultLanguageCode = defaultLanguage;
        this.language = defaultLanguage ? defaultLanguage.substring(0, 2) : 'en';

        if (!this.locales[this.language]) {
            this.language = 'en';
        }

        this.repo = new Repository();
    }

    UniversalTranslator.prototype.setLanguage = function (languageCode) {
        this.language = languageCode;
        this.repo.call(this);
    };

    UniversalTranslator.prototype.getLanguages = function () {
        var languages = [];
        Object.keys(this.locales).forEach(function (language) {
            languages.push({
                language: language,
                name: this.locales[language].display_name
            });
        }, this);
        return languages;
    };

    UniversalTranslator.prototype.get = function (domainKey, msgKey) {
        return this.locales[this.language][domainKey][msgKey];
    };

    UniversalTranslator.prototype.add = function (idObj, msgObj, ctxKey, msgKey) {
        this.repo.add(idObj, function (messages) {
            msgObj.msg = messages.get(ctxKey, msgKey);
        });
    };

    UniversalTranslator.prototype.remove = function (idObj) {
        this.repo.remove(idObj);
    };

    UniversalTranslator.prototype.resetStorage = function () {
        this.repo = new Repository();
    };

    return UniversalTranslator;
})(window.navigator.language || window.navigator.userLanguage, H5.Repository);
H5.addFontToDOM = (function (document) {
    'use strict';

    return function (fonts) {
        var styleNode = document.createElement('style');
        styleNode.type = 'text/css';

        var styleText = '';
        fonts.forEach(function (font) {
            styleText += '@font-face{';
            styleText += 'font-family:' + font.name + ';';
            styleText += 'src:url(' + font.url + ')format(\'woff\');';
            styleText += '} ';
        });

        styleNode.innerHTML = styleText;
        document.head.appendChild(styleNode);
    };

})(document);
H5.lclStorage = (function (window) {
    'use strict';

    var lclStorage;
    try {
        lclStorage = window.localStorage;
    } catch (e) {
        lclStorage = {
            dict: {},
            getItem: function (id) {
                return this.dict[id];
            },
            setItem: function (id, value) {
                this.dict[id] = value;
            },
            clear: function () {
                this.dict = {};
            },
            removeItem: function (id) {
                delete this.dict[id];
            }
        };
    }

    return lclStorage;
})(window);
H5.Persistence = (function (localStorage, parseInt, JSON) {
    'use strict';

    function loadBoolean(key) {
        return localStorage.getItem(key) == 'true';
    }

    function loadInteger(key) {
        var value = localStorage.getItem(key);
        if (value == null) {
            return 0;
        }
        return parseInt(value);
    }

    function loadObject(key) {
        var data = localStorage.getItem(key);
        if (data == null) {
            return undefined;
        }
        return JSON.parse(data);
    }

    function loadString(key) {
        var value = localStorage.getItem(key);
        if (value == null) {
            return '';
        }
        return value;
    }

    function saveObject(key, object) {
        localStorage.setItem(key, JSON.stringify(object));
    }

    return {
        loadBoolean: loadBoolean,
        loadInteger: loadInteger,
        loadObject: loadObject,
        loadString: loadString,
        saveObject: saveObject
    };

})(H5.lclStorage, parseInt, JSON);
H5.Device = (function (window, Math) {
    'use strict';

    function Device(userAgent, width, height, devicePixelRatio, screenWidth, screenHeight) {
        this.userAgent = userAgent;
        this.isFirefox = /firefox/i.test(userAgent);
        this.isIE = /trident/i.test(userAgent);
        this.isEdge = /edge/i.test(userAgent);
        this.isMobile = /mobile/i.test(userAgent);
        this.width = Math.floor(width * devicePixelRatio);
        this.height = Math.floor(height * devicePixelRatio);
        this.cssWidth = width;
        this.cssHeight = height;
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.devicePixelRatio = devicePixelRatio;
    }

    return Device;
})(window, Math);
H5.FullScreenController = (function (document, navigator) {
    'use strict';

    function FullScreenController(screen) {
        this.screen = screen;

        this.isSupported = document.fullscreenEnabled || document.webkitFullscreenEnabled ||
            document.mozFullScreenEnabled || document.msFullscreenEnabled;
    }

    FullScreenController.prototype.request = function () {
        if (this.screen.requestFullscreen) {
            this.screen.requestFullscreen();
        } else if (this.screen.webkitRequestFullscreen) {
            this.screen.webkitRequestFullscreen();
        } else if (this.screen.mozRequestFullScreen) {
            this.screen.mozRequestFullScreen();
        } else if (this.screen.msRequestFullscreen) {
            this.screen.msRequestFullscreen();
        }
        return this.isFullScreen();
    };

    FullScreenController.prototype.isFullScreen = function () {
        return (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement ||
            document.msFullscreenElement || navigator.standalone) != null;
    };

    FullScreenController.prototype.__isSupported = function () {
        return this.isSupported;
    };

    FullScreenController.prototype.exit = function () {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }

        return !this.isFullScreen();
    };

    return FullScreenController;
})(window.document, window.navigator);
H5.OrientationLock = (function (screen) {
    'use strict';

    function lock(orientation) {
        if (!screen) {
            return false;
        }

        if ('orientation' in screen && 'angle' in screen.orientation) {
            return screen.orientation.lock(orientation);
        } else { // old API version
            if (screen.lockOrientation) {
                return screen.lockOrientation(orientation);
            } else if (screen.msLockOrientation) {
                return screen.msLockOrientation(orientation);
            } else if (screen.mozLockOrientation) {
                return screen.mozLockOrientation(orientation);
            }
        }
        return false;
    }

    function unlock() {
        if (!screen) {
            return false;
        }

        if ('orientation' in screen && 'angle' in screen.orientation) {
            return screen.orientation.unlock();
        } else { // old API version
            if (screen.unlockOrientation) {
                return screen.unlockOrientation();
            } else if (screen.msUnlockOrientation) {
                return screen.msUnlockOrientation();
            } else if (screen.mozUnlockOrientation) {
                return screen.mozUnlockOrientation();
            }
        }
        return false;
    }

    return {
        lock: lock,
        unlock: unlock
    };
})(window.screen);
H5.isHit = (function () {
    'use strict';

    function isHit(pointer, rect) {
        return pointer.x > rect.getCornerX() && pointer.x < rect.getEndX() && pointer.y > rect.getCornerY() &&
            pointer.y < rect.getEndY();
    }

    return isHit;
})();
H5.GamePadAxis = {
    LEFT_STICK_X: 0,
    LEFT_STICK_Y: 1,
    RIGHT_STICK_X: 2,
    RIGHT_STICK_Y: 3
};
H5.GamePadButton = {
    A: 0,
    B: 1,
    X: 2,
    Y: 3,
    LEFT_BUMPER: 4,
    RIGHT_BUMPER: 5,
    LEFT_TRIGGER: 6,
    RIGHT_TRIGGER: 7,
    BACK: 8,
    START: 9,
    LEFT_STICK: 10,
    RIGHT_STICK: 11,
    D_PAD_UP: 12,
    D_PAD_DOWN: 13,
    D_PAD_LEFT: 14,
    D_PAD_RIGHT: 15,
    GUIDE: 16
};
H5.GamePad = (function (Button, Axis) {
    'use strict';

    function GamePad(index) {
        this.index = index;
        this.lastUpdate = 0;
    }

    GamePad.prototype.update = function (gamepads) {
        var pad = gamepads[this.index];

        if (!pad) {
            console.log('error: gamepad + ' + this.index + ' + not found');
            return;
        }

        if (pad.timestamp > this.lastUpdate) {
            this.buttons = pad.buttons;
            this.axes = pad.axes;
            this.lastUpdate = pad.timestamp;

            this.mapping = pad.mapping;
            this.connected = pad.connected;
            this.id = pad.id;

            this.profile = pad.profile; // non standard tvOS/iOS

            return true;
        }
        return false;
    };

    GamePad.prototype.getLeftStickXAxis = function () {
        return this.axes[Axis.LEFT_STICK_X];
    };

    GamePad.prototype.getLeftStickYAxis = function () {
        return this.axes[Axis.LEFT_STICK_Y];
    };

    GamePad.prototype.getRightStickXAxis = function () {
        return this.axes[Axis.RIGHT_STICK_X];
    };

    GamePad.prototype.getRightStickYAxis = function () {
        return this.axes[Axis.RIGHT_STICK_Y];
    };

    GamePad.prototype.isRightTriggerPressed = function () {
        return this.isPressed(Button.RIGHT_TRIGGER);
    };

    GamePad.prototype.isAPressed = function () {
        return this.isPressed(Button.A);
    };

    GamePad.prototype.isBPressed = function () {
        return this.isPressed(Button.B);
    };

    GamePad.prototype.isXPressed = function () {
        return this.isPressed(Button.X);
    };

    GamePad.prototype.isYPressed = function () {
        return this.isPressed(Button.Y);
    };

    GamePad.prototype.isRightBumperPressed = function () {
        return this.isPressed(Button.RIGHT_BUMPER);
    };

    GamePad.prototype.isLeftBumperPressed = function () {
        return this.isPressed(Button.LEFT_BUMPER);
    };

    GamePad.prototype.isStartPressed = function () {
        return this.isPressed(Button.START);
    };

    GamePad.prototype.isDPadUpPressed = function () {
        return this.isPressed(Button.D_PAD_UP);
    };

    GamePad.prototype.isDPadRightPressed = function () {
        return this.isPressed(Button.D_PAD_RIGHT);
    };

    GamePad.prototype.isDPadDownPressed = function () {
        return this.isPressed(Button.D_PAD_DOWN);
    };

    GamePad.prototype.isDPadLeftPressed = function () {
        return this.isPressed(Button.D_PAD_LEFT);
    };

    GamePad.prototype.isPressed = function (button) {
        var btn = this.buttons[button];
        return btn && btn.pressed;
    };

    return GamePad;
})(H5.GamePadButton, H5.GamePadAxis);
H5.Key = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    ENTER: 13,
    SPACE: 32,
    CTRL: 17,
    ALT: 18,
    ESC: 27,

    EQUALS: 187,
    MINUS: 189,

    W: 87,
    A: 65,
    S: 83,
    D: 68,
    Z: 90,
    Q: 81
};
H5.WiiUGamePad = (function () {
    'use strict';

    function WiiUGamePad(gamepad, state) {
        this.gamepad = gamepad;
        this.state = state;
    }

    WiiUGamePad.prototype.update = function () {
        this.state = this.gamepad.update();
        return this.state.isEnabled == 1 && this.state.isDataValid == 1;
    };

    WiiUGamePad.prototype.__isButtonPressed = function (flag) {
        return this.state.hold & flag;
    };

    WiiUGamePad.prototype.isAPressed = function () {
        return this.__isButtonPressed(WiiUButton.A);
    };

    var WiiUButton = {
        CONTROL_PAD_UP: 0x00000200,
        CONTROL_PAD_DOWN: 0x00000100,
        CONTROL_PAD_LEFT: 0x00000800,
        CONTROL_PAD_RIGHT: 0x00000400,
        A: 0x00008000,
        B: 0x00004000,
        X: 0x00002000,
        Y: 0x00001000,
        L: 0x00000020,
        R: 0x00000010,
        ZL: 0x00000080,
        ZR: 0x00000040,
        MINUS: 0x00000004,
        PLUS: 0x00000008,
        L_STICK_UP: 0x10000000,
        L_STICK_DOWN: 0x08000000,
        L_STICK_LEFT: 0x40000000,
        L_STICK_RIGHT: 0x20000000,
        R_STICK_UP: 0x01000000,
        R_STICK_DOWN: 0x00800000,
        R_STICK_LEFT: 0x04000000,
        R_STICK_RIGHT: 0x02000000,
        L_STICK: 0x00040000,
        R_STICK: 0x00020000
    };

    return WiiUGamePad;
})();
H5.KeyHandler = (function (Event) {
    'use strict';

    function KeyHandler(events) {
        this.events = events;
        this.pressedKeys = {
            isPressed: function (code) {
                return this[code];
            }
        };
        this.changed = false;
    }

    KeyHandler.prototype.keyDown = function (event) {
        event.preventDefault();
        this.pressedKeys[event.keyCode] = true;
        this.changed = true;
    };

    KeyHandler.prototype.keyUp = function (event) {
        event.preventDefault();
        delete this.pressedKeys[event.keyCode];
        this.changed = true;
    };

    KeyHandler.prototype.update = function () {
        if (this.changed) {
            this.events.fireSync(Event.KEY_BOARD, this.pressedKeys);
            this.changed = false;
        }
    };

    return KeyHandler;
})(H5.Event);
H5.WheelHandler = (function (Event) {
    'use strict';

    function WheelHandler(events) {
        this.events = events;

        this.__changed = false;
        this.__current = null;
    }

    WheelHandler.prototype.rotation = function (event) {
        event.preventDefault();

        this.__current = event;
        this.__changed = true;
    };

    WheelHandler.prototype.update = function () {
        if (this.__changed) {
            this.events.fireSync(Event.WHEEL, this.__current);
            this.__changed = false;
        }
    };

    return WheelHandler;
})(H5.Event);
H5.GamePadHandler = (function (GamePad, Event, getGamepads) {
    'use strict';

    function GamePadHandler(events) {
        this.events = events;
        this.gamePads = [];
    }

    GamePadHandler.prototype.connect = function (event) {
        this.gamePads.push(new GamePad(event.gamepad.index));
    };

    //todo rework
    GamePadHandler.prototype.detect = function () {
        var pads = getGamepads();

        for (var i = 0; i < pads.length; i++) {
            var probablePad = pads[i];
            if (!probablePad) {
                continue;
            }

            this.gamePads.push(new GamePad(probablePad.index));
        }
    };

    GamePadHandler.prototype.shouldDetect = function () {
        //todo rework
        return this.gamePads.length < 1;
    };

    GamePadHandler.prototype.disconnect = function (event) {
        //todo implement
    };

    GamePadHandler.prototype.update = function () {
        // todo rework
        if (this.shouldDetect()) {
            this.detect();
        }

        var gamePads = getGamepads();
        this.gamePads.forEach(function (gamePad) {
            if (gamePad.update(gamePads)) {
                this.events.fireSync(Event.GAME_PAD, gamePad);
            }
        }, this);
    };

    return GamePadHandler;

})(H5.GamePad, H5.Event, H5.getGamepads);
H5.PointerHandler = (function (Event, Object, Math) {
    'use strict';

    function PointerHandler(events, device) {
        this.events = events;
        this.device = device;
        this.activePointers = {};
        this.changed = false;
        this.pendingDeletes = [];
    }

    var Pointer = {
        DOWN: 'down',
        MOVE: 'move',
        UP: 'up'
    };

    PointerHandler.prototype.pointerDown = function (event) {
        event.preventDefault();
        this.activePointers[event.pointerId] = {
            id: event.pointerId,
            x: event.clientX,
            y: event.clientY,
            changed: true,
            type: Pointer.DOWN
        };
        this.changed = true;
    };

    PointerHandler.prototype.pointerMove = function (event) {
        event.preventDefault();
        var current = this.activePointers[event.pointerId];
        if (current) {
            var downButNotSameTick = current.type == Pointer.DOWN && !current.changed;
            if (downButNotSameTick || current.type == Pointer.MOVE) {
                current.x = event.clientX;
                current.y = event.clientY;
                current.changed = true;
                current.type = Pointer.MOVE;
                this.changed = true;
            }
        }
    };

    PointerHandler.prototype.pointerUp = function (event) {
        event.preventDefault();
        var current = this.activePointers[event.pointerId];
        if (current) {
            current.x = event.clientX;
            current.y = event.clientY;
            current.changed = true;
            current.type = Pointer.UP;
            this.changed = true;
            this.pendingDeletes.push(current);
        }
    };

    PointerHandler.prototype.pointerCancel = function (event) {
        this.pointerUp(event);
    };

    PointerHandler.prototype.mouseDown = function (event) {
        event.preventDefault();
        this.activePointers['mouse'] = {
            id: 'mouse',
            x: event.clientX,
            y: event.clientY,
            changed: true,
            type: Pointer.DOWN
        };
        this.changed = true;
    };

    PointerHandler.prototype.mouseMove = function (event) {
        event.preventDefault();
        var current = this.activePointers['mouse'];
        if (current) {
            var downButNotSameTick = current.type == Pointer.DOWN && !current.changed;
            if (downButNotSameTick || current.type == Pointer.MOVE) {
                current.x = event.clientX;
                current.y = event.clientY;
                current.changed = true;
                current.type = Pointer.MOVE;
                this.changed = true;
            }
        }
    };

    PointerHandler.prototype.mouseUp = function (event) {
        event.preventDefault();
        var current = this.activePointers['mouse'];
        if (current) {
            current.x = event.clientX;
            current.y = event.clientY;
            current.changed = true;
            current.type = Pointer.UP;
            this.changed = true;
            this.pendingDeletes.push(current);
        }
    };

    PointerHandler.prototype.mouseCancel = function (event) {
        this.mouseUp(event);
    };

    PointerHandler.prototype.touchStart = function (event) {
        event.preventDefault();

        var touches = event.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            this.activePointers[touches[i].identifier] = {
                id: touches[i].identifier,
                x: touches[i].clientX,
                y: touches[i].clientY,
                changed: true,
                type: Pointer.DOWN
            };
            this.changed = true;
        }
    };

    PointerHandler.prototype.touchMove = function (event) {
        event.preventDefault();
        var touches = event.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            var ref = touches[i];
            var current = this.activePointers[ref.identifier];
            current.x = ref.clientX;
            current.y = ref.clientY;
            current.changed = true;
            current.type = Pointer.MOVE;
            this.changed = true;
        }
    };

    PointerHandler.prototype.touchEnd = function (event) {
        event.preventDefault();
        var touches = event.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            var ref = touches[i];
            var current = this.activePointers[ref.identifier];
            current.x = ref.clientX;
            current.y = ref.clientY;
            current.changed = true;
            current.type = Pointer.UP;
            this.changed = true;
            this.pendingDeletes.push(current);
        }
    };

    PointerHandler.prototype.touchCancel = function (event) {
        this.touchEnd(event);
    };

    PointerHandler.prototype.update = function () {
        if (this.changed) {
            Object.keys(this.activePointers).forEach(function (pointerId) {
                var pointer = this.activePointers[pointerId];
                if (pointer.changed) {
                    if (this.device.screenScale) {
                        pointer.x = Math.floor(pointer.x / this.device.screenScale);
                        pointer.y = Math.floor(pointer.y / this.device.screenScale);
                    }
                    if (this.device.devicePixelRatio > 1) {
                        pointer.x = Math.floor(pointer.x * this.device.devicePixelRatio);
                        pointer.y = Math.floor(pointer.y * this.device.devicePixelRatio);
                    }
                    this.events.fireSync(Event.POINTER, pointer);
                    pointer.changed = false;
                }
            }, this);
            this.changed = false;
        }

        this.pendingDeletes.forEach(function (pointer) {
            delete this.activePointers[pointer.id];
        }, this);

        while (this.pendingDeletes.length > 0) {
            this.pendingDeletes.pop();
        }
    };

    return PointerHandler;
})(H5.Event, Object, Math);
H5.Taps = (function (isHit, iterateSomeEntries, iterateEntries) {
    'use strict';

    function Taps() {
        this.elements = {};
        this.disabled = {};
    }

    Taps.prototype.inputChanged = function (pointer) {
        if (pointer.type == 'move' || pointer.type == 'up') {
            return;
        }
        iterateSomeEntries(this.elements, function (elem) {
            if (isHit(pointer, elem.touchable)) {
                elem.callback();
                return true;
            }
            return false;
        }, this);
    };

    Taps.prototype.add = function (touchable, callback) {
        this.elements[touchable.id] = {
            touchable: touchable,
            callback: callback
        };
    };

    Taps.prototype.remove = function (touchable) {
        delete this.elements[touchable.id];
        delete this.disabled[touchable.id];
    };

    Taps.prototype.disable = function (touchable) {
        this.disabled[touchable.id] = this.elements[touchable.id];
        delete this.elements[touchable.id];
    };

    Taps.prototype.disableAll = function () {
        iterateEntries(this.elements, function (wrapper, id) {
            this.disabled[id] = wrapper;
            delete this.elements[id];
        }, this);
    };

    Taps.prototype.enable = function (touchable) {
        this.elements[touchable.id] = this.disabled[touchable.id];
        delete this.disabled[touchable.id];
    };

    Taps.prototype.enableAll = function () {
        iterateEntries(this.disabled, function (wrapper, id) {
            this.elements[id] = wrapper;
            delete this.disabled[id];
        }, this);
    };

    return Taps;
})(H5.isHit, H5.iterateSomeEntries, H5.iterateEntries);
H5.measureText = (function () {
    'use strict';

    function measureText(ctx, text) {

        if (text.alpha || text.alpha === 0) {
            ctx.globalAlpha = text.alpha;
        }

        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillStyle = text.color;
        ctx.font = text.size + 'px ' + text.fontFamily;

        //        if (text.rotation) {
        //            ctx.translate(elem.x, elem.y);
        //            ctx.rotate(text.rotation);
        //            ctx.translate(-elem.x, -elem.y);
        //        }

        var textMetrics = ctx.measureText(text.msg);

        return {
            width: textMetrics.width,
            height: text.size
        };
    }

    return measureText;
})();
H5.SubImage = (function () {
    'use strict';

    function SubImage(x, y, width, height, offSetX, offSetY, trimmedWidth, trimmedHeight, scaledOffSetX, scaledOffSetY,
        scaledTrimmedWidth, scaledTrimmedHeight, atlas) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.offSetX = offSetX;
        this.offSetY = offSetY;
        this.trimmedWidth = trimmedWidth;
        this.trimmedHeight = trimmedHeight;
        this.scaledOffSetX = scaledOffSetX;
        this.scaledOffSetY = scaledOffSetY;
        this.scaledTrimmedWidth = scaledTrimmedWidth;
        this.scaledTrimmedHeight = scaledTrimmedHeight;
        this.img = atlas;
    }

    return SubImage;
})();
H5.ImageWrapper = (function () {
    'use strict';

    function ImageWrapper(img, width, height, scale) {
        this.img = img;
        this.width = width;
        this.height = height;
        this.scale = scale;
    }

    return ImageWrapper;
})();
H5.TextWrapper = (function () {
    'use strict';

    function TextWrapper(msg, size, fontFamily, color, fontStyle, maxLineLength, lineHeight) {
        this.msg = msg;
        this.size = size;
        this.fontFamily = fontFamily;
        this.color = color;
        this.fontStyle = fontStyle || 'normal';
        this.maxLineLength = maxLineLength;
        this.lineHeight = lineHeight;
    }

    return TextWrapper;
})();
H5.Rectangle = (function () {
    'use strict';

    function Rectangle(width, height, color, filled, lineWidth) {
        this.width = width;
        this.height = height;
        this.color = color;
        this.filled = filled !== undefined ? filled : false;
        this.lineWidth = lineWidth;
    }

    return Rectangle;
})();

H5.Quadrilateral = (function () {
    'use strict';

    function Quadrilateral(ax, ay, bx, by, cx, cy, dx, dy, color, filled, lineWidth) {
        this.ax = ax;
        this.ay = ay;
        this.bx = bx;
        this.by = by;
        this.cx = cx;
        this.cy = cy;
        this.dx = dx;
        this.dy = dy;
        this.color = color;
        this.lineColor = '#000000';
        this.filled = filled !== undefined ? filled : false;
        this.lineWidth = lineWidth;
    }

    return Quadrilateral;
})();

H5.ABLine = (function () {
    'use strict';

    function ABLine(ax, ay, bx, by, color, lineWidth) {
        this.ax = ax;
        this.ay = ay;
        this.bx = bx;
        this.by = by;
        this.color = color;
        this.lineWidth = lineWidth;
    }

    return ABLine;
})();

H5.Circle = (function () {
    'use strict';

    function Circle(radius, color, filled, lineWidth) {
        this.radius = radius;
        this.color = color;
        this.filled = filled !== undefined ? filled : false;
        this.lineWidth = lineWidth;
    }

    return Circle;
})();
H5.EquilateralTriangle = (function () {
    'use strict';

    function EquilateralTriangle(angle, radius, color, filled, lineWidth) {
        this.angle = angle;
        this.radius = radius;
        this.color = color;
        this.filled = filled !== undefined ? filled : false;
        this.lineWidth = lineWidth;
    }

    return EquilateralTriangle;
})();
H5.Hexagon = (function () {
    'use strict';

    function Hexagon(angle, radius, color, filled, lineWidth) {
        this.angle = angle;
        this.radius = radius;
        this.color = color;
        this.filled = filled !== undefined ? filled : false;
        this.lineWidth = lineWidth;
    }

    return Hexagon;
})();
H5.DrawableLine = (function () {
    'use strict';

    function DrawableLine(length, color, lineWidth) {
        this.length = length;
        this.color = color;
        this.lineWidth = lineWidth;
    }

    return DrawableLine;
})();
H5.Drawable = (function (Math, TextWrapper, SubImage, ImageWrapper, Circle, DrawableLine) {
    'use strict';

    function Drawable(id, x, y, data, zIndex, alpha, rotation, scale) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.data = data;
        this.zIndex = zIndex === undefined ? 3 : zIndex;
        this.rotation = rotation;
        this.alpha = alpha;
        this.scale = scale || 1;
        this.rotationAnchorOffsetX = 0;
        this.rotationAnchorOffsetY = 0;
        this.anchorOffsetX = 0;
        this.anchorOffsetY = 0;
        this.show = true;
        this.flipHorizontally = false;
        this.flipVertically = false;
    }

    Drawable.prototype.getRotationAnchorX = function () {
        return this.x + this.rotationAnchorOffsetX;
    };

    Drawable.prototype.getRotationAnchorY = function () {
        return this.y + this.rotationAnchorOffsetY;
    };

    Drawable.prototype.getAnchorX = function () {
        return this.x + this.anchorOffsetX;
    };

    Drawable.prototype.getAnchorY = function () {
        return this.y + this.anchorOffsetY;
    };

    Drawable.prototype.getCornerX = function () {
        return this.x - this.getWidthHalf();
    };

    Drawable.prototype.getCornerY = function () {
        return this.y - this.getHeightHalf();
    };

    Drawable.prototype.getEndX = function () {
        return this.x + this.getWidthHalf();
    };

    Drawable.prototype.getEndY = function () {
        return this.y + this.getHeightHalf();
    };

    Drawable.prototype.getWidth = function () {
        return Math.floor(this.__getWidth() * this.scale);
    };

    Drawable.prototype.getWidthHalf = function () {
        return Math.floor(this.__getWidth() / 2 * this.scale);
    };

    Drawable.prototype.getHeightHalf = function () {
        return Math.floor(this.__getHeight() / 2 * this.scale);
    };

    Drawable.prototype.getHeight = function () {
        return Math.floor(this.__getHeight() * this.scale);
    };

    Drawable.prototype.__getHeight = function () {
        if (this.data instanceof TextWrapper) {
            return this.data.size;
        }
        if (this.data instanceof SubImage) {
            return this.data.scaledTrimmedHeight;
        }
        if (this.data instanceof ImageWrapper) {
            return this.data.height * this.data.scale;
        }
        if (this.data instanceof DrawableLine) {
            return 0;
        }
        if (this.data instanceof Circle) {
            return this.data.radius * 2;
        }
        return this.data.height;
    };

    Drawable.prototype.__getWidth = function () {
        if (this.data instanceof TextWrapper) {
            return this.__measureText(this.data).width;
        }
        if (this.data instanceof SubImage) {
            return this.data.scaledTrimmedWidth;
        }
        if (this.data instanceof ImageWrapper) {
            return this.data.width * this.data.scale;
        }
        if (this.data instanceof DrawableLine) {
            return this.data.length;
        }
        if (this.data instanceof Circle) {
            return this.data.radius * 2;
        }
        return this.data.width;
    };

    return Drawable;
})(Math, H5.TextWrapper, H5.SubImage, H5.ImageWrapper, H5.Circle, H5.DrawableLine);
H5.Drawables = (function (Drawable, TextWrapper, Rectangle, RectangleMask, Circle, DrawableLine, EquilateralTriangle,
    Quadrilateral, ABLine, Hexagon, measureText) {
    'use strict';

    function createNewGfx(gfxCache, seed, x, y, imgPathName, zIndex, alpha, rotation, scale) {
        var gfx = gfxCache.get(imgPathName);

        return new Drawable(imgPathName + seed, x, y, gfx, zIndex, alpha, rotation, scale);
    }

    function createNewText(ctx, seed, x, y, zIndex, msg, size, fontFamily, color, rotation, alpha, fontStyle,
        maxLineLength, lineHeight, scale) {
        var txt = new TextWrapper(msg, size, fontFamily, color, fontStyle, maxLineLength, lineHeight);

        var drawable = new Drawable(generateHash(x.toString() + y + msg + size) + seed, x, y, txt, zIndex, alpha,
            rotation, scale);
        drawable.__measureText = measureText.bind(undefined, ctx);
        return drawable;
    }

    function generateHash(s) {
        return s.split('').reduce(function (a, b) {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
    }

    function createRectangle(seed, x, y, width, height, color, filled, lineWidth, zIndex, alpha, rotation, scale) {
        var rect = new Rectangle(width, height, color, filled, lineWidth);
        return new Drawable(generateHash(x.toString() + y + width + height + color) + seed, x, y, rect, zIndex, alpha,
            rotation, scale);
    }

    function createQuadrilateral(seed, ax, ay, bx, by, cx, cy, dx, dy, color, filled, lineWidth, zIndex, alpha,
        rotation, scale) {
        var quad = new Quadrilateral(ax, ay, bx, by, cx, cy, dx, dy, color, filled, lineWidth);
        return new Drawable(generateHash(ay.toString(), bx, by, cx, cy, dx, dy + color) + seed, 0, 0, quad, zIndex,
            alpha, rotation, scale);
    }

    function createABLine(seed, ax, ay, bx, by, color, lineWidth, zIndex, alpha, rotation, scale) {
        var line = new ABLine(ax, ay, bx, by, color, lineWidth);
        return new Drawable(generateHash(ay.toString(), bx, by + color) + seed, 0, 0, line, zIndex, alpha, rotation,
            scale);
    }

    function createClippingMask(x, y, width, height) {
        return new RectangleMask(x, y, width, height);
    }

    function createCircle(seed, x, y, radius, color, filled, lineWidth, zIndex, alpha, rotation, scale) {
        var circle = new Circle(radius, color, filled, lineWidth);
        return new Drawable(generateHash(x.toString() + y + radius + color) + seed, x, y, circle, zIndex, alpha,
            rotation, scale);
    }

    function createLine(seed, x, y, length, color, lineWidth, zIndex, alpha, rotation, scale) {
        var line = new DrawableLine(length, color, lineWidth);
        return new Drawable(generateHash(x.toString() + y + length + color) + seed, x, y, line, zIndex, alpha, rotation,
            scale);
    }

    function createEquilateralTriangle(seed, x, y, angle, radius, color, filled, lineWidth, zIndex, alpha, rotation,
        scale) {
        var triangle = new EquilateralTriangle(angle, radius, color, filled, lineWidth);
        return new Drawable(generateHash(x.toString() + y + angle + radius + color) + seed, x, y, triangle, zIndex,
            alpha, rotation, scale);
    }

    function createHexagon(seed, x, y, angle, radius, color, filled, lineWidth, zIndex, alpha, rotation, scale) {
        var hex = new Hexagon(angle, radius, color, filled, lineWidth);
        return new Drawable(generateHash(x.toString() + y + angle + radius + color) + seed, x, y, hex, zIndex, alpha,
            rotation, scale);
    }

    return {
        getGraphic: createNewGfx,
        getTxt: createNewText,
        getRect: createRectangle,
        getMask: createClippingMask,
        getCircle: createCircle,
        getLine: createLine,
        getEqTriangle: createEquilateralTriangle,
        getHexagon: createHexagon,
        getQuad: createQuadrilateral,
        getABLine: createABLine
    };
})(H5.Drawable, H5.TextWrapper, H5.Rectangle, H5.RectangleMask, H5.Circle, H5.DrawableLine, H5.EquilateralTriangle,
    H5.Quadrilateral, H5.ABLine, H5.Hexagon, H5.measureText);
H5.Animation = (function () {
    'use strict';

    function Animation(startValue, endValue, valueRangeLength, duration, timingFn, loop) {
        this.start = startValue;
        this.end = endValue;
        this.length = valueRangeLength;
        this.duration = duration;
        this.timingFn = timingFn;
        this.loop = loop !== undefined ? loop : false;
    }

    return Animation;
})();
H5.Animations = (function (Animation, Math) {
    'use strict';

    function createNew(startValue, endValue, speed, spacingFn, loop) {
        var length = Math.abs(startValue - endValue);
        if (endValue < startValue) {
            length = -length;
        }
        return new Animation(startValue, endValue, length, speed, spacingFn, loop);
    }

    return {
        get: createNew
    };
})(H5.Animation, Math);
H5.Paths = (function (Math, LinePath, CirclePath, BezierCurvePath, Vectors, Animations) {
    'use strict';

    function createLine(startX, startY, endX, endY, speed, spacingFn, loop) {
        var vector = Vectors.get(startX, startY, endX, endY);
        var length = Vectors.magnitude(vector.x, vector.y);
        var unitVector = Vectors.normalize(vector.x, vector.y);
        var line = new LinePath(startX, startY, endX, endY, vector.x, vector.y, unitVector.x, unitVector.y, length);

        var path = Animations.get(0, 1, speed, spacingFn, loop);
        path.curve = line;
        return path;
    }

    function createCircle(x, y, radius, startAngle, endAngle, speed, spacingFn, loop) {
        var circle = new CirclePath(x, y, radius, startAngle, endAngle);
        var path = Animations.get(startAngle, endAngle, speed, spacingFn, loop);
        path.curve = circle;
        return path;
    }

    function createNewBezierCurvePath(a_x, a_y, b_x, b_y, c_x, c_y, d_x, d_y, speed, spacingFn, loop) {
        var curve = new BezierCurvePath(a_x, a_y, b_x, b_y, c_x, c_y, d_x, d_y);

        var path = Animations.get(0, 1, speed, spacingFn, loop);
        path.curve = curve;
        return path;
    }

    return {
        getLine: createLine,
        getCurve: createNewBezierCurvePath,
        getCircle: createCircle
    };
})(Math, H5.LinePath, H5.CirclePath, H5.BezierCurvePath, H5.Vectors, H5.Animations);

H5.Sprite = (function () {
    'use strict';

    function Sprite(frames, loop) {
        this.frames = frames;
        this.loop = loop !== undefined ? loop : true;
    }

    return Sprite;
})();
H5.Sprites = (function (Sprite) {
    'use strict';

    function createNew(gfxCache, imgPath, numberOfFrames, loop) {
        var frames = [];
        for (var i = 0; i < numberOfFrames; i++) {
            if (i < 10) {

                frames.push(gfxCache.get(imgPath + '_000' + i));
            } else {
                frames.push(gfxCache.get(imgPath + '_00' + i));
            }
        }
        return new Sprite(frames, loop);
    }

    return {
        get: createNew
    };
})(H5.Sprite);
H5.CanvasImageCollisionDetector = (function (document) {
    'use strict';

    function CanvasImageCollisionDetector(baseDrawable) {
        this.drawable = baseDrawable;

        var canvas = document.createElement('canvas');
        this.ctx = canvas.getContext('2d');

        canvas.width = this.width = baseDrawable.getWidth();
        canvas.height = this.height = baseDrawable.getHeight();
    }

    CanvasImageCollisionDetector.prototype.isHit = function (drawable) {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.ctx.drawImage(this.drawable.data.img, 0, 0, this.drawable.getWidth(), this.drawable.getHeight());

        this.ctx.save();
        this.ctx.globalCompositeOperation = 'source-in';

        var x = drawable.getCornerX() - this.drawable.getCornerX();
        var y = drawable.getCornerY() - this.drawable.getCornerY();

        this.ctx.drawImage(drawable.data.img, x, y, drawable.getWidth(), drawable.getHeight());

        this.ctx.restore();

        var sourceWidth = x + drawable.getWidth();
        var sourceHeight = y + drawable.getHeight();
        if (sourceWidth < 1 || sourceHeight < 1) {
            return false;
        }

        var rawPixelData = this.ctx.getImageData(0, 0, sourceWidth, sourceHeight).data;

        for (var i = 0; i < rawPixelData.length; i += 4) {
            var alphaValue = rawPixelData[i + 3];
            if (alphaValue != 0) {
                return true;
            }
        }
        return false;
    };

    CanvasImageCollisionDetector.prototype.resize = function () {
        this.ctx.canvas.width = this.width = this.drawable.getWidth();
        this.ctx.canvas.height = this.height = this.drawable.getHeight();
    };

    return CanvasImageCollisionDetector;
})(window.document);
H5.BasicAnimations = (function (Object, iterateEntries) {
    'use strict';

    function BasicAnimations() {
        this.dict = {};
        this.paused = {};
    }

    BasicAnimations.prototype.animate = function (drawable, setter, animation, callback) {
        var hasEntry = this.dict[drawable.id] !== undefined;
        var isPaused = this.paused[drawable.id] !== undefined;

        if (hasEntry) {
            this.dict[drawable.id].push({
                setter: setter,
                animation: animation,
                callback: callback,
                time: 0,
                active: true
            });

        } else if (isPaused) {
            this.paused[drawable.id].push({
                setter: setter,
                animation: animation,
                callback: callback,
                time: 0,
                active: true
            });

        } else {
            this.dict[drawable.id] = [
                {
                    setter: setter,
                    animation: animation,
                    callback: callback,
                    time: 0,
                    active: true
                }
            ];
        }
    };

    BasicAnimations.prototype.update = function () {
        Object.keys(this.dict).forEach(function (key) {
            var list = this.dict[key];
            if (!list) {
                return;
            }

            for (var i = list.length - 1; i >= 0; i--) {
                var wrapper = list[i];
                var animation = wrapper.animation;
                if (animation.duration > wrapper.time) {

                    var value = animation.timingFn(wrapper.time, animation.start, animation.length, animation.duration);
                    wrapper.setter(value, wrapper.time);
                    wrapper.time++;

                } else {
                    wrapper.setter(animation.end, wrapper.time);

                    if (animation.loop) {
                        wrapper.time = 0;
                    } else {
                        list.splice(i, 1);
                    }

                    if (wrapper.callback) {
                        wrapper.callback();
                    }
                }
            }

            if (list.length == 0) {
                delete this.dict[key];
            }
        }, this);
    };

    BasicAnimations.prototype.remove = function (drawable) {
        delete this.dict[drawable.id];
        delete this.paused[drawable.id];
    };

    BasicAnimations.prototype.has = function (drawable) {
        return this.dict[drawable.id] !== undefined || this.paused[drawable.id] !== undefined;
    };

    BasicAnimations.prototype.pause = function (drawable) {
        this.paused[drawable.id] = this.dict[drawable.id];
        delete this.dict[drawable.id];
    };

    BasicAnimations.prototype.pauseAll = function () {
        iterateEntries(this.dict, function (wrapper, id) {
            this.paused[id] = wrapper;
            delete this.dict[id];
        }, this);
    };

    BasicAnimations.prototype.play = function (drawable) {
        this.dict[drawable.id] = this.paused[drawable.id];
        delete this.paused[drawable.id];
    };

    BasicAnimations.prototype.playAll = function () {
        iterateEntries(this.paused, function (wrapper, id) {
            this.dict[id] = wrapper;
            delete this.paused[id];
        }, this);
    };

    return BasicAnimations;
})(Object, H5.iterateEntries);
H5.AnimationHelper = (function () {
    'use strict';

    // high level animation methods
    function AnimationHelper(animations) {
        this.animations = animations;
    }

    AnimationHelper.prototype.animateWithKeyFrames = function (drawableWrapperList, loop) {
        if (loop) {
            var copy = drawableWrapperList.slice();
        }
        var self = this;

        keyFrame(drawableWrapperList.shift(), drawableWrapperList);

        function keyFrame(wrapper, nextKeyFrameSlices) {
            var callback;
            if (nextKeyFrameSlices.length > 0) {
                if (wrapper.callback) {
                    callback = function () {
                        wrapper.callback();
                        keyFrame(nextKeyFrameSlices.shift(), nextKeyFrameSlices);
                    };
                } else {
                    callback = function () {
                        keyFrame(nextKeyFrameSlices.shift(), nextKeyFrameSlices);
                    };
                }
            } else if (loop) {
                if (wrapper.callback) {
                    callback = function () {
                        wrapper.callback();
                        self.animateWithKeyFrames(copy, loop);
                    };
                } else {
                    callback = function () {
                        self.animateWithKeyFrames(copy, loop);
                    };
                }
            } else {
                callback = wrapper.callback;
            }
            self.animations.animate(wrapper.drawable, wrapper.setter, wrapper.animation, callback);
        }
    };

    return AnimationHelper;
})();
H5.AnimationTimer = (function () {
    'use strict';

    function AnimationTimer(animations, timer) {
        this.animations = animations;
        this.timer = timer;
    }

    AnimationTimer.prototype.animateLater = function (drawableToAdd, duration, callback) {
        var self = this;
        this.timer.in(duration, function () {
            self.animations.animate(drawableToAdd.drawable, drawableToAdd.setter, drawableToAdd.animation,
                drawableToAdd.callback);

            if (callback) {
                callback();
            }
        });
    };

    return AnimationTimer;
})();
H5.PropertyAnimations = (function (Animations) {
    'use strict';

    function PropertyAnimations(animations, animationHelper) {
        this.animations = animations;
        this.animationHelper = animationHelper;
    }

    PropertyAnimations.prototype.animateAlpha = function (drawable, value, duration, easing, loop, callback) {
        return this.__animateProperty(drawable, 'alpha', value, duration, easing, loop, callback);
    };

    PropertyAnimations.prototype.animateAlphaPattern = function (drawable, valuePairs, loop) {
        this.__animatePropertyPattern(drawable, 'alpha', valuePairs, loop);
    };

    PropertyAnimations.prototype.animateRotation = function (drawable, value, duration, easing, loop, callback) {
        return this.__animateProperty(drawable, 'rotation', value, duration, easing, loop, callback);
    };

    PropertyAnimations.prototype.animateRotationPattern = function (drawable, valuePairs, loop) {
        this.__animatePropertyPattern(drawable, 'rotation', valuePairs, loop);
    };

    PropertyAnimations.prototype.animateScale = function (drawable, value, duration, easing, loop, callback) {
        return this.__animateProperty(drawable, 'scale', value, duration, easing, loop, callback);
    };

    PropertyAnimations.prototype.animateScalePattern = function (drawable, valuePairs, loop) {
        this.__animatePropertyPattern(drawable, 'scale', valuePairs, loop);
    };

    PropertyAnimations.prototype.__animateProperty = function (drawable, propertyKey, value, duration, easing, loop,
        callback) {
        var animation = Animations.get(drawable[propertyKey], value, duration, easing, loop);

        this.animations.animate(drawable, function (value) {
            drawable[propertyKey] = value;
        }, animation, callback);

        return animation;
    };

    PropertyAnimations.prototype.__animatePropertyPattern = function (drawable, propertyKey, valuePairs, loop) {
        var wrapperList = [];
        var setter = function (value) {
            drawable[propertyKey] = value;
        };

        var start = drawable[propertyKey] || 0;
        for (var i = 0; i < valuePairs.length; i++) {
            var current = valuePairs[i];

            wrapperList.push({
                drawable: drawable,
                setter: setter,
                animation: Animations.get(start, current.value, current.duration, current.easing, false),
                callback: current.callback
            });

            start = current.value;
        }

        this.animationHelper.animateWithKeyFrames(wrapperList, loop);
    };

    return PropertyAnimations;
})(H5.Animations);
H5.AudioAnimations = (function (Animations, Math) {
    'use strict';

    function AudioAnimations(animations) {
        this.animations = animations;
    }

    AudioAnimations.prototype.animateVolume = function (audio, value, duration, easing, loop, callback) {
        return this.__animateProperty(audio, 'volume', value, duration, easing, loop, callback);
    };

    AudioAnimations.prototype.__animateProperty = function (audio, propertyKey, value, duration, easing, loop,
        callback) {
        var animation = Animations.get(audio[propertyKey], value, duration, easing, loop);

        this.animations.animate({id: audio.src}, function (value) {
            audio[propertyKey] = Math.floor(value * 100) / 100;
        }, animation, callback);

        return animation;
    };

    return AudioAnimations;
})(H5.Animations, Math);
H5.SpriteAnimations = (function (Object, iterateEntries) {
    'use strict';

    function SpriteAnimations() {
        this.animationsDict = {};
        this.paused = {};
        this.ticker = 0;
        this.is30fps = false;
    }

    SpriteAnimations.prototype.set30fps = function (is30fps) {
        this.is30fps = is30fps !== undefined ? is30fps : true;
    };

    SpriteAnimations.prototype.animate = function (drawable, sprite, callback) {
        drawable.data = sprite.frames[0];

        this.animationsDict[drawable.id] = {
            drawable: drawable,
            sprite: sprite,
            callback: callback,
            time: 0
        };
    };

    SpriteAnimations.prototype.nextFrame = function () {
        Object.keys(this.animationsDict).forEach(function (key) {
            var animation = this.animationsDict[key];
            var drawable = animation.drawable;
            var sprite = animation.sprite;

            drawable.data = sprite.frames[++animation.time];
            if (animation.time >= sprite.frames.length) {

                if (sprite.loop) {
                    animation.time = 0;
                    drawable.data = sprite.frames[0];
                } else {
                    delete this.animationsDict[key];
                }

                if (animation.callback) {
                    animation.callback();
                }
            }
        }, this);
    };

    SpriteAnimations.prototype.update = function () {
        if (this.is30fps || this.ticker % 2 === 0) {
            this.nextFrame();
            this.ticker = 0;
        }
        this.ticker++;
    };

    SpriteAnimations.prototype.remove = function (drawable) {
        delete this.animationsDict[drawable.id];
        delete this.paused[drawable.id];
    };

    SpriteAnimations.prototype.has = function (drawable) {
        return this.animationsDict[drawable.id] !== undefined || this.paused[drawable.id] !== undefined;
    };

    SpriteAnimations.prototype.pause = function (drawable) {
        this.paused[drawable.id] = this.animationsDict[drawable.id];
        delete this.animationsDict[drawable.id];
    };

    SpriteAnimations.prototype.pauseAll = function () {
        iterateEntries(this.animationsDict, function (wrapper, id) {
            this.paused[id] = wrapper;
            delete this.animationsDict[id];
        }, this);
    };

    SpriteAnimations.prototype.play = function (drawable) {
        this.animationsDict[drawable.id] = this.paused[drawable.id];
        delete this.paused[drawable.id];
    };

    SpriteAnimations.prototype.playAll = function () {
        iterateEntries(this.paused, function (wrapper, id) {
            this.animationsDict[id] = wrapper;
            delete this.paused[id];
        }, this);
    };

    return SpriteAnimations;
})(Object, H5.iterateEntries);
H5.SpriteTimer = (function () {
    'use strict';

    function SpriteTimer(spriteAnimations, timer) {
        this.spriteAnimations = spriteAnimations;
        this.timer = timer;
    }

    SpriteTimer.prototype.animateLater = function (drawableToAdd, duration, callback) {
        var self = this;
        this.timer.in(duration, function () {
            self.spriteAnimations.animate(drawableToAdd.drawable, drawableToAdd.sprite, drawableToAdd.callback);

            if (callback) {
                callback();
            }
        });
    };

    return SpriteTimer;
})();
H5.inheritMethods = (function (Object) {
    'use strict';

    function inheritMethods(source, target, targetPrototype) {
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                continue;
            }

            (function (propertyKey) {
                var hasSameMethod = Object.getOwnPropertyNames(targetPrototype).some(function (elem) {
                    return elem == propertyKey;
                });

                if (!hasSameMethod) {
                    target[propertyKey] = source[propertyKey].bind(source);
                }
            })(key);
        }
    }

    return inheritMethods;
})(Object);
H5.MotionHelper = (function () {
    'use strict';

    function MotionHelper(motions) {
        this.motions = motions;
    }

    MotionHelper.prototype.moveRoundTrip = function (drawable, pathTo, pathReturn, loopTheTrip, callbackTo,
        callbackReturn) {
        var self = this;

        function startRoundTrip() {
            if (callbackTo) {
                self.motions.animate(drawable, pathTo, function () {
                    callbackTo();
                    fromBtoA();
                });
            } else {
                self.motions.animate(drawable, pathTo, fromBtoA);
            }
        }

        function fromAtoB() {
            if (self.motions.has(drawable)) {
                startRoundTrip();
            }
        }

        function fromBtoA() {
            if (self.motions.has(drawable)) {
                if (loopTheTrip) {
                    if (callbackReturn) {
                        self.motions.animate(drawable, pathReturn, function () {
                            callbackReturn();
                            fromAtoB();
                        });
                    } else {
                        self.motions.animate(drawable, pathReturn, fromAtoB);
                    }
                } else {
                    if (callbackReturn) {
                        self.motions.animate(drawable, pathReturn, callbackReturn);
                    } else {
                        self.motions.animate(drawable, pathReturn);
                    }
                }
            }
        }

        startRoundTrip();
    };

    return MotionHelper;
})();
H5.MotionTimer = (function () {
    'use strict';

    function MotionTimer(motions, timer) {
        this.motions = motions;
        this.timer = timer;
    }

    MotionTimer.prototype.moveLater = function (drawableToAdd, duration, callback) {
        var self = this;
        this.timer.in(duration, function () {
            self.motions.animate(drawableToAdd.drawable, drawableToAdd.path, drawableToAdd.callback);

            if (callback) {
                callback();
            }
        });
    };

    return MotionTimer;
})();
H5.calcLinePoint = (function () {
    'use strict';

    function calcLinePoint(time, line) {
        var x = line.startX + time * line.vectorX;
        var y = line.startY + time * line.vectorY;

        return {
            x: x,
            y: y
        };
    }

    return calcLinePoint;
})();

H5.calcCirclePoint = (function (Vectors) {
    'use strict';

    function calcCirclePoint(time, circle) {
        return {
            x: Vectors.getX(circle.x, circle.radius, time),
            y: Vectors.getY(circle.y, circle.radius, time)
        };
    }

    return calcCirclePoint;
})(H5.Vectors);
H5.calcBezierPoint = (function () {
    'use strict';

    function calcBezierPoint(time, curve) {
        var u = 1 - time;
        var tt = time * time;
        var uu = u * u;
        var uuu = uu * u;
        var ttt = tt * time;

        function calcTerms(p0, p1, p2, p3) {
            return uuu * p0 //first term
                + 3 * uu * time * p1 //second term
                + 3 * u * tt * p2 //third term
                + ttt * p3; //fourth term
        }

        return {
            x: calcTerms(curve.pointA_x, curve.pointB_x, curve.pointC_x, curve.pointD_x),
            y: calcTerms(curve.pointA_y, curve.pointB_y, curve.pointC_y, curve.pointD_y)
        };
    }

    return calcBezierPoint;
})();

H5.Motions = (function (Math, LinePath, calcLinePoint, calcBezierPoint, Animations, inheritMethods, CirclePath,
    BezierCurvePath, calcCirclePoint) {
    'use strict';

    function Motions(animations) {
        this.animations = animations;

        inheritMethods(animations, this, Motions.prototype);
    }

    Motions.prototype.animate = function (drawable, path, callback) {

        var calculatePoint;
        if (path.curve instanceof LinePath) {
            calculatePoint = calcLinePoint;
        } else if (path.curve instanceof CirclePath) {
            calculatePoint = calcCirclePoint;
        } else if (path.curve instanceof BezierCurvePath) {
            calculatePoint = calcBezierPoint;
        }

        this.animations.animate(drawable, function (time) {
            var point = calculatePoint(time, path.curve);
            drawable.x = Math.floor(point.x);
            drawable.y = Math.floor(point.y);
        }, path, callback);
    };

    Motions.prototype.animateQuad = function (property, drawable, path, callback) {

        var calculatePoint;
        if (path.curve instanceof LinePath) {
            calculatePoint = calcLinePoint;
        } else if (path.curve instanceof CirclePath) {
            calculatePoint = calcCirclePoint;
        } else if (path.curve instanceof BezierCurvePath) {
            calculatePoint = calcBezierPoint;
        }

        this.animations.animate(drawable, function (time) {
            var point = calculatePoint(time, path.curve);
            drawable.data[property + 'x'] = Math.floor(point.x);
            drawable.data[property + 'y'] = Math.floor(point.y);
        }, path, callback);
    };

    return Motions;
})(Math, H5.LinePath, H5.calcLinePoint, H5.calcBezierPoint, H5.Animations, H5.inheritMethods, H5.CirclePath,
    H5.BezierCurvePath, H5.calcCirclePoint);
H5.wrapText = (function (Math) {
    'use strict';

    function wrapText(context, text, x, y, maxWidth, lineHeight, drawable) {
        var words = text.split(' ');
        var line = '';

        var readyLines = [];

        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = context.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                readyLines.push(line);
                line = words[n] + ' ';
            } else {
                line = testLine;
            }
        }
        readyLines.push(line);

        var totalHeight = readyLines.length * lineHeight / 2;
        var newStartY = y - Math.floor(totalHeight / 2);

        context.font = drawable.data.fontStyle + ' ' + Math.floor(drawable.data.size * drawable.scale) + 'px ' +
            drawable.data.fontFamily;

        for (var i = 0; i < readyLines.length; i++) {
            context.fillText(readyLines[i], x, newStartY);
            newStartY += lineHeight;
        }
    }

    return wrapText;
})(Math);
H5.renderQuadrilateral = (function () {
    'use strict';

    function renderQuadrilateral(ctx, drawable) {

        ctx.beginPath();

        var q = drawable.data;
        ctx.moveTo(q.ax, q.ay);
        ctx.lineTo(q.bx, q.by);
        ctx.lineTo(q.cx, q.cy);
        ctx.lineTo(q.dx, q.dy);
        ctx.lineTo(q.ax, q.ay);

        ctx.closePath();

        if (q.filled) {
            ctx.fillStyle = q.color;
            ctx.fill();

        }
        if (q.lineWidth !== undefined && q.lineColor !== undefined) {
            ctx.lineWidth = q.lineWidth;
            ctx.strokeStyle = q.lineColor;
            ctx.stroke();
        }
    }

    return renderQuadrilateral;
})();
H5.renderABLine = (function () {
    'use strict';

    function renderABLine(ctx, drawable) {
        ctx.beginPath();

        var line = drawable.data;
        ctx.moveTo(line.ax, line.ay);
        ctx.lineTo(line.bx, line.by);

        ctx.strokeStyle = drawable.data.color;

        if (drawable.data.lineWidth) {
            ctx.lineWidth = drawable.data.lineWidth;
        }

        if (drawable.data.lineCap) {
            ctx.lineCap = drawable.data.lineCap;
        }

        ctx.stroke();
    }

    return renderABLine;
})();

H5.renderPolygon = (function (Math) {
    'use strict';

    function renderPolygon(ctx, x, y, polygon, sides, scale) {
        var angle = (Math.PI * 2) / sides;
        var anticlockwise = false;
        angle = anticlockwise ? -angle : angle;
        var radius;
        if (scale) {
            radius = polygon.radius * scale + 1;
        } else {
            radius = polygon.radius + 1;
        }
        ctx.beginPath();
        ctx.translate(x, y);
        ctx.rotate(polygon.angle);
        ctx.moveTo(radius, 0);
        for (var vertex = 1; vertex < sides; vertex++) {
            ctx.lineTo(radius * Math.cos(angle * vertex), radius * Math.sin(angle * vertex));
        }

        ctx.closePath();

        if (polygon.filled) {
            ctx.fillStyle = polygon.color;
            ctx.fill();
        } else {
            ctx.strokeStyle = polygon.color;
            ctx.lineWidth = polygon.lineWidth;
            ctx.stroke();
        }
    }

    return renderPolygon;
})(Math);
H5.renderEqTriangle = (function (renderPolygon) {
    'use strict';

    function renderEqTriangle(ctx, drawable) {
        renderPolygon(ctx, drawable.x, drawable.y, drawable.data, 3, drawable.scale);
    }

    return renderEqTriangle;
})(H5.renderPolygon);
H5.renderImage = (function () {
    'use strict';

    function renderImage(ctx, drawable) {
        ctx.drawImage(drawable.data.img, drawable.getCornerX(), drawable.getCornerY(), drawable.getWidth(),
            drawable.getHeight());
    }

    return renderImage;
})();
H5.renderAtlas = (function () {
    'use strict';

    function renderAtlas(ctx, drawable) {
        if (drawable.compositeOperation) {
            ctx.globalCompositeOperation = drawable.compositeOperation;
        }

        if (drawable.scale != 1) {
            ctx.drawImage(drawable.data.img, drawable.data.x, drawable.data.y, drawable.data.width,
                drawable.data.height, drawable.getCornerX(), drawable.getCornerY(), drawable.getWidth(),
                drawable.getHeight());
        } else {
            ctx.drawImage(drawable.data.img, drawable.data.x, drawable.data.y, drawable.data.width,
                drawable.data.height, drawable.x + drawable.data.scaledOffSetX,
                drawable.y + drawable.data.scaledOffSetY, drawable.data.scaledTrimmedWidth,
                drawable.data.scaledTrimmedHeight);
        }
    }

    return renderAtlas;
})();

H5.renderText = (function (wrapText, Math) {
    'use strict';

    function renderText(ctx, drawable) {
        if (drawable.data.baseLine) {
            ctx.textBaseline = drawable.data.baseLine;
        } else {
            ctx.textBaseline = 'middle';
        }
        if (drawable.data.align) {
            ctx.textAlign = drawable.data.align;
        } else {
            ctx.textAlign = 'center';
        }
        ctx.fillStyle = drawable.data.color;
        ctx.font = drawable.data.fontStyle + ' ' + drawable.data.size + 'px ' + drawable.data.fontFamily;

        var txtIsToLong = drawable.data.maxLineLength &&
            ctx.measureText(drawable.data.msg).width > drawable.data.maxLineLength;
        if (txtIsToLong) {
            wrapText(ctx, drawable.data.msg, drawable.x, drawable.y, drawable.data.maxLineLength,
                drawable.data.lineHeight, drawable);
        } else {
            ctx.font = drawable.data.fontStyle + ' ' + Math.floor(drawable.data.size * drawable.scale) + 'px ' +
                drawable.data.fontFamily;
            ctx.fillText(drawable.data.msg, drawable.x, drawable.y);
        }
    }

    return renderText;
})(H5.wrapText, Math);

H5.renderEjectaText = (function (Math, H5) {
    'use strict';

    function renderEjectaText(ctx, drawable) {
        if (drawable.data.baseLine) {
            ctx.textBaseline = drawable.data.baseLine;
        } else {
            ctx.textBaseline = 'middle';
        }
        if (drawable.data.align) {
            ctx.textAlign = drawable.data.align;
        } else {
            ctx.textAlign = 'center';
        }

        ctx.fillStyle = drawable.data.color;
        ctx.font = Math.floor(drawable.data.size * drawable.scale) + 'px ' + H5.TV_FONT;

        ctx.fillText(drawable.data.msg, drawable.x, drawable.y);
    }

    return renderEjectaText;
})(Math, H5);
H5.renderCircle = (function (Math) {
    'use strict';

    function renderCircle(ctx, drawable) {
        ctx.beginPath();
        ctx.arc(drawable.x, drawable.y, drawable.getWidthHalf(), 0, 2 * Math.PI);
        ctx.closePath();

        if (drawable.data.lineWidth) {
            ctx.lineWidth = drawable.data.lineWidth;
        }

        if (drawable.data.filled) {
            ctx.fillStyle = drawable.data.color;
            ctx.fill();

        } else {
            ctx.strokeStyle = drawable.data.color;
            ctx.stroke();
        }
    }

    return renderCircle;
})(Math);

H5.renderCurve = (function () {
    'use strict';

    function renderCurve(ctx, drawable) {
        ctx.beginPath();
        ctx.moveTo(drawable.data.xPointA, drawable.data.yPointA);
        ctx.bezierCurveTo(drawable.data.xPointB, drawable.data.yPointB, drawable.data.xPointC, drawable.data.yPointC,
            drawable.data.xPointD, drawable.data.yPointD);
        ctx.closePath();
        ctx.stroke();
    }

    return renderCurve;
})();

H5.renderHexagon = (function (renderPolygon) {
    'use strict';

    function renderHexagon(ctx, drawable) {
        renderPolygon(ctx, drawable.x, drawable.y, drawable.data, 6);
    }

    return renderHexagon;
})(H5.renderPolygon);

H5.renderLine = (function () {
    'use strict';

    function renderLine(ctx, drawable) {
        ctx.beginPath();
        ctx.moveTo(drawable.getCornerX(), drawable.getCornerY());
        ctx.lineTo(drawable.getEndX(), drawable.getEndY());

        ctx.strokeStyle = drawable.data.color;

        if (drawable.data.lineWidth) {
            ctx.lineWidth = drawable.data.lineWidth;
        }

        if (drawable.data.lineCap) {
            ctx.lineCap = drawable.data.lineCap;
        }

        ctx.stroke();
    }

    return renderLine;
})();

H5.renderRectangle = (function (Math) {
    'use strict';

    function renderRectangle(ctx, drawable) {
        var x = drawable.justHeightScale ? drawable.x - Math.floor(drawable.__getWidth() / 2) - 0.5 :
            drawable.getCornerX() - 0.5;
        var y = drawable.justWidthScale ? drawable.y - Math.floor(drawable.__getHeight() / 2) - 0.5 :
            drawable.getCornerY() - 0.5;
        var width = drawable.justHeightScale ? Math.floor(drawable.__getWidth()) : drawable.getWidth();
        var height = drawable.justWidthScale ? Math.floor(drawable.__getHeight()) : drawable.getHeight();

        if (drawable.data.filled) {
            ctx.fillStyle = drawable.data.color;
            if (drawable.flipHorizontally) {
                ctx.fillRect(x * -1, y, width, height);
            } else {
                ctx.fillRect(x, y, width, height);
            }
        } else {
            if (drawable.data.lineDash !== undefined) {
                ctx.setLineDash(drawable.data.lineDash);
            }

            ctx.strokeStyle = drawable.data.color;
            if (drawable.data.lineWidth) {
                ctx.lineWidth = drawable.data.lineWidth;
            }
            if (drawable.flipHorizontally) {
                ctx.strokeRect(x * -1, y, width, height);
            } else {
                ctx.strokeRect(x, y, width, height);
            }
        }
    }

    return renderRectangle;
})(Math);

H5.Renderer = (function (Object, Math, $) {
    'use strict';

    function Renderer(screen) {
        this.screen = screen;
        this.ctx = screen.getContext('2d');

        this.screenWidth = screen.width;
        this.screenHeight = screen.height;
        this.drawableDict = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
    }

    Renderer.prototype.resize = function (event) {
        if (event.devicePixelRatio > 1) {
            this.screen.style.width = event.cssWidth + 'px';
            this.screen.style.height = event.cssHeight + 'px';
            this.screen.width = this.screenWidth = event.width;
            this.screen.height = this.screenHeight = event.height;
        } else {
            this.screen.width = this.screenWidth = event.width;
            this.screen.height = this.screenHeight = event.height;
        }
    };

    Renderer.prototype.add = function (drawable) {
        this.drawableDict[drawable.zIndex][drawable.id] = drawable;
    };

    Renderer.prototype.remove = function (drawable) {
        delete this.drawableDict[drawable.zIndex][drawable.id];
    };

    Renderer.prototype.has = function (drawable) {
        return this.drawableDict[drawable.zIndex][drawable.id] !== undefined;
    };

    Renderer.prototype.changeZIndex = function (drawable, newZIndex) {
        this.drawableDict[newZIndex][drawable.id] = this.drawableDict[drawable.zIndex][drawable.id];
        delete this.drawableDict[drawable.zIndex][drawable.id];
        drawable.zIndex = newZIndex;
    };

    Renderer.prototype.clear = function () {
        this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);
    };

    Renderer.prototype.draw = function () {
        var self = this;
        Object.keys(self.drawableDict).forEach(function (key) {
            iterate(self.drawableDict[key]);
        });

        function iterate(layer) {
            Object.keys(layer).forEach(function (key) {
                var drawable = layer[key];
                if (!drawable.show) {
                    return;
                }

                self.ctx.save();

                if (drawable.mask) {
                    if (drawable.mask.rotation) {
                        self.ctx.translate(drawable.mask.getRotationAnchorX(), drawable.mask.getRotationAnchorY());
                        self.ctx.rotate(drawable.mask.rotation);
                        self.ctx.translate(-drawable.mask.getRotationAnchorX(), -drawable.mask.getRotationAnchorY());
                    }

                    self.ctx.beginPath();
                    if (drawable.mask.data instanceof $.Rectangle) {
                        self.ctx.rect(drawable.mask.getCornerX() - 0.5, drawable.mask.getCornerY() - 0.5,
                            drawable.mask.getWidth(), drawable.mask.getHeight());

                    } else if (drawable.mask.data instanceof $.Circle) {
                        self.ctx.arc(drawable.mask.x, drawable.mask.y, drawable.mask.getWidthHalf(), 0, 2 * Math.PI);

                    }

                    self.ctx.closePath();
                    self.ctx.clip();

                    if (drawable.mask.rotation) {
                        self.ctx.translate(drawable.mask.getRotationAnchorX(), drawable.mask.getRotationAnchorY());
                        self.ctx.rotate(-drawable.mask.rotation);
                        self.ctx.translate(-drawable.mask.getRotationAnchorX(), -drawable.mask.getRotationAnchorY());
                    }
                }

                if (drawable.alpha || drawable.alpha === 0) {
                    self.ctx.globalAlpha = drawable.alpha;
                }

                if (drawable.flipHorizontally) {
                    self.ctx.translate(drawable.getWidth(), 0);
                    self.ctx.scale(-1, 1);
                    if (drawable.rotation) {
                        self.ctx.translate(-drawable.getRotationAnchorX(), drawable.getRotationAnchorY());
                        self.ctx.rotate(drawable.rotation);
                        self.ctx.translate(drawable.getRotationAnchorX(), -drawable.getRotationAnchorY());
                    }
                } else {
                    if (drawable.rotation) {
                        self.ctx.translate(drawable.getRotationAnchorX(), drawable.getRotationAnchorY());
                        self.ctx.rotate(drawable.rotation);
                        self.ctx.translate(-drawable.getRotationAnchorX(), -drawable.getRotationAnchorY());
                    }
                }

                self.ctx.translate(drawable.anchorOffsetX, drawable.anchorOffsetY);

                if (drawable.data instanceof $.EquilateralTriangle) {
                    $.renderEqTriangle(self.ctx, drawable);
                } else if (drawable.data instanceof $.SubImage) {
                    $.renderAtlas(self.ctx, drawable);
                } else if (drawable.data instanceof $.TextWrapper) {
                    $.renderText(self.ctx, drawable);
                } else if (drawable.data instanceof $.Rectangle) {
                    $.renderRectangle(self.ctx, drawable);
                } else if (drawable.data instanceof $.DrawableLine) {
                    $.renderLine(self.ctx, drawable);
                } else if (drawable.data instanceof $.Circle) {
                    $.renderCircle(self.ctx, drawable);
                } else if (drawable.data instanceof $.ImageWrapper) {
                    $.renderImage(self.ctx, drawable);
                } else if (drawable.data instanceof $.Quadrilateral) {
                    $.renderQuadrilateral(self.ctx, drawable);
                } else if (drawable.data instanceof $.ABLine) {
                    $.renderABLine(self.ctx, drawable);
                } else if (drawable.data instanceof $.Hexagon) {
                    $.renderHexagon(self.ctx, drawable);
                }

                self.ctx.restore();
            });
        }
    };

    return Renderer;
})(Object, Math, H5);
H5.CallbackTimer = (function () {
    'use strict';

    function CallbackTimer() {
        this.todos = [];
    }

    CallbackTimer.prototype.update = function () {
        if (this.todos.length == 0) {
            return;
        }
        for (var i = this.todos.length - 1; i >= 0; i--) {
            var toAdd = this.todos[i];
            if (!toAdd) {
                continue;
            }
            if (toAdd.duration < toAdd.time) {
                toAdd.callback();

                this.todos.splice(i, 1);

            } else {
                toAdd.time++;
            }
        }
    };

    CallbackTimer.prototype.doLater = function (callback, duration, self) {
        this.in(duration, callback, self);
    };

    CallbackTimer.prototype.in = function (ticks, callback, self) {
        this.todos.push({
            duration: ticks,
            time: 0,
            callback: self ? callback.bind(self) : callback
        });
    };

    CallbackTimer.prototype.nextTick = function (callback, self) {
        this.in(-1, callback, self);
    };

    CallbackTimer.prototype.pause = function () {
        if (this.paused) {
            this.paused.push.apply(this.paused, this.todos.splice(0, this.todos.length));
        } else {
            this.paused = this.todos.splice(0, this.todos.length);
        }
    };

    CallbackTimer.prototype.resume = function () {
        this.todos.push.apply(this.todos, this.paused);
        delete this.paused;
    };

    return CallbackTimer;
})();
H5.Stage = (function (Sprites, Drawables, Paths, Animations, Math) {
    'use strict';

    function Stage(gfxCache, motions, motionTimer, motionHelper, spriteAnimations, spriteTimer, animations,
        animationHelper, animationTimer, propertyAnimations, renderer, timer, audioAnimations) {
        this.gfxCache = gfxCache;
        this.motions = motions;
        this.motionTimer = motionTimer;
        this.motionHelper = motionHelper;
        this.spriteTimer = spriteTimer;
        this.spriteAnimations = spriteAnimations;
        this.animations = animations;
        this.animationHelper = animationHelper;
        this.animationTimer = animationTimer;
        this.propertyAnimations = propertyAnimations;
        this.renderer = renderer;
        this.timer = timer;
        this.audioAnimations = audioAnimations;

        this._id = 0;
    }

    Stage.prototype.getImageWidth = function (name) {
        return Math.floor(this.gfxCache.get(name).width * this.gfxCache.defaultScaleFactor);
    };

    Stage.prototype.getImageHeight = function (name) {
        return Math.floor(this.gfxCache.get(name).height * this.gfxCache.defaultScaleFactor);
    };

    Stage.prototype.getDrawable = function (x, y, imgPathName, zIndex, alpha, rotation, scale) {
        return Drawables.getGraphic(this.gfxCache, ++this._id, x, y, imgPathName, zIndex, alpha, rotation, scale);
    };

    Stage.prototype.getDrawableText = function (x, y, zIndex, msg, size, fontFamily, color, rotation, alpha, fontStyle,
        maxLineLength, lineHeight, scale) {
        return Drawables.getTxt(this.renderer.ctx, ++this._id, x, y, zIndex, msg, size, fontFamily, color, rotation,
            alpha, fontStyle, maxLineLength, lineHeight, scale);
    };

    Stage.prototype.getDrawableRectangle = function (x, y, width, height, color, filled, lineWidth, zIndex, alpha,
        rotation, scale) {
        return Drawables.getRect(++this._id, x, y, width, height, color, filled, lineWidth, zIndex, alpha, rotation,
            scale);
    };

    Stage.prototype.getDrawableQuadrilateral = function (ax, ay, bx, by, cx, cy, dx, dy, color, filled, lineWidth,
        zIndex, alpha, rotation, scale) {
        return Drawables.getQuad(++this._id, ax, ay, bx, by, cx, cy, dx, dy, color, filled, lineWidth, zIndex, alpha,
            rotation, scale);
    };

    Stage.prototype.getDrawableABLine = function (ax, ay, bx, by, color, lineWidth, zIndex, alpha, rotation, scale) {
        return Drawables.getABLine(++this._id, ax, ay, bx, by, color, lineWidth, zIndex, alpha, rotation, scale);
    };

    Stage.prototype.getSprite = function (imgPathName, numberOfFrames, loop) {
        return Sprites.get(this.gfxCache, imgPathName, numberOfFrames, loop);
    };

    Stage.prototype.getPath = function (x, y, endX, endY, speed, spacingFn, loop) {
        return Paths.getLine(x, y, endX, endY, speed, spacingFn, loop);
    };

    Stage.prototype.getGraphic = function (imgPathName) {
        return this.gfxCache.get(imgPathName);
    };

    Stage.prototype.changeZIndex = function (drawable, newZIndex) {
        if (newZIndex !== undefined && drawable.zIndex != newZIndex) {
            this.renderer.changeZIndex(drawable, newZIndex);
        }
        return drawable;
    };

    Stage.prototype.animateFresh = function (x, y, imgPathName, numberOfFrames, loop, zIndex, alpha, rotation, scale) {
        var sprite = this.getSprite(imgPathName, numberOfFrames, loop);
        var drawable = this.getDrawable(x, y, imgPathName, zIndex, alpha, rotation, scale);

        this.animate(drawable, sprite);

        return {
            drawable: drawable,
            sprite: sprite
        };
    };

    Stage.prototype.animate = function (drawable, sprite, callback) {
        this.spriteAnimations.animate(drawable, sprite, callback);
        this.__softAdd(drawable);
    };

    Stage.prototype.__softAdd = function (drawable) {
        if (!this.renderer.has(drawable)) {
            this.renderer.add(drawable);
        }
    };

    Stage.prototype.animateLater = function (drawableToAdd, duration, callback) {
        var extendedCallback;
        if (this.renderer.has(drawableToAdd.drawable)) {
            extendedCallback = callback;
        } else {
            var self = this;
            extendedCallback = function () {
                self.renderer.add(drawableToAdd.drawable);
                if (callback) {
                    callback();
                }
            };
        }
        this.spriteTimer.animateLater(drawableToAdd, duration, extendedCallback);
    };

    Stage.prototype.moveFresh = function (x, y, imgName, endX, endY, speed, spacing, loop, callback, zIndex, alpha,
        rotation, scale) {
        var drawable = this.getDrawable(x, y, imgName, zIndex, alpha, rotation, scale);
        var path = this.getPath(x, y, endX, endY, speed, spacing, loop);

        this.move(drawable, path, callback);

        return {
            drawable: drawable,
            path: path
        };
    };

    Stage.prototype.moveFreshText = function (x, y, msg, size, fontFamily, color, endX, endY, speed, spacing, loop,
        callback, zIndex, alpha, rotation, fontStyle, maxLineLength, lineHeight) {
        var drawable = this.getDrawableText(x, y, zIndex, msg, size, fontFamily, color, rotation, alpha, fontStyle,
            maxLineLength, lineHeight);
        var path = this.getPath(x, y, endX, endY, speed, spacing, loop);

        this.move(drawable, path, callback);

        return {
            drawable: drawable,
            path: path
        };
    };

    Stage.prototype.moveFreshRoundTrip = function (x, y, imgName, endX, endY, speed, spacing, loopTheTrip, callbackTo,
        callbackReturn, zIndex, alpha, rotation, scale) {
        var drawable = this.getDrawable(x, y, imgName, zIndex, alpha, rotation, scale);
        var pathTo = this.getPath(x, y, endX, endY, speed, spacing);
        var pathReturn = this.getPath(endX, endY, x, y, speed, spacing);

        this.moveRoundTrip(drawable, pathTo, pathReturn, loopTheTrip, callbackTo, callbackReturn);

        return {
            drawable: drawable,
            pathTo: pathTo,
            pathReturn: pathReturn
        };
    };

    Stage.prototype.moveFreshLater = function (x, y, imgName, endX, endY, speed, spacing, delay, loop, callback,
        startedMovingCallback, zIndex, alpha, rotation, scale) {
        var drawable = this.getDrawable(x, y, imgName, zIndex, alpha, rotation, scale);
        var path = this.getPath(x, y, endX, endY, speed, spacing, loop);

        var movedItem = {
            drawable: drawable,
            path: path,
            callback: callback
        };
        this.moveLater(movedItem, delay, startedMovingCallback);

        return {
            drawable: drawable,
            path: path
        };
    };

    Stage.prototype.move = function (drawable, path, callback) {
        this.motions.animate(drawable, path, callback);
    };

    Stage.prototype.moveQuad = function (property, drawable, path, callback) {
        this.motions.animateQuad(property, drawable, path, callback);
    };

    Stage.prototype.moveCircular = function (drawable, x, y, radius, startAngle, endAngle, speed, spacingFn, loop,
        callback) {

        var path = Paths.getCircle(x, y, radius, startAngle, endAngle, speed, spacingFn, loop);
        this.motions.animate(drawable, path, callback);

        return path;
    };

    Stage.prototype.moveRoundTrip = function (drawable, pathTo, pathReturn, loopTheTrip, callbackTo, callbackReturn) {
        this.motionHelper.moveRoundTrip(drawable, pathTo, pathReturn, loopTheTrip, callbackTo, callbackReturn);
    };

    Stage.prototype.moveLater = function (drawableToAdd, duration, callback) {
        var extendedCallback;
        if (this.renderer.has(drawableToAdd.drawable)) {
            extendedCallback = callback;
        } else {
            var self = this;
            extendedCallback = function () {
                self.renderer.add(drawableToAdd.drawable);
                if (callback) {
                    callback();
                }
            };
        }
        this.motionTimer.moveLater(drawableToAdd, duration, extendedCallback);
    };

    Stage.prototype.drawFresh = function (x, y, imgName, zIndex, alpha, rotation, scale) {
        var drawable = this.getDrawable(x, y, imgName, zIndex, alpha, rotation, scale);
        this.draw(drawable);

        return drawable;
    };

    Stage.prototype.draw = function (drawable) {
        this.renderer.add(drawable);
    };

    Stage.prototype.drawText = function (x, y, text, size, font, color, zIndex, rotation, alpha, fontStyle,
        maxLineLength, lineHeight, scale) {
        var drawable = this.getDrawableText(x, y, zIndex, text, size, font, color, rotation, alpha, fontStyle,
            maxLineLength, lineHeight, scale);
        this.draw(drawable);

        return drawable;
    };

    Stage.prototype.drawRectangle = function (x, y, width, height, color, filled, lineWidth, zIndex, alpha, rotation,
        scale) {
        var drawable = this.getDrawableRectangle(x, y, width, height, color, filled, lineWidth, zIndex, alpha, rotation,
            scale);
        this.draw(drawable);

        return drawable;
    };

    Stage.prototype.drawQuadrilateral = function (ax, ay, bx, by, cx, cy, dx, dy, color, filled, lineWidth, zIndex,
        alpha, rotation, scale) {
        var drawable = this.getDrawableQuadrilateral(ax, ay, bx, by, cx, cy, dx, dy, color, filled, lineWidth, zIndex,
            alpha, rotation, scale);
        this.draw(drawable);

        return drawable;
    };

    Stage.prototype.drawABLine = function (ax, ay, bx, by, color, lineWidth, zIndex, alpha, rotation, scale) {
        var drawable = this.getDrawableABLine(ax, ay, bx, by, color, lineWidth, zIndex, alpha, rotation, scale);
        this.draw(drawable);

        return drawable;
    };

    Stage.prototype.drawCircle = function (x, y, radius, color, filled, lineWidth, zIndex, alpha, rotation, scale) {
        var drawable = Drawables.getCircle(++this._id, x, y, radius, color, filled, lineWidth, zIndex, alpha, rotation,
            scale);
        this.draw(drawable);
        return drawable;
    };

    Stage.prototype.drawLine = function (x, y, length, color, lineWidth, zIndex, alpha, rotation, scale) {
        var drawable = Drawables.getLine(++this._id, x, y, length, color, lineWidth, zIndex, alpha, rotation, scale);
        this.draw(drawable);
        return drawable;
    };

    Stage.prototype.drawEqTriangle = function (x, y, angle, radius, color, filled, lineWidth, zIndex, alpha, rotation,
        scale) {
        var drawable = Drawables.getEqTriangle(++this._id, x, y, angle, radius, color, filled, lineWidth, zIndex, alpha,
            rotation, scale);
        this.draw(drawable);
        return drawable;
    };

    Stage.prototype.drawHexagon = function (x, y, angle, radius, color, filled, lineWidth, zIndex, alpha, rotation,
        scale) {
        var drawable = Drawables.getHexagon(++this._id, x, y, angle, radius, color, filled, lineWidth, zIndex, alpha,
            rotation, scale);
        this.draw(drawable);
        return drawable;
    };

    Stage.prototype.animateAlpha = function (drawable, value, duration, easing, loop, callback) {
        return this.propertyAnimations.animateAlpha(drawable, value, duration, easing, loop, callback);
    };

    Stage.prototype.animateAlphaPattern = function (drawable, valuePairs, loop) {
        this.propertyAnimations.animateAlphaPattern(drawable, valuePairs, loop);
    };

    Stage.prototype.animateRotation = function (drawable, value, duration, easing, loop, callback) {
        return this.propertyAnimations.animateRotation(drawable, value, duration, easing, loop, callback);
    };

    Stage.prototype.animateRotationPattern = function (drawable, valuePairs, loop) {
        this.propertyAnimations.animateRotationPattern(drawable, valuePairs, loop);
    };

    Stage.prototype.animateScale = function (drawable, value, duration, easing, loop, callback) {
        return this.propertyAnimations.animateScale(drawable, value, duration, easing, loop, callback);
    };

    Stage.prototype.animateScalePattern = function (drawable, valuePairs, loop) {
        this.propertyAnimations.animateScalePattern(drawable, valuePairs, loop);
    };

    Stage.prototype.mask = function (drawable, pointA_x, pointA_y, pointB_x, pointB_y) {
        drawable.mask = Drawables.getMask(pointA_x, pointA_y, pointB_x - pointA_x, pointB_y - pointA_y);
        return drawable.mask;
    };

    Stage.prototype.unmask = function (drawable) {
        delete drawable.mask;
    };

    Stage.prototype.basicAnimation = function (drawable, setter, animation, callback) {
        this.animations.animate(drawable, setter, animation, callback);
    };

    Stage.prototype.basicAnimationLater = function (drawableToAdd, duration, callback) {
        this.animationTimer.animateLater(drawableToAdd, duration, callback);
    };

    Stage.prototype.basicAnimationPattern = function (drawableWrapperList, loop) {
        this.animationHelper.animateWithKeyFrames(drawableWrapperList, loop);
    };

    Stage.prototype.getAnimation = function (startValue, endValue, speed, spacingFn, loop) {
        return Animations.get(startValue, endValue, speed, spacingFn, loop);
    };

    Stage.prototype.remove = function (drawable) {
        if (this.spriteAnimations.has(drawable)) {
            this.spriteAnimations.remove(drawable);
        }
        if (this.animations.has(drawable)) {
            this.animations.remove(drawable);
        }
        if (this.motions.has(drawable)) {
            this.motions.remove(drawable);
        }
        if (this.renderer.has(drawable)) {
            this.renderer.remove(drawable);
        }
    };

    Stage.prototype.has = function (drawable) {
        return this.renderer.has(drawable) || this.motions.has(drawable) || this.spriteAnimations.has(drawable) ||
            this.animations.has(drawable);
    };

    Stage.prototype.clear = function () {
        this.renderer.clear();
    };

    Stage.prototype.update = function () {
        // move stuff
        this.timer.update();
        this.motions.update();
        this.spriteAnimations.update();
        this.animations.update();

        // draw stuff
        this.renderer.draw();
    };

    Stage.prototype.resize = function (event) {
        this.renderer.resize(event);
    };

    Stage.prototype.pause = function (drawable) {
        if (this.motions.has(drawable)) {
            this.motions.pause(drawable);
        }
        if (this.animations.has(drawable)) {
            this.animations.pause(drawable);
        }
        if (this.spriteAnimations.has(drawable)) {
            this.spriteAnimations.pause(drawable);
        }
    };

    Stage.prototype.play = function (drawable) {
        if (this.motions.has(drawable)) {
            this.motions.play(drawable);
        }
        if (this.animations.has(drawable)) {
            this.animations.play(drawable);
        }
        if (this.spriteAnimations.has(drawable)) {
            this.spriteAnimations.play(drawable);
        }
    };

    Stage.prototype.pauseAll = function () {
        this.motions.pauseAll();
        this.animations.pauseAll();
        this.spriteAnimations.pauseAll();
    };

    Stage.prototype.playAll = function () {
        this.motions.playAll();
        this.animations.playAll();
        this.spriteAnimations.playAll();
    };

    Stage.prototype.animateVolume = function (audio, value, duration, easing, loop, callback) {
        return this.audioAnimations.animateVolume(audio, value, duration, easing, loop, callback);
    };

    return Stage;
})(H5.Sprites, H5.Drawables, H5.Paths, H5.Animations, Math);
H5.Setter = (function (changeCoords) {
    'use strict';

    return {
        setAlpha: function (drawable, alpha) {
            drawable.alpha = alpha;
            return drawable;
        },

        setRotation: function (drawable, rotation) {
            drawable.rotation = rotation;
            return drawable;
        },

        setScale: function (drawable, scale) {
            drawable.scale = scale || 1;
            return drawable;
        },

        setColor: function (drawable, color) {
            drawable.data.color = color;
            return drawable;
        },

        setTextMessage: function (drawable, msg) {
            drawable.data.msg = msg;
            return drawable;
        },

        setTextFont: function (drawable, font) {
            drawable.data.fontFamily = font;
            return drawable;
        },

        setTextStyle: function (drawable, style) {
            drawable.data.fontStyle = style;
            return drawable;
        },

        setPosition: function (addToResizer, screen, drawable, xFn, yFn, resizeDependencies) {
            drawable.x = xFn(screen.width, screen.height);
            drawable.y = yFn(screen.height, screen.width);

            addToResizer(drawable, function (width, height) {
                changeCoords(drawable, xFn(width, height), yFn(height, width));
            }, resizeDependencies);

            return drawable;
        },

        setAnchor: function (addToResizer, screen, drawable, xFn, yFn, resizeDependencies) {
            drawable.anchorOffsetX = xFn(screen.width, screen.height);
            drawable.anchorOffsetY = yFn(screen.height, screen.width);

            addToResizer(drawable, function (width, height) {
                drawable.anchorOffsetX = xFn(width, height);
                drawable.anchorOffsetY = yFn(height, width);
            }, resizeDependencies);

            return drawable;
        },

        setQuadPosition: function (addToResizer, screen, drawable, property, xFn, yFn, resizeDependencies) {
            drawable.data[property + 'x'] = xFn(screen.width, screen.height);
            drawable.data[property + 'y'] = yFn(screen.height, screen.width);

            addToResizer(drawable, function (width, height) {
                drawable.data[property + 'x'] = xFn(width, height);
                drawable.data[property + 'y'] = yFn(height, width);
            }, resizeDependencies);

            return drawable;
        },

        setQuadTotal: function (addToResizer, screen, drawable, a_xFn, a_yFn, b_xFn, b_yFn, c_xFn, c_yFn, d_xFn, d_yFn,
            resizeDependencies) {
            drawable.data.ax = a_xFn(screen.width, screen.height);
            drawable.data.ay = a_yFn(screen.height, screen.width);
            drawable.data.bx = b_xFn(screen.width, screen.height);
            drawable.data.by = b_yFn(screen.height, screen.width);
            drawable.data.cx = c_xFn(screen.width, screen.height);
            drawable.data.cy = c_yFn(screen.height, screen.width);
            drawable.data.dx = d_xFn(screen.width, screen.height);
            drawable.data.dy = d_yFn(screen.height, screen.width);

            addToResizer(drawable, function (width, height) {
                drawable.data.ax = a_xFn(width, height);
                drawable.data.ay = a_yFn(height, width);
                drawable.data.bx = b_xFn(width, height);
                drawable.data.by = b_yFn(height, width);
                drawable.data.cx = c_xFn(width, height);
                drawable.data.cy = c_yFn(height, width);
                drawable.data.dx = d_xFn(width, height);
                drawable.data.dy = d_yFn(height, width);
            }, resizeDependencies);

            return drawable;
        },

        setTextSize: function (addToResizer, screen, drawable, sizeFn, resizeDependencies) {
            drawable.data.size = sizeFn(screen.width, screen.height);
            addToResizer(drawable, function (width, height) {
                drawable.data.size = sizeFn(width, height);
            }, resizeDependencies);

            return drawable;
        },

        setTextMaxLineLength: function (addToResizer, screen, drawable, maxLineLengthFn, resizeDependencies) {
            drawable.data.maxLineLength = maxLineLengthFn(screen.width, screen.height);
            addToResizer(drawable, function (width, height) {
                drawable.data.maxLineLength = maxLineLengthFn(width, height);
            }, resizeDependencies);

            return drawable;
        },

        setTextLineHeight: function (addToResizer, screen, drawable, lineHeightFn, resizeDependencies) {
            drawable.data.lineHeight = lineHeightFn(screen.height, screen.width);
            addToResizer(drawable, function (width, height) {
                drawable.data.lineHeight = lineHeightFn(height, width);
            }, resizeDependencies);

            return drawable;
        },

        setTextBaseLine: function (drawable, baseLineValue) {
            drawable.data.baseLine = baseLineValue;
        },

        setTextAlign: function (drawable, alignValue) {
            drawable.data.align = alignValue;
        },

        setLength: function (addToResizer, screen, drawable, lengthFn, resizeDependencies) {
            drawable.data.length = lengthFn(screen.width, screen.height);
            addToResizer(drawable, function (width, height) {
                drawable.data.length = lengthFn(width, height);
            }, resizeDependencies);

            return drawable;
        },

        setWidth: function (addToResizer, screen, drawable, widthFn, resizeDependencies) {
            drawable.data.width = widthFn(screen.width, screen.height);
            addToResizer(drawable, function (width, height) {
                drawable.data.width = widthFn(width, height);
            }, resizeDependencies);

            return drawable;
        },

        setHeight: function (addToResizer, screen, drawable, heightFn, resizeDependencies) {
            drawable.data.height = heightFn(screen.height, screen.width);
            addToResizer(drawable, function (width, height) {
                drawable.data.height = heightFn(height, width);
            }, resizeDependencies);

            return drawable;
        },

        setLineWidth: function (addToResizer, screen, drawable, lineWidthFn, resizeDependencies) {
            drawable.data.lineWidth = lineWidthFn(screen.width, screen.height);
            addToResizer(drawable, function (width, height) {
                drawable.data.lineWidth = lineWidthFn(width, height);
            }, resizeDependencies);

            return drawable;
        },

        setLineDash: function (addToResizer, screen, drawable, lineDashSet, resizeDependencies) {
            drawable.data.lineDash = [
                lineDashSet[0](screen.width, screen.height), lineDashSet[1](screen.width, screen.height)
            ];
            addToResizer(drawable, function (width, height) {
                drawable.data.lineDash[0] = lineDashSet[0](width, height);
                drawable.data.lineDash[1] = lineDashSet[1](width, height);
            }, resizeDependencies);

            return drawable;
        },

        setFilled: function (drawable, filled) {
            drawable.data.filled = filled;
            return drawable;
        },

        setRadius: function (addToResizer, screen, drawable, radiusFn, resizeDependencies) {
            drawable.data.radius = radiusFn(screen.width, screen.height);
            addToResizer(drawable, function (width, height) {
                drawable.data.radius = radiusFn(width, height);
            }, resizeDependencies);

            return drawable;
        },

        setAngle: function (drawable, angle) {
            drawable.data.angle = angle;
            return drawable;
        },

        setGraphic: function (stage, drawable, imgName) {
            drawable.data = stage.getGraphic(imgName);
            return drawable;
        },

        setMask: function (drawable, drawableShapeMask) {
            drawableShapeMask.hide();
            drawable.mask = drawableShapeMask;
        }
    };
})(H5.changeCoords);
H5.EntityServices = (function (Transition, changePath, changeCoords) {
    'use strict';

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
                if (path.__callback) {
                    path.__callback();
                }
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
                if (path.__callback) {
                    path.__callback();
                }
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
                if (path.__callback) {
                    path.__callback();
                }
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
                if (animation.__callback) {
                    animation.__callback();
                }
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
                if (animation.__callback) {
                    animation.__callback();
                }
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
                if (animation.__callback) {
                    animation.__callback();
                }
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
                if (drawable.__callback) {
                    drawable.__callback();
                }
            };
            stage.animate(drawable, sprite, enhancedCallBack);

            return drawable;
        },
        volumeTo: function (stage, audio, volume) {
            var enhancedCallBack = function () {
                if (animation.__callback) {
                    animation.__callback();
                }
            };
            var animation = stage.animateVolume(audio, volume, 120, Transition.LINEAR, false, enhancedCallBack);
            return addServiceMethods(animation);
        }
    };
})(H5.Transition, H5.changePath, H5.changeCoords);
H5.NewStageAPI = (function (Setter, iterateEntries, EntityServices) {
    'use strict';

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

    /**
     * creates a new image drawable
     *
     * @param imgName
     * @return Drawable
     */
    NewStageAPI.prototype.createImage = function (imgName) {
        return addImageServiceMethods(addServiceMethods(this.stage.drawFresh(0, 0, imgName), this), this);
    };

    /**
     * creates a new text drawable
     *
     * @param text
     * @return Drawable
     */
    NewStageAPI.prototype.createText = function (text) {
        var drawable = this.stage.drawText(0, 0, text, 60, 'Arial', 'black');
        return addTextServiceMethods(addServiceMethods(drawable, this), this);
    };

    /**
     * creates a new rectangle drawable
     *
     * @param filled default false
     * @return Drawable
     */
    NewStageAPI.prototype.createRectangle = function (filled) {
        var drawable = this.stage.drawRectangle(0, 0, 100, 100, 'black', filled);
        return addRectangleServiceMethods(addServiceMethods(drawable, this), this);
    };

    NewStageAPI.prototype.createQuadrilateral = function (filled) {
        var drawable = this.stage.drawQuadrilateral(0, 0, 0, 100, 100, 100, 100, 0, 'black', filled);
        return addQuadrilateralServiceMethods(drawable, this);
    };

    NewStageAPI.prototype.createABLine = function () {
        var drawable = this.stage.drawABLine(0, 0, 0, 100, 'black');
        return addABLineServiceMethods(drawable, this);
    };

    /**
     * creates a new circle drawable
     *
     * @param filled default false
     * @return Drawable
     */
    NewStageAPI.prototype.createCircle = function (filled) {
        var drawable = this.stage.drawCircle(0, 0, 100, 'black', filled);
        return addCircleServiceMethods(addServiceMethods(drawable, this), this);
    };

    /**
     * creates a new line drawable
     *
     * @return Drawable
     */
    NewStageAPI.prototype.createLine = function () {
        var drawable = this.stage.drawLine(0, 0, 100, 'black');
        return addLineServiceMethods(addServiceMethods(drawable, this), this);
    };

    /**
     * creates a new triangle drawable
     *
     * @param filled default false
     * @return Drawable
     */
    NewStageAPI.prototype.createEqTriangle = function (filled) {
        var drawable = this.stage.drawEqTriangle(0, 0, 0, 100, 'black', filled);
        return addEqTriangleServiceMethods(addServiceMethods(drawable, this), this);
    };

    NewStageAPI.prototype.createHexagon = function (filled) {
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
        //drawable.setQuadPosition = Setter.setQuadPosition.bind(undefined, self.resizer.add.bind(self.resizer,
        // 'position'), self.screen, drawable);
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
        if (this.gfx && this.gfx.resize) {
            this.gfx.resize(event);
        }
        this.stage.resize(event);
        this.resizer.call(event.width, event.height);
        iterateEntries(this.collisions, function (detector) {
            detector.resize(event);
        });
    };

    NewStageAPI.prototype.getGraphic = function (imgPathName) {
        return this.stage.getGraphic(imgPathName);
    };

    NewStageAPI.prototype.playAll = function () {
        this.stage.playAll();
    };

    NewStageAPI.prototype.pauseAll = function () {
        this.stage.pauseAll();
    };

    NewStageAPI.prototype.audioVolumeTo = function (audio, volume) {
        return EntityServices.volumeTo(this.stage, audio, volume);
    };

    return NewStageAPI;
})(H5.Setter, H5.iterateEntries, H5.EntityServices);
H5.ImageCache = (function (ImageWrapper, iterateEntries) {
    'use strict';

    //noinspection JSUnusedLocalSymbols
    function ImageCache(width, height, defaultScreenHeight) {
        this.defaultScreenHeight = defaultScreenHeight || 3840;
        this.imgDict = {};
        this.defaultScaleFactor = height / this.defaultScreenHeight;
    }

    ImageCache.prototype.add = function (key, img) {
        this.imgDict[key] = new ImageWrapper(img, img.width, img.height, this.defaultScaleFactor);
    };

    ImageCache.prototype.get = function (key) {
        return this.imgDict[key];
    };

    ImageCache.prototype.resize = function (event) {
        var newScaleFactor = this.defaultScaleFactor = event.height / this.defaultScreenHeight;
        iterateEntries(this.imgDict, function (img) {
            img.scale = newScaleFactor;
        });
    };

    return ImageCache;
})(H5.ImageWrapper, H5.iterateEntries);
H5.AtlasCache = (function (SubImage, Math, iterateEntries) {
    'use strict';

    //noinspection JSUnusedLocalSymbols
    function AtlasCache(width, height, defaultScreenHeight) {
        this.defaultScreenHeight = defaultScreenHeight || 3840;
        this.atlasDict = {};
        this.defaultScaleFactor = height / this.defaultScreenHeight;
    }

    AtlasCache.prototype.init = function (atlasInfos) {
        var self = this;
        atlasInfos.forEach(function (atlasInfoWrapper) {
            var atlas = atlasInfoWrapper.atlas;
            var info = atlasInfoWrapper.info;
            info.frames.forEach(function (elem) {
                self.atlasDict[elem.filename] = self._createSubImage(elem, atlas, self.defaultScaleFactor);
            });
        });
    };

    AtlasCache.prototype._getOffSetFromCenterX = function (elem, scale) {
        return Math.floor((elem.spriteSourceSize.x - elem.sourceSize.w * 0.5) * scale);
    };

    AtlasCache.prototype._getOffSetFromCenterY = function (elem, scale) {
        return Math.floor((elem.spriteSourceSize.y - elem.sourceSize.h * 0.5) * scale);
    };

    AtlasCache.prototype._createSubImage = function (elem, atlas, scale) {
        return new SubImage(elem.frame.x, elem.frame.y, elem.frame.w, elem.frame.h, this._getOffSetFromCenterX(elem, 1),
            this._getOffSetFromCenterY(elem, 1), elem.spriteSourceSize.w, elem.spriteSourceSize.h,
            this._getOffSetFromCenterX(elem, scale), this._getOffSetFromCenterY(elem, scale),
            elem.spriteSourceSize.w * scale, elem.spriteSourceSize.h * scale, atlas);
    };

    AtlasCache.prototype.get = function (key) {
        return this.atlasDict[key];
    };

    AtlasCache.prototype.resize = function (event) {
        var scale = this.defaultScaleFactor = event.height / this.defaultScreenHeight;
        iterateEntries(this.atlasDict, function (subImage) {
            subImage.scaledOffSetX = Math.floor(subImage.offSetX * scale);
            subImage.scaledOffSetY = Math.floor(subImage.offSetY * scale);
            subImage.scaledTrimmedWidth = Math.floor(subImage.trimmedWidth * scale);
            subImage.scaledTrimmedHeight = Math.floor(subImage.trimmedHeight * scale);
        });
    };

    return AtlasCache;
})(H5.SubImage, Math, H5.iterateEntries);
H5.installOneTimeTap = (function (window) {
    'use strict';

    function installOneTimeTap(element, callback) {
        if ('ontouchstart' in window) {
            element.addEventListener('touchstart', handleClick);
        }

        element.addEventListener('click', handleClick);
        function handleClick(event) {
            event.preventDefault();

            if ('ontouchstart' in window) {
                element.removeEventListener('touchstart', handleClick);
            }

            element.removeEventListener('click', handleClick);

            callback(event);
        }
    }

    return installOneTimeTap;
})(window);
H5.Orientation = {
    PORTRAIT: 0,
    LANDSCAPE: 1
};
H5.range = (function (Math) {
    'use strict';

    function range(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    return range;
})(Math);
H5.SelectionList = (function () {
    'use strict';

    function SelectionList() {
        this.options = [];
        this.selection = null;
    }

    SelectionList.prototype.add = function (drawable, callback, self) {
        var item = {
            selection: drawable,
            callback: self ? callback.bind(self) : callback
        };

        if (this.options.length == 0) {
            this.selection = item.callback;
        }
        if (this.options.length != 0) {
            drawable.setShow(false);
        }

        this.options.push(item);
    };

    SelectionList.prototype.previous = function () {
        var newSelection = this.options.pop();
        newSelection.selection.show = true;
        if (this.options[0]) {
            this.options[0].selection.show = false;
        }
        this.options.unshift(newSelection);

        this.selection = newSelection.callback;
    };

    SelectionList.prototype.next = function () {
        this.options.push(this.options.shift());
        this.options[this.options.length - 1].selection.show = false;
        this.options[0].selection.show = true;

        this.selection = this.options[0].callback;
    };

    SelectionList.prototype.execute = function () {
        this.selection();
    };

    return SelectionList;
})();
H5.MVVMScene = (function (iterateEntries, Width, Height, Event, Math, calcScreenConst, add, multiply, subtract,
    CallbackCounter) {
    'use strict';

    function MVVMScene(model, view, viewModel, viewName, parentSceneRect, anchorXFn, anchorYFn) {
        this.services = model;

        this.stage = model.stage;
        this.sceneStorage = model.sceneStorage;
        this.messages = model.messages;
        this.timer = model.timer;
        this.device = model.device;
        this.loop = model.loop;
        this.events = model.events;

        this.view = view;
        this.viewModel = viewModel;
        this.viewName = viewName;

        // sub scene
        this.parentSceneRect = parentSceneRect;
        this.anchorXFn = anchorXFn;
        this.anchorYFn = anchorYFn;
    }

    MVVMScene.prototype.show = function (next, customParam) {
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
            if (paused) {
                return;
            }

            if (pointer.type == 'up') {
                taps.some(function (tap) {
                    if (isHit(pointer, tap.rectangle)) {
                        if (tap.up) {
                            tap.up(pointer);
                        }
                        return true;
                    }
                    return false;
                });
            } else if (pointer.type == 'down') {
                taps.some(function (tap) {
                    if (isHit(pointer, tap.rectangle)) {
                        if (tap.down) {
                            tap.down(pointer);
                        }
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
                return function (width, height) {
                    return calcScreenConst(height, self.parentSceneRect.height, size);
                };
            }

            return function (width, height) {
                return calcScreenConst(height, sceneRect.height, size);
            };
        }

        function widthFn(width) {
            if (self.parentSceneRect) {
                return function (screenWidth) {
                    var subSceneWidth = calcScreenConst(screenWidth, self.parentSceneRect.width, sceneRect.width);
                    return calcScreenConst(subSceneWidth, sceneRect.height, width);
                };
            }
            return Width.get(sceneRect.width, width);
        }

        function heightFn(height) {
            if (self.parentSceneRect) {
                return function (screenHeight) {
                    var subSceneHeight = calcScreenConst(screenHeight, self.parentSceneRect.height, sceneRect.height);
                    return calcScreenConst(subSceneHeight, sceneRect.height, height);
                };
            }
            return Height.get(sceneRect.height, height);
        }

        function getTagValue(name) {
            return function (tags) {
                var returnValue = null;
                var foundSmth = tags.some(function (tag) {
                    if (tag[name] != undefined) {
                        returnValue = tag[name];
                        return true;
                    }
                    return false;
                });
                if (foundSmth) {
                    return returnValue;
                }
                return false;
            };
        }

        function hasPositionTag_relativeToSize(tags) {
            return tags.some(function (tag) {
                return tag.position == 'relativeToSize';
            });
        }

        function getXPositionRelativeToSize_anchorWithHalf(sceneRect, relativeToSize_elemHeight, x) {
            if (self.anchorXFn && self.parentSceneRect) {
                return function (width, height) {
                    return Math.floor(width / 2 + ((x - self.parentSceneRect.width / 2) / relativeToSize_elemHeight) *
                        yFn(relativeToSize_elemHeight)(height));
                };
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
                    //if (hasAnchorTag_left(elem.tags)) {
                    //    x = getXPositionRelativeToSize_anchorLeft(elem.height, elem.x);
                    //
                    //} else {
                    // very specific use case
                    x = getXPositionRelativeToSize_anchorWithHalf(sceneRect, elem.height, elem.x);
                    //}
                }

                var drawable;
                if (elem.type == 'image') {
                    var imgName = elem.filename.substring(0, elem.filename.lastIndexOf('.'));

                    drawable = this.stage.createImage(imgName).setPosition(x, y).setAlpha(elem.alpha)
                        .setRotation(elem.rotation).setScale(elem.scale);
                    if (elem.zIndex != undefined && elem.zIndex != 3) {
                        drawable.setZIndex(elem.zIndex);
                    }

                    drawables.push(drawable);
                    if (elem.viewId) {
                        this.viewModel[elem.viewId] = drawable;
                    }

                } else if (elem.type == 'text') {

                    var txtKey = elem.tags ? getTagValue('txt')(elem.tags) : undefined;
                    var msg = txtKey ? self.messages.get(self.viewName, txtKey) : elem.msg;

                    drawable = this.stage.createText(msg).setPosition(x, y).setSize(txtSize(elem.size))
                        .setFont(elem.font).setColor(elem.color).setRotation(elem.rotation).setAlpha(elem.alpha)
                        .setScale(elem.scale);
                    if (elem.fontStyle && elem.fontStyle.trim().toLowerCase() != 'regular' &&
                        elem.fontStyle.trim().toLowerCase() != 'normal') {
                        var style = elem.fontStyle.trim().toLowerCase();
                        drawable.setStyle(style == 'light' ? 'lighter' : style);
                    }

                    var baseLine = elem.tags ? getTagValue('baseLine')(elem.tags) : false;
                    if (baseLine) {
                        drawable.setBaseLine(baseLine);
                    }

                    var align = elem.tags ? getTagValue('align')(elem.tags) : false;
                    if (align) {
                        drawable.setAlign(align);
                    }

                    if (elem.zIndex != undefined && elem.zIndex != 3) {
                        drawable.setZIndex(elem.zIndex);
                    }

                    if (txtKey) {
                        self.messages.add(drawable, drawable.data, self.viewName, txtKey);
                    }

                    drawables.push(drawable);
                    if (elem.viewId) {
                        this.viewModel[elem.viewId] = drawable;
                    }

                } else if (elem.type == 'line') {
                    drawable = this.stage.createLine().setPosition(x, y).setLength(txtSize(elem.length))
                        .setColor(elem.color);

                    drawable.setLineWidth(txtSize(elem.lineWidth));
                    drawable.setAlpha(elem.alpha).setRotation(elem.rotation).setScale(elem.scale);

                    if (elem.zIndex != undefined && elem.zIndex != 3) {
                        drawable.setZIndex(elem.zIndex);
                    }

                    drawables.push(drawable);

                    if (elem.viewId) {
                        this.viewModel[elem.viewId] = drawable;
                    }

                } else if (elem.type == 'circle') {
                    drawable = this.stage.createCircle(elem.filled).setPosition(x, y).setRadius(txtSize(elem.radius))
                        .setColor(elem.color);

                    drawable.setLineWidth(txtSize(elem.lineWidth));
                    drawable.setAlpha(elem.alpha);

                    if (elem.zIndex != undefined && elem.zIndex != 3) {
                        drawable.setZIndex(elem.zIndex);
                    }

                    drawables.push(drawable);

                    if (elem.viewId) {
                        this.viewModel[elem.viewId] = drawable;
                    }

                } else if (elem.type == 'rectangle') {
                    var isInput = !elem.tags ? false : elem.tags.some(function (tag) {
                        return tag == 'input';
                    });
                    if (isInput) {
                        var pointerUpFnName = null;
                        var hasUp = elem.tags.some(function (tag) {
                            var foundSmth = tag.up !== undefined;
                            if (foundSmth) {
                                pointerUpFnName = tag.up;
                            }
                            return foundSmth;
                        });

                        var pointerDownFnName = null;
                        var hasDown = elem.tags.some(function (tag) {
                            var foundSmth = tag.down !== undefined;
                            if (foundSmth) {
                                pointerDownFnName = tag.down;
                            }
                            return foundSmth;
                        });

                        var resetFnName = null;
                        var hasReset = elem.tags.some(function (tag) {
                            var foundSmth = tag.reset !== undefined;
                            if (foundSmth) {
                                resetFnName = tag.reset;
                            }
                            return foundSmth;
                        });

                        drawable = this.stage.createRectangle().setPosition(x, y).setWidth(widthFn(elem.width))
                            .setHeight(heightFn(elem.height)).setColor('blue');
                        drawable.setZIndex(11);
                        drawable.hide();

                        drawable.removeInput = function () {
                            taps.some(function (tap, index, array) {
                                if (tap.rectangle.id == this.id) {
                                    array.splice(index, 1);
                                    return true;
                                }
                                return false;
                            }, this);
                        };

                        if (elem.viewId) {
                            this.viewModel[elem.viewId] = drawable;
                        }

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

                        drawable = this.stage.createRectangle(elem.filled).setPosition(x, y)
                            .setWidth(widthFn(elem.width)).setHeight(heightFn(elem.height)).setColor(elem.color)
                            .setAlpha(elem.alpha).setRotation(elem.rotation).setScale(elem.scale);
                        if (elem.zIndex != undefined && elem.zIndex != 3) {
                            drawable.setZIndex(elem.zIndex);
                        }

                        if (elem.lineWidth !== undefined) {
                            drawable.setLineWidth(txtSize(elem.lineWidth));
                        }
                        if (elem.lineWidth !== undefined && elem.lineDash !== undefined) {
                            var dashSet = [
                                txtSize(elem.lineDash[0] * elem.lineWidth), txtSize(elem.lineDash[1] * elem.lineWidth)
                            ];
                            drawable.setLineDash(dashSet);
                        } else if (elem.lineDash !== undefined) {
                            drawable.setLineDash([txtSize(elem.lineDash[0]), txtSize(elem.lineDash[1])]);
                        }

                        drawables.push(drawable);

                        if (elem.viewId) {
                            this.viewModel[elem.viewId] = drawable;
                        }
                    }

                } else if (elem.type == 'button') {

                    var btnUpFnName = null;
                    var hasBtnUp = elem.input.tags.some(function (tag) {
                        var foundSmth = tag.up !== undefined;
                        if (foundSmth) {
                            btnUpFnName = tag.up;
                        }
                        return foundSmth;
                    });
                    var btnDownFnName = null;
                    var hasBtnDown = elem.input.tags.some(function (tag) {
                        var foundSmth = tag.down !== undefined;
                        if (foundSmth) {
                            btnDownFnName = tag.down;
                        }
                        return foundSmth;
                    });
                    var btnResetFnName = null;
                    var hasBtnReset = elem.input.tags.some(function (tag) {
                        var foundSmth = tag.reset !== undefined;
                        if (foundSmth) {
                            btnResetFnName = tag.reset;
                        }
                        return foundSmth;
                    });

                    drawable = this.stage.createRectangle().setPosition(xFn(elem.input.x), yFn(elem.input.y))
                        .setWidth(xFn(elem.input.width)).setHeight(yFn(elem.input.height)).setColor('#fff');
                    drawable.hide();

                    if (elem.input.viewId) {
                        this.viewModel[elem.input.viewId] = drawable;
                    }

                    taps.push({
                        rectangle: drawable,
                        up: hasBtnUp ? this.viewModel[btnUpFnName].bind(this.viewModel) : undefined,
                        down: hasBtnDown ? this.viewModel[btnDownFnName].bind(this.viewModel) : undefined,
                        reset: hasBtnReset ? this.viewModel[btnResetFnName].bind(this.viewModel) : undefined
                    });
                    drawables.push(drawable);

                    var btnTxtKey = getTagValue('txt')(elem.text.tags);
                    var btnMsg = btnTxtKey ? self.messages.get(self.viewName, btnTxtKey) : elem.text.msg;

                    drawable = this.stage.createText(btnMsg).setPosition(xFn(elem.text.x), yFn(elem.text.y))
                        .setSize(txtSize(elem.text.size)).setFont(elem.text.font).setColor(elem.text.color)
                        .setRotation(elem.text.rotation).setAlpha(elem.text.alpha).setScale(elem.text.scale);
                    if (elem.zIndex + 1 != 3) {
                        drawable.setZIndex(elem.zIndex + 1);
                    }
                    drawables.push(drawable);

                    if (elem.text.viewId) {
                        this.viewModel[elem.text.viewId] = drawable;
                    }

                    if (btnTxtKey) {
                        self.messages.add(drawable, drawable.data, self.viewName, btnTxtKey);
                    }

                    if (elem.background.type == 'image') {
                        var bgName = elem.background.filename.substring(0, elem.background.filename.lastIndexOf('.'));
                        drawable = this.stage.createImage(bgName)
                            .setPosition(xFn(elem.background.x), yFn(elem.background.y)).setAlpha(elem.background.alpha)
                            .setRotation(elem.background.rotation).setScale(elem.background.scale);
                        if (elem.zIndex != undefined && elem.zIndex != 3) {
                            drawable.setZIndex(elem.zIndex);
                        }
                        drawables.push(drawable);

                        if (elem.background.viewId) {
                            this.viewModel[elem.background.viewId] = drawable;
                        }

                    } else if (elem.background.type == 'rectangle') {
                        drawable = this.stage.createRectangle(elem.background.filled)
                            .setPosition(xFn(elem.background.x), yFn(elem.background.y))
                            .setWidth(xFn(elem.background.width)).setHeight(yFn(elem.background.height))
                            .setColor(elem.background.color).setAlpha(elem.background.alpha)
                            .setRotation(elem.background.rotation).setScale(elem.background.scale);
                        if (elem.zIndex != undefined && elem.zIndex != 3) {
                            drawable.setZIndex(elem.zIndex);
                        }
                        drawables.push(drawable);

                        if (elem.background.viewId) {
                            this.viewModel[elem.background.viewId] = drawable;
                        }
                    }

                }

                if (elem.mask) {
                    var maskX = xFn(elem.mask.x);
                    var maskY = yFn(elem.mask.y);

                    if (isRelativeToSize_widthHalf) {
                        // very specific use case
                        maskX = getXPositionRelativeToSize_anchorWithHalf(sceneRect, elem.mask.height, elem.mask.x);
                    }

                    var mask = this.stage.createRectangle().setPosition(maskX, maskY).setWidth(xFn(elem.mask.width))
                        .setHeight(yFn(elem.mask.height)).setRotation(elem.mask.rotation);
                    if (self.parentSceneRect) {
                        var maskWidth = function (maskWidth) {
                            return function (width) {
                                return calcScreenConst(width, self.parentSceneRect.width, maskWidth);
                            };
                        };
                        var maskHeight = function (maskHeight) {
                            return function (height) {
                                return calcScreenConst(height, self.parentSceneRect.height, maskHeight);
                            };
                        };
                        mask.setWidth(maskWidth(elem.mask.width)).setHeight(maskHeight(elem.mask.height));
                    }
                    drawable.setMask(mask);
                }

                // at the moment it's not possible to move a button, because drawable ref points only to a single elem
                if (elem.animations) {
                    var animationTiming = elem.animations.lastFrame;
                    elem.tags.some(function (tag) {
                        var foundSmth = tag.time !== undefined;
                        if (foundSmth) {
                            animationTiming = parseInt(tag.time);
                        }
                        return foundSmth;
                    });
                    var isLoop = true;
                    elem.tags.some(function (tag) {
                        var foundSmth = tag.loop !== undefined;
                        if (foundSmth) {
                            isLoop = tag.loop == 'true';
                        }
                        return foundSmth;
                    });
                    var isInitialDelay = true;
                    elem.tags.some(function (tag) {
                        var foundSmth = tag.initialDelay !== undefined;
                        if (foundSmth) {
                            isInitialDelay = tag.initialDelay == 'true';
                        }
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
                        moveWithKeyFrames(drawable, currentFrame, animations.position.slice(), isLoop, isInitialDelay,
                            animationTiming, customXFn, undefined, callback ? callback.register() : undefined);
                    }
                    if (animations.opacity) {
                        var currentOpacityFrame = {
                            opacity: elem.alpha,
                            time: 0
                        };
                        fadeWithKeyFrames(drawable, currentOpacityFrame, animations.opacity.slice(), isLoop,
                            isInitialDelay, animationTiming, callback ? callback.register() : undefined);
                    }
                    if (animations.scale) {
                        var currentScaleFrame = {
                            scale: elem.scale,
                            time: 0
                        };
                        scaleWithKeyFrames(drawable, currentScaleFrame, animations.scale.slice(), isLoop,
                            isInitialDelay, animationTiming, callback ? callback.register() : undefined);
                    }
                    if (animations.rotation) {
                        var currentRotationFrame = {
                            rotation: elem.rotation,
                            time: 0
                        };
                        rotateWithKeyFrames(drawable, currentRotationFrame, animations.rotation.slice(), isLoop,
                            isInitialDelay, animationTiming, callback ? callback.register() : undefined);
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
                        moveWithKeyFrames(mask, currentMaskFrame, animations.position.slice(), isLoop, isInitialDelay,
                            animationTiming, customMaskXFn, undefined, callback ? callback.register() : undefined);
                    }
                    if (animations.scale) {
                        var currentMaskScaleFrame = {
                            scale: elem.mask.scale,
                            time: 0
                        };
                        scaleWithKeyFrames(mask, currentMaskScaleFrame, animations.scale.slice(), isLoop,
                            isInitialDelay, animationTiming, callback ? callback.register() : undefined);
                    }
                    if (animations.rotation) {
                        var currentMaskRotationFrame = {
                            rotation: elem.mask.rotation,
                            time: 0
                        };
                        rotateWithKeyFrames(mask, currentMaskRotationFrame, animations.rotation.slice(), isLoop,
                            isInitialDelay, animationTiming, callback ? callback.register() : undefined);
                    }
                }

                function fadeWithKeyFrames(drawable, currentFrame, frames, loop, initialDelay, timing, callback) {
                    if (loop) {
                        var framesCopy = frames.slice();
                    }

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

                                self.timer.in(duration, continueMove);
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
                            if (itIsOver) {
                                return;
                            }

                            if (frames.length > 0) {
                                move(frames.shift(), frame);
                            } else if (loop) {

                                if (timing) {
                                    var restart = function () {
                                        if (itIsOver) {
                                            return;
                                        }
                                        if (initialDelay) {
                                            drawable.setAlpha(currentFrame.opacity);
                                            fadeWithKeyFrames(drawable, currentFrame, framesCopy, loop, initialDelay,
                                                timing);
                                        } else {
                                            drawable.setAlpha(framesCopy[0].opacity);
                                            fadeWithKeyFrames(drawable, framesCopy[0], framesCopy, loop, initialDelay,
                                                timing);
                                        }
                                    };

                                    var duration = (timing - frame.time) * 2 - 1;
                                    //if (duration < 1) {
                                    //    restart();
                                    //} else {
                                    self.timer.in(duration, restart);
                                    //}
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
                                if (callback) {
                                    callback();
                                }
                            }
                        }
                    }
                }

                function rotateWithKeyFrames(drawable, currentFrame, frames, loop, initialDelay, timing, callback) {
                    if (loop) {
                        var framesCopy = frames.slice();
                    }

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
                                self.timer.in(duration, continueMove);
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
                            if (itIsOver) {
                                return;
                            }

                            if (frames.length > 0) {
                                move(frames.shift(), frame);
                            } else if (loop) {
                                if (timing) {
                                    var restart = function () {
                                        if (itIsOver) {
                                            return;
                                        }
                                        if (initialDelay) {
                                            drawable.setRotation(currentFrame.rotation);
                                            rotateWithKeyFrames(drawable, currentFrame, framesCopy, loop, initialDelay,
                                                timing);
                                        } else {
                                            drawable.setRotation(framesCopy[0].rotation);
                                            rotateWithKeyFrames(drawable, framesCopy[0], framesCopy, loop, initialDelay,
                                                timing);
                                        }
                                    };
                                    var duration = (timing - frame.time) * 2 - 2;
                                    if (duration < 1) {
                                        restart();
                                    } else {
                                        self.timer.in(duration, restart);
                                    }
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
                                if (callback) {
                                    callback();
                                }
                            }
                        }
                    }
                }

                function scaleWithKeyFrames(drawable, currentFrame, frames, loop, initialDelay, timing, callback) {
                    if (loop) {
                        var framesCopy = frames.slice();
                    }

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
                                self.timer.in(duration, continueMove);
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
                            if (itIsOver) {
                                return;
                            }

                            if (frames.length > 0) {
                                move(frames.shift(), frame);
                            } else if (loop) {

                                if (timing) {
                                    var restart = function () {
                                        if (itIsOver) {
                                            return;
                                        }
                                        if (initialDelay) {
                                            drawable.setScale(currentFrame.scale);
                                            scaleWithKeyFrames(drawable, currentFrame, framesCopy, loop, initialDelay,
                                                timing);
                                        } else {
                                            drawable.setScale(framesCopy[0].scale);
                                            scaleWithKeyFrames(drawable, framesCopy[0], framesCopy, loop, initialDelay,
                                                timing);
                                        }

                                    };
                                    var duration = (timing - frame.time) * 2 - 2;
                                    if (duration < 1) {
                                        restart();
                                    } else {
                                        self.timer.in(duration, restart);
                                    }
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
                                if (callback) {
                                    callback();
                                }
                            }
                        }
                    }
                }

                function moveWithKeyFrames(drawable, currentFrame, frames, loop, initialDelay, timing, customXFn,
                    customYFn, callback) {
                    if (loop) {
                        var framesCopy = frames.slice();
                    }

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
                                self.timer.in(duration, continueMove);
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
                            if (itIsOver) {
                                return;
                            }

                            if (frames.length > 0) {
                                move(frames.shift(), frame);
                            } else if (loop) {

                                if (timing) {
                                    var restart = function () {

                                        if (itIsOver) {
                                            return;
                                        }
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
                                    };
                                    var duration = (timing - frame.time) * 2 - 2;
                                    if (duration < 1) {
                                        restart();
                                    } else {
                                        self.timer.in(duration, restart);
                                    }
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
                                if (callback) {
                                    callback();
                                }
                            }
                        }
                    }
                }

            }, this);
        }, this);

        var itIsOver = false;

        function endScene() {
            if (itIsOver) {
                return false;
            }
            itIsOver = true;

            if (self.viewModel.preDestroy) {
                self.viewModel.preDestroy();
            }

            drawables.forEach(function (drawable) {
                drawable.remove();
            });
            self.events.unsubscribe(tapListenerId);
            //self.events.unsubscribe(frameListenerId);

            return true;
        }

        /**
         * @class ViewModel
         * @property nextScene
         * @property restartScene
         * @property stopScene
         * @property pauseScene
         * @property resumeScene
         */

        function nextScene(key, customParam) {
            if (!endScene()) {
                return;
            }

            if (next) {
                next(key, customParam);
            }
        }

        function restartScene() {
            if (!endScene()) {
                return;
            }

            self.show(next, customParam);
        }

        function stopScene() {
            if (!endScene()) {
                return;
            }

            // resume callback
            return self.show.bind(self, next, customParam);
        }

        function pauseScene() {
            paused = true;
            if (self.viewModel.prePause) {
                self.viewModel.prePause();
            }
        }

        function resumeScene() {
            paused = false;
            if (self.viewModel.postResume) {
                self.viewModel.postResume();
            }
        }

        // dependency injection for globals inside your view model
        this.viewModel.nextScene = nextScene;
        this.viewModel.restartScene = restartScene;
        this.viewModel.stopScene = stopScene;
        this.viewModel.pauseScene = pauseScene;
        this.viewModel.resumeScene = resumeScene;
        this.viewModel.drawables = drawables;
        //this.viewModel.sceneRect = sceneRect;

        this.events.subscribe(Event.PAUSE, function () {
            paused = true;
        });

        this.events.subscribe(Event.RESUME, function () {
            paused = false;
        });

        if (this.viewModel.postConstruct) {
            this.viewModel.postConstruct(customParam);
        }
    };

    return MVVMScene;
})(H5.iterateEntries, H5.Width, H5.Height, H5.Event, Math, H5.calcScreenConst, H5.add, H5.multiply, H5.subtract,
    H5.CallbackCounter);
H5.SceneList = (function () {
    'use strict';

    function SceneList() {
        this.scenes = [];
        this.temp = [];
    }

    SceneList.prototype.add = function (sceneFn, oneTime) {
        this.scenes.push({
            sceneFn: sceneFn,
            oneTime: oneTime == null ? false : oneTime
        });
    };

    SceneList.prototype.next = function (customParam) {
        if (this.scenes.length === 0 && this.temp.length > 0) {
            this.rewind();
        }

        var scene = this.scenes.shift();

        if (!scene) {
            throw 'No scenes configured';
        }

        if (!scene.oneTime) {
            this.temp.push(scene);
        }

        scene.sceneFn(this.next.bind(this), customParam);
    };

    SceneList.prototype.rewind = function () {
        this.scenes = this.temp;
        this.temp = [];
    };

    return SceneList;
})();
H5.SceneMap = (function (Object) {
    'use strict';

    function SceneMap() {
        this.scenes = {};
    }

    SceneMap.prototype.put = function (name, callback, self) {
        this.scenes[name] = self ? callback.bind(self) : callback;
    };

    SceneMap.prototype.next = function (name, customParam) {

        var sceneFn = this.scenes[name];

        if (!sceneFn) {
            if (Object.keys(this.scenes).length < 1) {
                throw 'No scenes configured';
            }
            throw 'scene "' + name + '" not configured';
        }

        sceneFn(this.next.bind(this), customParam);
    };

    return SceneMap;
})(Object);
H5.HolmesConnector = (function (Persistence, JSON, XMLHttpRequest, localStorage) {
    'use strict';

    function HolmesConnector(url, tenantCode, appKeyCode) {
        this.url = url;
        this.tenantCode = tenantCode;
        this.appKeyCode = appKeyCode;
    }

    var Method = {
        REGISTER: '/register',
        EVENT: '/event'
    };
    var CLIENT_ID = '-client_id';

    HolmesConnector.prototype.register = function () {
        var clientId = Persistence.loadString(this.appKeyCode + CLIENT_ID);
        if (clientId) {
            this.clientId = clientId;
            return;
        }

        var self = this;
        this.__request(Method.REGISTER, {tenant: this.tenantCode}, function () {
            clientId = this.responseText;
            if (clientId) {
                localStorage.setItem(self.appKeyCode + CLIENT_ID, clientId);
                self.clientId = clientId;
            }
        });
    };

    HolmesConnector.prototype.send = function (data) {
        if (!this.clientId) {
            return;
        }

        var payload = {
            id: this.clientId,
            tenant: this.tenantCode
        };
        for (var key in data) {
            //noinspection JSUnfilteredForInLoop
            payload[key] = data[key];
        }

        this.__request(Method.EVENT, payload);
    };

    HolmesConnector.prototype.__request = function (method, payload, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', this.url + method);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = callback;
        xhr.send(JSON.stringify(payload));
    };

    return HolmesConnector;
})(H5.Persistence, JSON, XMLHttpRequest, H5.lclStorage);
H5.installHolmes = (function (Event, HolmesConnector, window) {
    'use strict';

    function installHolmes(url, tenantCode, appKey, events) {
        var gOldOnError = window.onerror;
        window.onerror = function myErrorHandler(errorMsg, url, lineNumber, columnNumber, error) {
            var payload = {
                type: 'error',
                msg: errorMsg,
                url: url,
                line: lineNumber,
                column: columnNumber
            };

            if (error) {
                payload.error = {
                    message: error.message,
                    stack: error.stack
                };
            }

            events.fire(Event.ANALYTICS, payload);

            if (gOldOnError) {
                // Call previous handler.
                return gOldOnError.call(this, errorMsg, url, lineNumber, columnNumber, error);
            }

            // Just let default handler run.
            return false;
        };

        var connector = new HolmesConnector(url, tenantCode, appKey);
        connector.register();

        events.subscribe(Event.ANALYTICS, connector.send.bind(connector));
    }

    return installHolmes;
})(H5.Event, H5.HolmesConnector, window);
H5.sendSystemEvent = (function (Event, location, navigator, Promise, getGamepads, Date, languageCode) {
    'use strict';

    function collectPositionInfo() {
        return new Promise(function (resolve) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var info = {
                    accuracy: position.coords.accuracy,
                    altitude: position.coords.altitude,
                    altitudeAccuracy: position.coords.altitudeAccuracy,
                    heading: position.coords.heading,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    speed: position.coords.speed,
                    timestamp: position.timestamp
                };
                resolve(info);
            }, function (error) {
                resolve(error);
            }, {enableHighAccuracy: false});
        });
    }

    function collectGamePadInfo() {
        var gamePads = getGamepads();
        var padsInfo = [];
        var connectedGamePads = 0;
        for (var i = 0; i < gamePads.length; i++) {
            var currentPad = gamePads[i];
            if (currentPad) {
                connectedGamePads++;

                padsInfo.push({
                    id: gamePads[i].id,
                    index: gamePads[i].index,
                    mapping: gamePads[i].mapping,
                    profile: gamePads[i].profile
                });
            }
        }

        return {
            connectedGamePads: connectedGamePads,
            gamePadInfo: padsInfo
        };
    }

    function getPayload(device, appName, appVersion, appPlatform) {
        return {
            type: 'system',
            width: device.width,
            height: device.height,
            cssWidth: device.cssWidth,
            cssHeight: device.cssHeight,
            screenWidth: device.screenWidth,
            screenHeight: device.screenHeight,
            devicePixelRatio: device.devicePixelRatio,
            mobile: device.isMobile,
            userAgent: device.userAgent,
            language: languageCode,
            userTime: Date.now(),
            userTimeString: Date(),
            location: location.href,
            gamePadInfo: collectGamePadInfo(),
            app: appName,
            version: appVersion,
            platform: appPlatform
        };
    }

    function sendSystemEvent(info, device, events, usePosition) {

        if (usePosition) {
            collectPositionInfo().then(function (positionInfo) {

                var payload = getPayload(device, info.name, info.version, info.platform);
                payload.positionInfo = positionInfo;

                events.fire(Event.ANALYTICS, payload);
            });
        } else {
            events.fire(Event.ANALYTICS, getPayload(device, info.name, info.version, info.platform));
        }
    }

    return sendSystemEvent;
})(H5.Event, window.location, window.navigator, H5.Promise, H5.getGamepads, Date,
    window.navigator.language || window.navigator.userLanguage);
H5.Grid = (function () {
    'use strict';

    function Grid(level) {
        this.__init(level);
    }

    Grid.prototype.__init = function (level) {
        this.map = [];

        var foreground = level.front ? level.front : level;
        for (var y = 0; y < foreground.length; y++) {
            var levelRow = foreground[y];
            var row = [];
            for (var x = 0; x < levelRow.length; x++) {
                row.push(levelRow[x]);
            }
            this.map.push(row);
        }

        this.xTiles = foreground[0].length;
        this.yTiles = foreground.length;
        this.__yTiles = foreground.length;

        if (level.back) {
            this.backgroundMap = [];
            var background = level.back;
            for (y = 0; y < background.length; y++) {
                levelRow = background[y];
                row = [];
                for (x = 0; x < levelRow.length; x++) {
                    row.push(levelRow[x]);
                }
                this.backgroundMap.push(row);
            }

            this.getBackground = function (u, v) {
                if (u < 0 || u >= this.xTiles || v < 0 || v >= this.__yTiles) {
                    return;
                }
                return this.backgroundMap[v][u];
            };

            this.setBackground = function (u, v, load) {
                this.backgroundMap[v][u] = load;
            };
        }

        if (level.events) {
            this.eventsMap = [];
            var events = level.events;
            for (y = 0; y < events.length; y++) {
                levelRow = events[y];
                row = [];
                for (x = 0; x < levelRow.length; x++) {
                    row.push(levelRow[x]);
                }
                this.eventsMap.push(row);
            }

            this.getEvent = function (u, v) {
                if (u < 0 || u >= this.xTiles || v < 0 || v >= this.__yTiles) {
                    return;
                }
                return this.eventsMap[v][u];
            };
        }
    };

    Grid.prototype.reload = function (level) {
        this.__init(level);
    };

    Grid.prototype.get = function (u, v) {
        if (u < 0 || u >= this.xTiles || v < 0 || v >= this.__yTiles) {
            return;
        }
        return this.map[v][u];
    };

    Grid.prototype.set = function (u, v, load) {
        this.map[v][u] = load;
    };

    return Grid;
})();
H5.GridHelper = (function (Math, calcCantorPairing, Strings, isNaN) {
    'use strict';

    function GridHelper(grid) {
        this.grid = grid;
    }

    GridHelper.prototype.getNeighbors = function (u, v) {
        var neighbors = [];
        var bottom = this.getBottomNeighbor(u, v);
        if (bottom) {
            neighbors.push(bottom);
        }
        var right = this.getRightNeighbor(u, v);
        if (right) {
            neighbors.push(right);
        }
        var top = this.getTopNeighbor(u, v);
        if (top) {
            neighbors.push(top);
        }
        var left = this.getLeftNeighbor(u, v);
        if (left) {
            neighbors.push(left);
        }

        return neighbors;
    };

    GridHelper.prototype.getBottomNeighbor = function (u, v) {
        return this.__getTile(u, v + 1);
    };

    GridHelper.prototype.getTopNeighbor = function (u, v) {
        return this.__getTile(u, v - 1);
    };

    GridHelper.prototype.getLeftNeighbor = function (u, v) {
        return this.__getTile(u - 1, v);
    };

    GridHelper.prototype.getRightNeighbor = function (u, v) {
        return this.__getTile(u + 1, v);
    };

    GridHelper.prototype.getBackgroundBottomNeighbor = function (u, v) {
        return this.__getTile(u, v + 1, true);
    };

    GridHelper.prototype.getBackgroundTopNeighbor = function (u, v) {
        return this.__getTile(u, v - 1, true);
    };

    GridHelper.prototype.getBackgroundLeftNeighbor = function (u, v) {
        return this.__getTile(u - 1, v, true);
    };

    GridHelper.prototype.getBackgroundRightNeighbor = function (u, v) {
        return this.__getTile(u + 1, v, true);
    };

    GridHelper.prototype.__getTile = function (u, v, isBackground) {
        var type = !isBackground ? this.grid.get(u, v) : this.grid.getBackground(u, v);
        if (type !== undefined) {
            return {
                u: u,
                v: v,
                type: type
            };
        }
    };

    GridHelper.prototype.getTopNeighbors = function (tiles) {
        return getNeighbors(tiles, [this.getTopNeighbor.bind(this)]);
    };

    GridHelper.prototype.getLeftNeighbors = function (tiles) {
        return getNeighbors(tiles, [this.getLeftNeighbor.bind(this)]);
    };

    GridHelper.prototype.getRightNeighbors = function (tiles) {
        return getNeighbors(tiles, [this.getRightNeighbor.bind(this)]);
    };

    GridHelper.prototype.getBottomNeighbors = function (tiles) {
        return getNeighbors(tiles, [this.getBottomNeighbor.bind(this)]);
    };

    GridHelper.prototype.getTopNeighborsComplement = function (tiles) {
        return complement(getNeighbors(tiles, [this.getTopNeighbor.bind(this)]), tiles);
    };

    GridHelper.prototype.getLeftNeighborsComplement = function (tiles) {
        return complement(getNeighbors(tiles, [this.getLeftNeighbor.bind(this)]), tiles);
    };

    GridHelper.prototype.getRightNeighborsComplement = function (tiles) {
        return complement(getNeighbors(tiles, [this.getRightNeighbor.bind(this)]), tiles);
    };

    GridHelper.prototype.getBottomNeighborsComplement = function (tiles) {
        return complement(getNeighbors(tiles, [this.getBottomNeighbor.bind(this)]), tiles);
    };

    function getNeighbors(tiles, neighborFnList) {
        var neighbors = [];
        var visited = {};
        neighborFnList.forEach(function (neighborFn) {
            tiles.forEach(function (tile) {
                var neighbor = neighborFn(tile.u, tile.v);
                if (neighbor) {
                    var hash = calcCantorPairing(neighbor.u, neighbor.v);
                    var isVisited = visited[hash];
                    if (!isVisited) {
                        visited[hash] = true;
                        neighbors.push(neighbor);
                    }
                }
            });
        });
        return neighbors;
    }

    function complement(setB, setA) {
        return setB.filter(function (b) {
            return setA.every(function (a) {
                return b.type !== a.type;
            });
        });
    }

    GridHelper.prototype.complement = complement;

    function getSetFromAllSetsByTile(allSets, tile) {
        for (var i = 0; i < allSets.length; i++) {
            var mySet = allSets[i];
            for (var j = 0; j < mySet.length; j++) {
                var body = mySet[j];
                if (body.type == tile.type) {
                    return mySet;
                }
            }
        }
    }

    GridHelper.prototype.getSetFromAllSetsByTile = getSetFromAllSetsByTile;

    function getSetFromAllSetsByType(allSets, type) {
        return getSetFromAllSetsByTile(allSets, {type: type});
    }

    GridHelper.prototype.getSetFromAllSetsByType = getSetFromAllSetsByType;

    function getTileFromSetByType(mySet, type) {
        for (var i = 0; i < mySet.length; i++) {
            var tile = mySet[i];
            if (tile.type == type) {
                return tile;
            }
        }
    }

    GridHelper.prototype.getTileFromSetByType = getTileFromSetByType;

    GridHelper.prototype.isNeighbor = function (a_u, a_v, b_u, b_v) {
        var deltaX = Math.abs(a_u - b_u);
        if (deltaX > 1 || (a_u === b_u && a_v === b_v)) {
            return false;
        }
        var deltaY = Math.abs(a_v - b_v);
        if (deltaY > 1 || deltaX + deltaY > 1) {
            return false;
        }
        var neighbor = this.grid.get(b_u, b_v);
        return neighbor !== undefined;
    };

    GridHelper.prototype.isOnSameAxis = function (a_u, a_v, b_u, b_v) {
        return a_u == b_u || a_v == b_v;
    };

    GridHelper.prototype.equals = function (objectA, objectB) {
        return objectA.u === objectB.u && objectA.v === objectB.v && objectA.type === objectB.type;
    };

    GridHelper.prototype.getTiles = function (tileName, isBackground) {
        var tiles = [];

        for (var y = 0; y < this.grid.yTiles; y++) {
            for (var x = 0; x < this.grid.xTiles; x++) {
                var tile = !isBackground ? this.grid.get(x, y) : this.grid.getBackground(x, y);
                if (tile !== undefined) {
                    if (isNaN(tile)) {
                        if (Strings.startsWidth(tile, tileName)) {
                            tiles.push({
                                u: x,
                                v: y,
                                type: tile
                            });
                        }
                    } else {
                        if (tile === tileName) {
                            tiles.push({
                                u: x,
                                v: y,
                                type: tile
                            });
                        }
                    }
                }
            }
        }

        return tiles;
    };

    GridHelper.prototype.getTile = function (tileName, isBackground) {
        for (var y = 0; y < this.grid.yTiles; y++) {
            for (var x = 0; x < this.grid.xTiles; x++) {
                var tile = !isBackground ? this.grid.get(x, y) : this.grid.getBackground(x, y);
                if (tile && Strings.startsWidth(tile, tileName)) {
                    return {
                        u: x,
                        v: y,
                        type: tile
                    };
                }
            }
        }
    };

    return GridHelper;
})(Math, H5.calcCantorPairing, H5.Strings, isNaN);
H5.GridViewHelper = (function (Height, Math, add) {
    'use strict';

    function GridViewHelper(stage, device, xTilesCount, yTilesCount, topOffset, bottomOffset) {
        this.stage = stage;
        this.device = device;
        this.xTiles = xTilesCount;
        this.yTiles = yTilesCount;
        this.topOffset = topOffset;
        this.bottomOffset = bottomOffset;

        this.baseScale = 1;
    }

    GridViewHelper.prototype.getEdgeLengthFn = function () {
        return (function (self) {
            return function (width, height) {
                return self.__edgeLength(height);
            };
        })(this);
    };

    GridViewHelper.prototype.getCoordinates = function (x, y) {

        var length = this.__edgeLength(this.device.height);
        return {
            u: Math.floor((x - this.__xOffset(this.device.width, length) + length / 2) / length),
            v: Math.floor((y - this.__getTopOffset(this.device.height)) / length)
        };
    };

    GridViewHelper.prototype.getCoordinatesWithScale = function (x, y, scale) {

        var length = this.__edgeLength(this.device.height);
        var u = Math.floor((x - this.__xOffset(this.device.width, length) + length / 2) / length);
        var v = Math.floor((y - this.__getTopOffset(this.device.height)) / length);

        function isHit(x, y, cornerX, endX, cornerY, endY) {
            return x > cornerX && x < endX && y > cornerY && y < endY;
        }

        var position = this.getPosition(u, v);
        var lengthHalfScaled = Math.floor(length / 2 * scale);

        if (isHit(x, y, position.x - lengthHalfScaled, position.x + lengthHalfScaled, position.y - lengthHalfScaled,
                position.y + lengthHalfScaled)) {

            return {
                u: u,
                v: v
            };
        }

        return false;
    };

    GridViewHelper.prototype.getPosition = function (u, v) {
        return {
            x: this.__getX(u)(this.device.width, this.device.height),
            y: this.__getY(v)(this.device.height)
        };
    };

    GridViewHelper.prototype.create = function (u, v, name, defaultTileHeight, xOffset, yOffset, dependencies) {
        return this.createBackground(u, v, name, 5, defaultTileHeight, xOffset, yOffset, dependencies);
    };

    GridViewHelper.prototype.createBackground = function (u, v, name, zIndex, defaultTileHeight, xOffset, yOffset,
        dependencies) {
        var drawable = this.stage.createImage(name);
        if (xOffset && yOffset) {
            drawable.setPosition(add(this.__getX(u), xOffset), add(this.__getY(v), yOffset), dependencies);
        } else if (xOffset) {
            drawable.setPosition(add(this.__getX(u), xOffset), this.__getY(v), dependencies);
        } else if (yOffset) {
            drawable.setPosition(this.__getX(u), add(this.__getY(v), yOffset), dependencies);
        } else {
            drawable.setPosition(this.__getX(u), this.__getY(v), dependencies);
        }
        if (zIndex !== 3) {
            drawable.setZIndex(zIndex);
        }
        if (defaultTileHeight) {
            var scaleFactor = drawable.data.height / defaultTileHeight;
            drawable.scale = this.__calcBaseScale(drawable.getHeight()) * scaleFactor;
        } else {
            drawable.scale = this.__calcBaseScale(drawable.getHeight());
        }

        return drawable;
    };

    GridViewHelper.prototype.__calcBaseScale = function (drawableHeight) {
        var length = this.__edgeLength(this.device.height);
        return length / drawableHeight;
    };

    GridViewHelper.prototype.createRect = function (u, v, color) {
        var self = this;

        //noinspection JSUnusedLocalSymbols
        function getWidth(width, height) {
            return self.__edgeLength(height) - 1;
        }

        function getHeight(height) {
            return self.__edgeLength(height) - 1;
        }

        return this.stage.createRectangle(true).setPosition(this.__getX(u), this.__getY(v)).setWidth(getWidth)
            .setHeight(getHeight).setColor(color);
    };

    GridViewHelper.prototype.createRectBackground = function (u, v, color, zIndex) {
        return this.createRect(u, v, color).setZIndex(zIndex);
    };

    GridViewHelper.prototype.move = function (drawable, u, v, speed, callback, xOffset, yOffset, dependencies) {
        if (xOffset && yOffset) {
            return drawable.moveTo(add(this.__getX(u), xOffset), add(this.__getY(v), yOffset), dependencies)
                .setDuration(speed).setCallback(callback);
        }
        if (xOffset) {
            return drawable.moveTo(add(this.__getX(u), xOffset), this.__getY(v), dependencies).setDuration(speed)
                .setCallback(callback);
        }
        if (yOffset) {
            return drawable.moveTo(this.__getX(u), add(this.__getY(v), yOffset), dependencies).setDuration(speed)
                .setCallback(callback);
        }
        return drawable.moveTo(this.__getX(u), this.__getY(v), dependencies).setDuration(speed).setCallback(callback);
    };

    GridViewHelper.prototype.setPosition = function (drawable, u, v, dependencies) {
        return drawable.setPosition(this.__getX(u), this.__getY(v), dependencies);
    };

    GridViewHelper.prototype.__edgeLength = function (height) {
        if (this.bottomOffset) {
            return Height.get(this.yTiles)(height - (this.__getTopOffset(height) + this.bottomOffset(height)));
        } else {
            return Height.get(this.yTiles)(height - this.__getTopOffset(height));
        }
    };

    GridViewHelper.prototype.__xOffset = function (width, length) {
        return Math.floor(width / 2 - length * this.xTiles / 2 + length / 2);
    };

    GridViewHelper.prototype.__getX = function (u) {
        var self = this;
        return function (width, height) {
            var length = self.__edgeLength(height);
            var start = self.__xOffset(width, length);
            return start + u * length;
        };
    };

    GridViewHelper.prototype.__getY = function (v) {
        var self = this;
        return function (height) {
            var length = self.__edgeLength(height);
            return v * length + Math.floor(length / 2) + self.__getTopOffset(height);
        };
    };

    GridViewHelper.prototype.__getTopOffset = function (height) {
        if (this.topOffset) {
            return this.topOffset(height);
        }
        return 0;
    };

    GridViewHelper.prototype.getBaseScale = function () {
        return this.baseScale;
    };

    return GridViewHelper;
})(H5.Height, Math, H5.add);
H5.FixRezGridViewHelper = (function (Math, wrap) {
    'use strict';

    function FixRezGridViewHelper(stage, width, height, edgeLength, topOffset) {
        this.stage = stage;
        this.width = width;
        this.height = height;
        this.xTiles = width / edgeLength;
        this.yTiles = height / edgeLength;
        this.edgeLength = edgeLength;
        this.topOffset = topOffset || 0;
    }

    FixRezGridViewHelper.prototype.getCoordinates = function (x, y) {
        return {
            u: Math.floor((x - this.__xOffset() + this.edgeLength / 2) / this.edgeLength),
            v: Math.floor((y - this.topOffset) / this.edgeLength)
        };
    };

    FixRezGridViewHelper.prototype.getPosition = function (u, v) {
        return {
            x: this.getX(u),
            y: this.getY(v)
        };
    };

    FixRezGridViewHelper.prototype.create = function (u, v, name, xOffset, yOffset) {
        return this.createBackground(u, v, name, 5, xOffset, yOffset);
    };

    FixRezGridViewHelper.prototype.createBackground = function (u, v, name, zIndex, xOffset, yOffset) {
        var drawable = this.stage.createImage(name);
        if (xOffset && yOffset) {
            drawable.setPosition(wrap(this.getX(u) + xOffset), wrap(this.getY(v) + yOffset));
        } else if (xOffset) {
            drawable.setPosition(wrap(this.getX(u) + xOffset), wrap(this.getY(v)));
        } else if (yOffset) {
            drawable.setPosition(wrap(this.getX(u)), wrap(this.getY(v) + yOffset));
        } else {
            drawable.setPosition(wrap(this.getX(u)), wrap(this.getY(v)));
        }
        if (zIndex !== 3) {
            drawable.setZIndex(zIndex);
        }

        return drawable;
    };

    FixRezGridViewHelper.prototype.createRect = function (u, v, color) {
        return this.stage.createRectangle(true)
            .setPosition(wrap(this.getX(u)), wrap(this.getY(v)))
            .setWidth(wrap(this.edgeLength - 1))
            .setHeight(wrap(this.edgeLength - 1))
            .setColor(color);
    };

    FixRezGridViewHelper.prototype.createRectBackground = function (u, v, color, zIndex) {
        return this.createRect(u, v, color).setZIndex(zIndex);
    };

    FixRezGridViewHelper.prototype.move = function (drawable, u, v, speed, callback, xOffset, yOffset) {
        if (xOffset && yOffset) {
            return drawable.moveTo(wrap(this.getX(u) + xOffset), wrap(this.getY(v) + yOffset))
                .setDuration(speed).setCallback(callback);
        }
        if (xOffset) {
            return drawable.moveTo(wrap(this.getX(u) + xOffset), wrap(this.getY(v))).setDuration(speed)
                .setCallback(callback);
        }
        if (yOffset) {
            return drawable.moveTo(wrap(this.getX(u)), wrap(this.getY(v) + yOffset)).setDuration(speed)
                .setCallback(callback);
        }
        return drawable.moveTo(wrap(this.getX(u)), wrap(this.getY(v))).setDuration(speed).setCallback(callback);
    };

    FixRezGridViewHelper.prototype.setPosition = function (drawable, u, v) {
        return drawable.setPosition(wrap(this.getX(u)), wrap(this.getY(v)));
    };

    FixRezGridViewHelper.prototype.__xOffset = function () {
        return Math.floor((this.width - this.edgeLength * this.xTiles + this.edgeLength) * 0.95);
    };

    FixRezGridViewHelper.prototype.getX = function (u) {
        return this.__xOffset() + u * this.edgeLength;
    };

    FixRezGridViewHelper.prototype.getY = function (v) {
        return v * this.edgeLength + Math.floor(this.edgeLength / 2) + this.topOffset;
    };

    return FixRezGridViewHelper;
})(Math, H5.wrap);
H5.EqTriangleGrid = (function (Math) {
    'use strict';

    function EqTriangleGrid(xTiles, yTiles) {
        this.xTiles = xTiles;
        this.yTiles = yTiles;
        this.map = [];
        for (var y = 0; y < yTiles; y++) {
            var row = [];
            for (var x = 0; x < xTiles * 2 - 1; x++) {
                row.push(true);
            }
            this.map.push(row);
        }
    }

    EqTriangleGrid.prototype.getLeft = function (u, v) {
        if (v % 2 == 0) {
            return this.map[v][(u + Math.floor(v / 2)) * 2];
        } else {
            return this.map[v][(u + Math.floor(v / 2)) * 2 + 1];
        }
    };

    EqTriangleGrid.prototype.setLeft = function (u, v) {
        if (v % 2 == 0) {
            this.map[v][(u + Math.floor(v / 2)) * 2] = false;
        } else {
            this.map[v][(u + Math.floor(v / 2)) * 2 + 1] = false;
        }
    };

    EqTriangleGrid.prototype.getRight = function (u, v) {
        if (v % 2 == 0) {
            return this.map[v][(u + Math.floor(v / 2)) * 2 + 1];
        } else {
            return this.map[v][(u + Math.floor(v / 2)) * 2 + 2];
        }
    };

    EqTriangleGrid.prototype.setRight = function (u, v) {
        if (v % 2 == 0) {
            this.map[v][(u + Math.floor(v / 2)) * 2 + 1] = false;
        } else {
            this.map[v][(u + Math.floor(v / 2)) * 2 + 2] = false;
        }
    };

    EqTriangleGrid.prototype.set = function (u, v, side) {
        if (side == 'left') {
            this.setLeft(u, v);
        } else if (side == 'right') {
            this.setRight(u, v);
        }
    };

    EqTriangleGrid.prototype.get = function (u, v, side) {
        if (v < 0 || v >= this.yTiles) {
            return false;
        }
        if (v % 2 == 0 && u < -Math.floor(v / 2)) {
            return false;
        } else if (v % 2 == 1 && side == 'right' && u < -(Math.floor(v / 2) + 1)) {
            return false;
        } else if (v % 2 == 1 && side == 'left' && u < -Math.floor(v / 2)) {
            return false;
        } else if (v % 2 == 0 && side == 'left' && u > this.xTiles - 1 - Math.floor(v / 2)) {
            return false;
        } else if (v % 2 == 0 && side == 'right' && u > this.xTiles - 1 - (Math.floor(v / 2) + 1)) {
            return false;
        } else if (v % 2 == 1 && u > this.xTiles - 1 - (Math.floor(v / 2) + 1)) {
            return false;
        }

        if (side == 'left') {
            return this.getLeft(u, v);
        } else if (side == 'right') {
            return this.getRight(u, v);
        }
    };

    return EqTriangleGrid;
})(Math);
H5.EqTriangleGridHelper = (function (Math) {
    'use strict';

    function EqTriangleGridHelper(grid, xTiles, yTiles) {
        this.grid = grid;
        this.xTiles = xTiles;
        this.yTiles = yTiles;
    }

    EqTriangleGridHelper.prototype.getTopLeft = function () {
        return {
            x: 0,
            y: 0,
            side: 'left'
        };
    };

    EqTriangleGridHelper.prototype.getTopRight = function () {
        return {
            x: this.xTiles - 1,
            y: 0,
            side: 'left'
        };
    };

    EqTriangleGridHelper.prototype.getBottomLeft = function () {
        var lastY = this.yTiles - 1;
        if (lastY % 2 == 0) {
            return {
                x: -Math.floor(lastY / 2),
                y: lastY,
                side: 'left'
            };
        } else {
            return {
                x: -(Math.floor(lastY / 2) + 1),
                y: lastY,
                side: 'right'
            };
        }
    };

    EqTriangleGridHelper.prototype.getBottomRight = function () {
        var lastY = this.yTiles - 1;
        var lastX = this.xTiles - 1;
        if (lastY % 2 == 0) {
            return {
                x: lastX - Math.floor(lastY / 2),
                y: lastY,
                side: 'left'
            };
        } else {
            return {
                x: lastX - (Math.floor(lastY / 2) + 1),
                y: lastY,
                side: 'right'
            };
        }
    };

    EqTriangleGridHelper.prototype.getEmptyNeighbors = function (u, v, side) {
        var neighbors = [];
        if (side == 'left') {
            if (this.grid.get(u, v, 'right')) {
                neighbors.push({
                    x: u,
                    y: v,
                    side: 'right'
                });
            }
            if (this.grid.get(u - 1, v, 'right')) {
                neighbors.push({
                    x: u - 1,
                    y: v,
                    side: 'right'
                });
            }
            if (this.grid.get(u, v - 1, 'right')) {
                neighbors.push({
                    x: u,
                    y: v - 1,
                    side: 'right'
                });
            }
        } else if (side == 'right') {
            if (this.grid.get(u, v, 'left')) {
                neighbors.push({
                    x: u,
                    y: v,
                    side: 'left'
                });
            }
            if (this.grid.get(u + 1, v, 'left')) {
                neighbors.push({
                    x: u + 1,
                    y: v,
                    side: 'left'
                });
            }
            if (this.grid.get(u, v + 1, 'left')) {
                neighbors.push({
                    x: u,
                    y: v + 1,
                    side: 'left'
                });
            }
        }
        return neighbors;
    };

    EqTriangleGridHelper.prototype.getNextEmptyTriangleFromBottom = function () {
        for (var v = this.grid.map.length - 1; v >= 0; v--) {
            var row = this.grid.map[v];
            for (var u = row.length - 1; u >= 0; u--) {
                var triangle = row[u];
                if (triangle) {
                    return transform(u, v);
                }
            }
        }
    };

    EqTriangleGridHelper.prototype.getNextEmptyTriangleFromTop = function () {
        for (var v = 0; v < this.grid.map.length; v++) {
            var row = this.grid.map[v];
            for (var u = 0; u < row.length; u++) {
                var triangle = row[u];
                if (triangle) {
                    return transform(u, v);
                }
            }
        }
    };

    function transform(u, v) {
        var x;
        var side;
        if (v % 2 == 0) {
            if (u % 2 == 0) {
                side = 'left';
                x = (u + Math.floor(v / 2)) * 2;
            } else {
                side = 'right';
                x = (u + Math.floor(v / 2)) * 2 + 1;
            }
        } else {
            if (u % 2 == 0) {
                side = 'right';
                x = Math.floor(u / 2) - (Math.floor(v / 2) + 1);
            } else {
                side = 'left';
                x = Math.floor(u / 2) - (Math.floor(v / 2) + 1);
            }
        }
        return {
            x: x,
            y: v,
            side: side
        };
    }

    return EqTriangleGridHelper;
})(Math);
H5.EqTriangleViewHelper = (function (Math, Transition, Width, EqTriangles) {
    'use strict';

    function EqTriangleViewHelper(stage, timer, xTilesCount) {
        this.stage = stage;
        this.timer = timer;
        this.count = xTilesCount;
    }

    var L_SIDE = 'left';
    var R_SIDE = 'right';
    var L_SIDE_START_ANGLE = Math.PI / 2;
    var R_SIDE_START_ANGLE = -Math.PI / 2;
    var WHITE = 'white';

    EqTriangleViewHelper.prototype.create = function (u, v, side) {
        return this.__createTriangle(u, v, side);
    };

    EqTriangleViewHelper.prototype.createLeft = function (u, v) {
        return this.__createTriangle(u, v, L_SIDE);
    };

    EqTriangleViewHelper.prototype.createRight = function (u, v) {
        return this.__createTriangle(u, v, R_SIDE);
    };

    EqTriangleViewHelper.prototype.__createTriangle = function (u, v, side) {
        var triangle;

        if (side == L_SIDE) {
            triangle = this.stage.drawEqTriangle(this.__leftX(u, v), this.__leftY(u, v), L_SIDE_START_ANGLE,
                this.__getRadius.bind(this), WHITE, true);
        } else if (side == R_SIDE) {
            triangle = this.stage.drawEqTriangle(this.__rightX(u, v), this.__rightY(u, v), R_SIDE_START_ANGLE,
                this.__getRadius.bind(this), WHITE, true);
        }

        return triangle;
    };

    EqTriangleViewHelper.prototype.__edgeLength = function (width) {
        return Width.get(this.count)(width);
    };

    EqTriangleViewHelper.prototype.__getRadius = function (width) {
        return EqTriangles.radius(this.__edgeLength(width));
    };

    EqTriangleViewHelper.prototype.__leftX = function (u, v) {
        var self = this;
        return function (width) {
            return EqTriangles.leftX(u, v, self.__edgeLength(width));
        };
    };

    EqTriangleViewHelper.prototype.__leftY = function (u, v) {
        var self = this;
        return function (height, width) {
            return EqTriangles.leftY(u, v, self.__edgeLength(width));
        };
    };

    EqTriangleViewHelper.prototype.__rightX = function (u, v) {
        var self = this;
        return function (width) {
            return EqTriangles.rightX(u, v, self.__edgeLength(width));
        };
    };

    EqTriangleViewHelper.prototype.__rightY = function (u, v) {
        var self = this;
        return function (height, width) {
            return EqTriangles.rightY(u, v, self.__edgeLength(width));
        };
    };

    return EqTriangleViewHelper;
})(Math, H5.Transition, H5.Width, H5.EqTriangles);
H5.HexViewHelper = (function (Width, Math) {
    'use strict';

    function HexViewHelper(stage, xTilesCount, yTilesCount, topOffset, bottomOffset, adjustCenter) {
        this.stage = stage;
        this.xTiles = xTilesCount;
        this.yTiles = yTilesCount;
        this.topOffset = topOffset;
        this.bottomOffset = bottomOffset;
        this.adjustCenter = adjustCenter;
    }

    var POINTY_TOPPED_ANGLE = Math.PI / 6;

    /**
     * get side length t - also known as size
     * @param width
     * @param height
     * @returns {number}
     */
    HexViewHelper.prototype.getSize = function (width, height) {
        return this.getWidth(width, height) / Math.sqrt(3);
    };

    HexViewHelper.prototype.getWidth = function (width, height) {
        var calcWidth = Width.get(this.xTiles + 0.5)(width);

        var sqrt3 = Math.sqrt(3);
        var tCount = this.yTiles * 2;
        var totalHeight = calcWidth / sqrt3 * tCount;
        if (totalHeight * 0.9 > height) {
            return Math.floor(height / tCount * sqrt3);
        }
        return calcWidth;
    };

    HexViewHelper.prototype.getXFn = function (u, v) {
        return (function (self) {
            return function (width, height) {
                var calcWidth = self.getWidth(width, height);
                var xOffset = 0;
                var totalWidth = calcWidth * self.xTiles;
                if (totalWidth < width) {
                    xOffset = (width - totalWidth) / 2;
                }
                if (self.adjustCenter) {
                    return Math.floor(self.getSize(width, height) * Math.sqrt(3) * (u + 0.5 * (v & 1)) + xOffset);
                }
                return Math.floor(
                    self.getSize(width, height) * Math.sqrt(3) * (u + 0.5 * (v & 1)) + xOffset + calcWidth / 2);
            };
        })(this);
    };

    HexViewHelper.prototype.getYFn = function (v) {
        return (function (self) {
            return function (height, width) {
                var size = self.getSize(width, height);
                var yOffset = 0;
                var totalHeight = size * self.yTiles * 2;
                if (totalHeight < height) {
                    yOffset = (height - totalHeight) / 2;
                }
                return Math.floor(size * 3 / 2 * v + size + self.topOffset(height) / 2 + yOffset);
            };
        })(this);
    };

    HexViewHelper.prototype.create = function (u, v) {
        return this.stage.createHexagon()
            .setPosition(this.getXFn(u, v), this.getYFn(v))
            .setRadius(this.getSize.bind(this))
            .setAngle(POINTY_TOPPED_ANGLE);
    };

    return HexViewHelper;
})(H5.Width, Math);
H5.Camera = (function () {
    'use strict';

    function Camera(viewPort, maxX, maxY) {
        this.viewPort = viewPort;

        // 1st universe grid tiles (u,v)
        // 2nd universe px screen coordinates (x,y)
        // 3rd universe px space coordinates (x,y)
        // - while screen coordinates are relative, space coordinates are an absolute representation of tiles in px

        this.minX = this.viewPort.getWidthHalf();
        this.minY = this.viewPort.getHeightHalf();
        this.maxX = maxX;
        this.maxY = maxY;

        this.isPositionLocked = false;
        this.isShow = true;
        this.__zoom = 1;
    }

    Camera.prototype.calcScreenPosition = function (entity, drawable, ignoreScale, useDrawableScale) {
        if (this.__zoom === 1) {
            var cornerX = this.viewPort.getCornerX();
            var cornerY = this.viewPort.getCornerY();
            if (entity.getEndX() < cornerX || entity.getCornerX() > this.viewPort.getEndX() ||
                entity.getEndY() < cornerY || entity.getCornerY() > this.viewPort.getEndY()) {

                drawable.show = false;
                return;
            }

            drawable.show = this.isShow;

            drawable.x = entity.x - cornerX;
            drawable.y = entity.y - cornerY;
            if (!ignoreScale) {
                drawable.scale = entity.scale;
            }

            return;
        }

        var widthHalf = this.viewPort.getWidthHalf() / this.__zoom;
        var heightHalf = this.viewPort.getHeightHalf() / this.__zoom;
        var left = this.viewPort.x - widthHalf;
        var right = this.viewPort.x + widthHalf;
        var top = this.viewPort.y - heightHalf;
        var bottom = this.viewPort.y + heightHalf;

        var entityRight = entity.getEndX();
        var entityLeft = entity.getCornerX();
        var entityBottom = entity.getEndY();
        var entityTop = entity.getCornerY();

        if (entityRight < left || entityLeft > right || entityBottom < top || entityTop > bottom) {
            drawable.show = false;
            return;
        }

        drawable.show = this.isShow;

        drawable.x = (entity.x - left) * this.__zoom;
        drawable.y = (entity.y - top) * this.__zoom;
        if (useDrawableScale) {
            if (drawable.currentScale === undefined) {
                drawable.currentScale = drawable.scale;
            }
            drawable.scale = drawable.currentScale * this.__zoom;
        } else {
            drawable.scale = entity.scale * this.__zoom;
        }
    };

    Camera.prototype.calcBulletsScreenPosition = function (entity, drawable) {
        var cornerX = this.viewPort.getCornerX();
        var cornerY = this.viewPort.getCornerY();

        var right = entity.data.ax > entity.data.bx ? entity.data.ax : entity.data.bx;
        var left = entity.data.ax < entity.data.bx ? entity.data.ax : entity.data.bx;
        var bottom = entity.data.ay > entity.data.by ? entity.data.ay : entity.data.by;
        var top = entity.data.ay < entity.data.by ? entity.data.ay : entity.data.by;

        if (right < cornerX || left > this.viewPort.getEndX() || bottom < cornerY || top > this.viewPort.getEndY()) {

            drawable.show = false;
            return;
        }

        drawable.show = this.isShow;

        drawable.data.ax = entity.data.ax - cornerX * this.viewPort.scale;
        drawable.data.ay = entity.data.ay - cornerY * this.viewPort.scale;
        drawable.data.bx = entity.data.bx - cornerX * this.viewPort.scale;
        drawable.data.by = entity.data.by - cornerY * this.viewPort.scale;
    };

    Camera.prototype.move = function (anchor) {
        if (this.isPositionLocked) {
            return;
        }

        this.viewPort.x = anchor.x;
        this.viewPort.y = anchor.y;

        var minX = this.minX / this.__zoom;
        var minY = this.minY / this.__zoom;
        var maxX = this.__zoom !== 1 ? this.maxX + minX : this.maxX;
        var maxY = this.__zoom !== 1 ? this.maxY + minY : this.maxY;
        if (this.viewPort.x < minX) {
            this.viewPort.x = minX;
        }
        if (this.viewPort.x > maxX) {
            this.viewPort.x = maxX;
        }
        if (this.viewPort.y < minY) {
            this.viewPort.y = minY;
        }
        if (this.viewPort.y > maxY) {
            this.viewPort.y = maxY;
        }
    };

    Camera.prototype.unlockPosition = function () {
        this.isPositionLocked = false;
    };

    Camera.prototype.lockPosition = function () {
        this.isPositionLocked = true;
    };

    Camera.prototype.hideDrawables = function () {
        this.isShow = false;
    };

    Camera.prototype.showDrawables = function () {
        this.isShow = true;
    };

    Camera.prototype.zoom = function (factor) {
        this.__zoom = factor;
    };

    return Camera;
})();
H5.PlayerControls = (function (Event, Array, Math, Vectors) {
    'use strict';

    var Action = {
        LEFT: 'left',
        NOTHING: 'nothing',
        RIGHT: 'right',
        UP: 'up',
        DOWN: 'down'
    };

    function getAxisAction(xAxisValue, yAxisValue, deadZone) {
        var yAxis = yAxisValue;
        if (yAxis > -deadZone && yAxis < deadZone) {
            yAxis = 0;
        }

        var xAxis = xAxisValue;
        if (xAxis > -deadZone && xAxis < deadZone) {
            xAxis = 0;
        }

        if (xAxis != 0 && yAxis != 0) {
            var angle = Vectors.getAngle(xAxis, yAxis);

            if (angle < 0) {
                if (angle < -Math.PI * 3 / 4) {
                    return Action.LEFT;
                } else if (angle < -Math.PI / 4) {
                    return Action.UP;
                }
                return Action.RIGHT;
            }
            if (angle > Math.PI * 3 / 4) {
                return Action.LEFT;
            } else if (angle > Math.PI / 4) {
                return Action.DOWN;
            }
            return Action.RIGHT;

        } else if (yAxis != 0) {
            if (yAxis > 0) {
                return Action.DOWN;
            }
            return Action.UP;
        } else if (xAxis != 0) {
            if (xAxis > 0) {
                return Action.RIGHT;
            }
            return Action.LEFT;
        }
        return Action.NOTHING;
    }

    function getStickFunction(store) {
        return function (deadZone) {
            store.deadZone = deadZone || 0.1;
            store.lastAction = Action.NOTHING;
            return {
                onDirectionUp: getRegisterCallbackFunction(store, 'up'),
                onDirectionRight: getRegisterCallbackFunction(store, 'right'),
                onDirectionDown: getRegisterCallbackFunction(store, 'down'),
                onDirectionLeft: getRegisterCallbackFunction(store, 'left'),
                onDirectionNeutral: getRegisterCallbackFunction(store, 'neutral')
            };
        };
    }

    function getRegisterCallbackFunction(store, name) {
        return function (callback, self) {
            if (self) {
                store[name] = callback.bind(self);
            } else {
                store[name] = callback;
            }
            return this;
        };
    }

    function updateStick(store, xAxis, yAxis) {
        var action = getAxisAction(xAxis, yAxis, store.deadZone);
        if (action != store.lastAction) {
            store.lastAction = action;
            if (action == Action.LEFT) {
                if (store.left) {
                    store.left();
                }
            } else if (action == Action.UP) {
                if (store.up) {
                    store.up();
                }
            } else if (action == Action.RIGHT) {
                if (store.right) {
                    store.right();
                }
            } else if (action == Action.DOWN) {
                if (store.down) {
                    store.down();
                }
            } else {
                if (store.neutral) {
                    store.neutral();
                }
            }
        }
    }

    function createGamePadControls() {
        var directionsLeft = {};
        var directionsRight = {};
        var conditions = [];
        var negativeConditions = [];
        var unsubscribe;

        var gamePad = createControls(Event.GAME_PAD);

        gamePad.addLeftStick = getStickFunction(directionsLeft);
        gamePad.addRightStick = getStickFunction(directionsRight);

        gamePad.basicRegister = gamePad.register;
        gamePad.basicCancel = gamePad.cancel;
        gamePad.register = function (events) {
            this.basicRegister(events);

            var axisListener = events.subscribe(Event.GAME_PAD, function (gamePad) {
                if (shouldIgnore(conditions, negativeConditions, gamePad)) {
                    return;
                }
                updateStick(directionsLeft, gamePad.getLeftStickXAxis(), gamePad.getLeftStickYAxis());
                updateStick(directionsRight, gamePad.getRightStickXAxis(), gamePad.getRightStickYAxis());
            });

            unsubscribe = function () {
                events.unsubscribe(axisListener);
                unsubscribe = undefined;
            };

            return this;
        };
        gamePad.__setCondition = function (condition) {
            conditions.push(condition);
        };
        gamePad.__setNegativeCondition = function (negativeCondition) {
            negativeConditions.push(negativeCondition);
        };
        gamePad.cancel = function () {
            this.basicCancel();
            if (unsubscribe) {
                unsubscribe();
            }
            return this;
        };
        return gamePad;
    }

    function createTvOSRemoteControls() {
        var gestures = {};
        var conditions = [];
        var negativeConditions = [];
        var unsubscribe;

        var gamePad = createControls(Event.GAME_PAD);

        gamePad.onDirectionUp = getRegisterCallbackFunction(gestures, 'up');
        gamePad.onDirectionRight = getRegisterCallbackFunction(gestures, 'right');
        gamePad.onDirectionDown = getRegisterCallbackFunction(gestures, 'down');
        gamePad.onDirectionLeft = getRegisterCallbackFunction(gestures, 'left');

        gamePad.basicRegister = gamePad.register;
        gamePad.basicCancel = gamePad.cancel;
        gamePad.register = function (events) {
            this.basicRegister(events);

            var neutral = true;
            var started = false;
            var start = {
                x: 0,
                y: 0
            };
            var end = {
                x: 0,
                y: 0
            };
            var axisListener = events.subscribe(Event.GAME_PAD, function (gamePad) {
                if (shouldIgnore(conditions, negativeConditions, gamePad)) {
                    return;
                }

                neutral = !(gamePad.isDPadDownPressed() || gamePad.isDPadLeftPressed() || gamePad.isDPadUpPressed() ||
                gamePad.isDPadRightPressed());

                if (!neutral && !started) {
                    // start gesture
                    started = true;
                    start.x = gamePad.getLeftStickXAxis();
                    start.y = gamePad.getLeftStickYAxis();

                } else if (!neutral && started) {
                    // continue gesture
                    end.x = gamePad.getLeftStickXAxis();
                    end.y = gamePad.getLeftStickYAxis();

                } else if (neutral && started) {
                    // end gesture

                    var swipe = interpretSwipe(start, end);
                    if (swipe == Direction.DOWN) {
                        if (gestures.down) {
                            gestures.down();
                        }
                    } else if (swipe == Direction.LEFT) {
                        if (gestures.left) {
                            gestures.left();
                        }
                    } else if (swipe == Direction.UP) {
                        if (gestures.up) {
                            gestures.up();
                        }
                    } else if (swipe == Direction.RIGHT) {
                        if (gestures.right) {
                            gestures.right();
                        }
                    }

                    // clean up
                    started = false;
                    start.x = 0;
                    start.y = 0;
                    end.x = 0;
                    end.y = 0;
                }
            });

            unsubscribe = function () {
                events.unsubscribe(axisListener);
                unsubscribe = undefined;
            };

            return this;
        };
        gamePad.__setCondition = function (condition) {
            conditions.push(condition);
        };
        gamePad.__setNegativeCondition = function (negativeCondition) {
            negativeConditions.push(negativeCondition);
        };
        gamePad.cancel = function () {
            this.basicCancel();
            if (unsubscribe) {
                unsubscribe();
            }
            return this;
        };

        gamePad.setCondition('profile', 'microGamepad');

        return gamePad;
    }

    function createKeyBoardControls() {
        return createControls(Event.KEY_BOARD);
    }

    function createControls(event) {

        var unsubscribe;
        var commands = [];
        var conditions = [];
        var negativeConditions = [];

        return {
            setCondition: function (key, value) {
                var condition = {
                    key: key,
                    value: value
                };
                if (this.__setCondition) {
                    this.__setCondition(condition);
                }
                conditions.push(condition);
            },
            setNegativeCondition: function (key, value) {
                var negCondition = {
                    key: key,
                    value: value
                };
                if (this.__setNegativeCondition) {
                    this.__setNegativeCondition(negCondition);
                }
                negativeConditions.push(negCondition);
            },
            add: function (keyCode) {

                var command = {
                    code: keyCode,
                    isPressed: false
                };

                commands.push(command);

                return {
                    or: function (keyCode) {
                        if (command.or === undefined) {
                            command.or = keyCode;
                        } else if (command.or instanceof Array) {
                            command.or.push(keyCode);
                        } else {
                            command.or = [command.or, keyCode];
                        }

                        return this;
                    },
                    and: function (keyCode) {
                        if (command.and === undefined) {
                            command.and = keyCode;
                        } else if (command.and instanceof Array) {
                            command.and.push(keyCode);
                        } else {
                            command.and = [command.and, keyCode];
                        }

                        return this;
                    },
                    onDown: function (callback, self) {
                        if (self) {
                            command.onDown = callback.bind(self);
                        } else {
                            command.onDown = callback;
                        }

                        return this;
                    },
                    onUp: function (callback, self) {
                        if (self) {
                            command.onUp = callback.bind(self);
                        } else {
                            command.onUp = callback;
                        }

                        return this;
                    },
                    remove: function () {
                        commands.splice(commands.indexOf(command), 1);

                        return this;
                    }
                };
            },

            register: function (events) {
                var eventId = events.subscribe(event, function (inputType) {
                    if (shouldIgnore(conditions, negativeConditions, inputType)) {
                        return;
                    }

                    commands.forEach(function (command) {
                        var isPressed;
                        if (command.or && command.or instanceof Array) {
                            isPressed = inputType.isPressed(command.code) || command.or.some(function (code) {
                                    return inputType.isPressed(code);
                                });
                        } else if (command.or) {
                            isPressed = inputType.isPressed(command.code) || inputType.isPressed(command.or);
                        } else if (command.and && command.and instanceof Array) {
                            isPressed = inputType.isPressed(command.code) && command.and.every(function (code) {
                                    return inputType.isPressed(code);
                                });
                        } else if (command.and) {
                            isPressed = inputType.isPressed(command.code) && inputType.isPressed(command.and);
                        } else {
                            isPressed = inputType.isPressed(command.code);
                        }

                        if (isPressed && !command.isPressed) {
                            command.isPressed = true;
                            if (command.onDown) {
                                command.onDown();
                            }

                        } else if (!isPressed && command.isPressed) {
                            command.isPressed = false;
                            if (command.onUp) {
                                command.onUp();
                            }
                        }
                    });
                });

                unsubscribe = function () {
                    events.unsubscribe(eventId);
                    unsubscribe = undefined;
                };

                return this;
            },

            cancel: function () {
                if (unsubscribe) {
                    unsubscribe();
                }

                return this;
            }
        };
    }

    var Direction = {
        LEFT: 'left',
        RIGHT: 'right',
        UP: 'up',
        DOWN: 'down'
    };

    function interpretSwipe(start, end) {
        var vector = Vectors.get(start.x, start.y, end.x, end.y);
        if (Vectors.squaredMagnitude(vector.x, vector.y) < 0.25 * 0.25) {
            // case B: tap
            return getDirection(end);

        }
        // case A: normal swipe
        return getDirection(vector);
    }

    function getDirection(vector) {
        var angle = Vectors.getAngle(vector.x, vector.y);

        if (angle < 0) {
            if (angle < -Math.PI * 3 / 4) {
                return Direction.LEFT;
            } else if (angle < -Math.PI / 4) {
                return Direction.UP;
            }
            return Direction.RIGHT;
        }
        if (angle > Math.PI * 3 / 4) {
            return Direction.LEFT;
        } else if (angle > Math.PI / 4) {
            return Direction.DOWN;
        }
        return Direction.RIGHT;
    }

    function shouldIgnore(conditions, negativeConditions, inputType) {
        var isNotMet = conditions.some(function (keyValuePair) {
            return inputType[keyValuePair.key] != keyValuePair.value;
        });
        if (isNotMet) {
            return true;
        }
        isNotMet = negativeConditions.some(function (keyValuePair) {
            return inputType[keyValuePair.key] == keyValuePair.value;
        });
        return isNotMet;
    }

    return {
        getGamePad: createGamePadControls,
        getTvOSRemote: createTvOSRemoteControls,
        getKeyBoard: createKeyBoardControls
    };
})(H5.Event, Array, Math, H5.Vectors);
H5.GameLoop = (function (requestAnimationFrame, Event) {
    'use strict';

    // callback from animationFrame infrastructure. tick list of given periodic handlers
    function GameLoop(events) {
        this.events = events;

        this.isMove = true;
        this.isCollision = true;
        this.__stop = false;
    }

    GameLoop.prototype.stop = function () {
        this.__stop = true;
    };

    GameLoop.prototype.run = function () {
        if (this.__stop) {
            return;
        }

        requestAnimationFrame(this.run.bind(this));

        this.events.fireSync(Event.TICK_START);

        // deliver queued events
        this.events.update();

        // input phase
        this.events.fireSync(Event.TICK_INPUT);
        this.events.fireSync(Event.TICK_POST_INPUT);

        // move phase
        if (this.isMove) {
            this.events.fireSync(Event.TICK_MOVE);
        }

        // collision phase
        if (this.isCollision) {
            this.events.fireSync(Event.TICK_COLLISION);
            this.events.fireSync(Event.TICK_POST_COLLISION);
            this.events.fireSync(Event.TICK_POST_POST_COLLISION);
        }

        // pre draw phase
        this.events.fireSync(Event.TICK_CAMERA);
        // draw phase
        this.events.fireSync(Event.TICK_DRAW);

        this.events.fireSync(Event.TICK_END);
    };

    GameLoop.prototype.disableMove = function () {
        this.isMove = false;
    };

    GameLoop.prototype.enableMove = function () {
        this.isMove = true;
    };

    GameLoop.prototype.disableCollision = function () {
        this.isCollision = false;
    };

    GameLoop.prototype.enableCollision = function () {
        this.isCollision = true;
    };

    return GameLoop;
})(window.requestAnimationFrame.bind(window), H5.Event);
H5.installLoop = (function (GameLoop, Event) {
    'use strict';

    function installLoop(stage, events) {

        var gameLoop = new GameLoop(events);

        events.subscribe(Event.TICK_CAMERA, stage.clear.bind(stage));
        events.subscribe(Event.TICK_DRAW, stage.update.bind(stage));
        events.subscribe(Event.TICK_START, events.updateDeletes.bind(events));

        gameLoop.run();

        return gameLoop;
    }

    return installLoop;
})(H5.GameLoop, H5.Event);
H5.getStage = (function ($) {
    'use strict';

    function createLegacy(gfxCache, renderer) {

        var motions = new $.Motions(new $.BasicAnimations());
        var spriteAnimations = new $.SpriteAnimations();
        var animations = new $.BasicAnimations(); // todo check if it's possible to use same object for motions
        var animationHelper = new $.BasicAnimationHelper(animations);
        var timer = new $.CallbackTimer();

        var audioAnimations = new $.AudioAnimations(animations);

        return new $.Stage(gfxCache, motions, new $.MotionTimer(motions, timer), new $.MotionHelper(motions),
            spriteAnimations, new $.SpriteTimer(spriteAnimations, timer), animations, animationHelper,
            new $.BasicAnimationTimer(animations, timer), new $.PropertyAnimations(animations, animationHelper),
            renderer, timer, audioAnimations);
    }

    function createResponsive(gfxCache, renderer, device, events) {
        var repoKeys = [
            'position',
            'position_a',
            'position_b',
            'position_c',
            'position_d',
            'width',
            'height',
            'size',
            'length',
            'lineWidth',
            'lineHeight',
            'lineLength',
            'path',
            'path_a',
            'path_b',
            'path_c',
            'path_d',
            'radius'
        ];
        var legacyStage = createLegacy(gfxCache, renderer);
        var stage = new $.NewStageAPI(legacyStage, gfxCache, new $.KeyRepository(repoKeys), device.width, device.height,
            new $.CallbackTimer());

        if (!device.isLowRez) {
            events.subscribe($.Event.RESIZE, stage.resize.bind(stage));
        }

        return stage;
    }

    return function (screen, gfxCache, device, events) {
        return createResponsive(gfxCache, new $.Renderer(screen), device, events);
    };
})({
    Renderer: H5.Renderer,
    Stage: H5.Stage,
    MotionHelper: H5.MotionHelper,
    MotionTimer: H5.MotionTimer,
    Motions: H5.Motions,
    SpriteTimer: H5.SpriteTimer,
    SpriteAnimations: H5.SpriteAnimations,
    PropertyAnimations: H5.PropertyAnimations,
    BasicAnimationHelper: H5.AnimationHelper,
    BasicAnimationTimer: H5.AnimationTimer,
    BasicAnimations: H5.BasicAnimations,
    NewStageAPI: H5.NewStageAPI,
    KeyRepository: H5.KeyRepository,
    CallbackTimer: H5.CallbackTimer,
    Event: H5.Event,
    AudioAnimations: H5.AudioAnimations
});
H5.AtlasResourceHelper = (function (AtlasCache, screenWidth, screenHeight, getDevicePixelRatio, Math) {
    'use strict';

    var defaultSize;
    var pixelRatio = getDevicePixelRatio();

    function registerAtlases(resourceLoader, atlases, isMobile, resolveAtlasPaths) {
        var info = resolveAtlasPaths(Math.floor(screenWidth * pixelRatio), Math.floor(screenHeight * pixelRatio),
            isMobile);
        defaultSize = info.defaultSize;
        info.paths.forEach(function (groupedAtlasInfo) {
            atlases.push({
                atlas: resourceLoader.addImage(groupedAtlasInfo.gfx),
                info: resourceLoader.addJSON(groupedAtlasInfo.data)
            });
        });
    }

    function processAtlases(atlases, width, height) {
        var gfxCache = new AtlasCache(Math.floor(width * pixelRatio), Math.floor(height * pixelRatio), defaultSize);
        gfxCache.init(atlases);

        return gfxCache;
    }

    function fixedRezProcess(atlases, width, height) {
        var gfxCache = new AtlasCache(width, height, height);
        gfxCache.init(atlases);

        return gfxCache;
    }

    return {
        register: registerAtlases,
        process: processAtlases,
        processFixedRez: fixedRezProcess
    };
})(H5.AtlasCache, window.screen.availWidth, window.screen.availHeight, H5.getDevicePixelRatio, Math);
H5.createAtlasPaths = (function () {
    'use strict';

    var DEFAULT_ATLAS_NAME = 'atlas';
    var DEFAULT_GFX_PATH = 'gfx/';
    var DEFAULT_DATA_PATH = 'data/';
    var DEFAULT_GFX_EXTENSION = '.png';
    var DEFAULT_DATA_EXTENSION = '.json';

    function createAtlasPaths(optionalBaseName, optionalGfxPath, optionalDataPath, optionalGfxExtension,
        optionalDataExtension) {

        var atlases = [];

        function getFileName(i, size) {
            if (size) {
                return (optionalBaseName || DEFAULT_ATLAS_NAME) + '_' + size + '_' + i;
            }
            return (optionalBaseName || DEFAULT_ATLAS_NAME) + '_' + i;
        }

        function getFileNames(size, count) {
            var names = [];
            for (var i = 0; i < count; i++) {
                names.push(getFileName(i, size));
            }

            return names;
        }

        function resolveAtlasPaths(width, height) {
            var size = width > height ? width : height;
            for (var i = 0; i < atlases.length; i++) {
                var atlas = atlases[i];
                if (size <= atlas.size) {
                    return {
                        paths: getFileTypedNames(getFileNames(atlas.size, atlas.count)),
                        defaultSize: atlas.size
                    };
                }
            }

            var last = atlases[atlases.length - 1];
            return {
                paths: getFileTypedNames(getFileNames(last.size, last.count)),
                defaultSize: last.size
            };
        }

        function getFileTypedNames(names) {
            var aggregatedPaths = [];

            names.forEach(function (name) {
                aggregatedPaths.push({
                    gfx: (optionalGfxPath || DEFAULT_GFX_PATH) + name + (optionalGfxExtension || DEFAULT_GFX_EXTENSION),
                    data: (optionalDataPath || DEFAULT_DATA_PATH) + name +
                    (optionalDataExtension || DEFAULT_DATA_EXTENSION)
                });
            });

            return aggregatedPaths;
        }

        return {
            add: function (size, optionalCount) {

                atlases.push({
                    size: size,
                    count: optionalCount || 1
                });

                return this;
            },
            getResolver: function () {
                atlases.sort(function (a, b) {
                    return a.size - b.size;
                });

                return resolveAtlasPaths;
            }
        };
    }

    return createAtlasPaths;
})();
H5.ImageResourceHelper = (function (ImageCache, Object, getDevicePixelRatio, Math) {
    'use strict';

    var GFX_FOLDER = 'gfx/';
    var FILE_EXT = '.png';

    function registerImages(resourceLoader, imgNames, images) {
        imgNames.forEach(function (name) {
            images[name] = resourceLoader.addImage(GFX_FOLDER + name + FILE_EXT);
        });
    }

    function registerSprites(resourceLoader, spriteInfoPairs, images) {
        spriteInfoPairs.forEach(function (info) {
            for (var i = 0; i < info.numberOfFrames; i++) {
                var name;
                if (i < 10) {
                    name = info.name + '_000' + i;
                    images[name] = resourceLoader.addImage(GFX_FOLDER + name + FILE_EXT);
                } else {
                    name = info.name + '_00' + i;
                    images[name] = resourceLoader.addImage(GFX_FOLDER + name + FILE_EXT);
                }
            }
        });
    }

    function processImages(images, width, height, defaultSize) {
        var pixelRatio = getDevicePixelRatio();
        var gfxCache = new ImageCache(Math.floor(width * pixelRatio), Math.floor(height * pixelRatio), defaultSize);

        Object.keys(images).forEach(function (key) {
            gfxCache.add(key, images[key]);
        });

        return gfxCache;
    }

    return {
        register: registerImages,
        process: processImages
    };
})(H5.ImageCache, Object, H5.getDevicePixelRatio, Math);
H5.AtlasLoader = (function (AtlasResourceHelper, createAtlasPaths, Device, userAgent, width, height) {
    'use strict';

    var atlasPaths;
    var atlases = [];
    return {
        register: function (registerAtlases) {
            atlasPaths = registerAtlases(createAtlasPaths);
        },
        load: function (resourceLoader) {
            var isMobile = new Device(userAgent, 1, 1, 1).isMobile;
            AtlasResourceHelper.register(resourceLoader, atlases, isMobile, atlasPaths);
        },
        process: function (services) {
            services.gfxCache = AtlasResourceHelper.process(atlases, width, height);
        }
    };
})(H5.AtlasResourceHelper, H5.createAtlasPaths, H5.Device, window.navigator.userAgent, window.innerWidth,
    window.innerHeight);
H5.EjectaFontLoader = (function ($, H5) {
    'use strict';

    var font;
    return {
        register: function (fontPath, name) {
            font = fontPath;
            H5.TV_FONT = name;
        },
        load: function () {
            $.ejecta.loadFont(font);
        },
        process: function (services) {
        }
    };
})(window, H5);
H5.FixedRezAtlasLoader = (function (AtlasResourceHelper, createAtlasPaths, Device, userAgent) {
    'use strict';

    var fixedWidth;
    var fixedHeight;
    var atlases = [];

    var baseName;
    var gfxPath;
    var dataPath;
    var gfxExt;
    var dataExt;

    return {
        register: function (width, height, optionalBaseName, optionalGfxPath, optionalDataPath, optionalGfxExtension,
            optionalDataExtension) {
            fixedWidth = width;
            fixedHeight = height;
            baseName = optionalBaseName;
            gfxPath = optionalGfxPath;
            dataPath = optionalDataPath;
            gfxExt = optionalGfxExtension;
            dataExt = optionalDataExtension;
        },
        load: function (resourceLoader) {
            var isMobile = new Device(userAgent, 1, 1, 1).isMobile;
            AtlasResourceHelper.register(resourceLoader, atlases, isMobile,
                createAtlasPaths(baseName, gfxPath, dataPath, gfxExt, dataExt).add().getResolver());
        },
        process: function (services) {
            services.gfxCache = AtlasResourceHelper.processFixedRez(atlases, fixedWidth, fixedHeight);
        }
    };
})(H5.AtlasResourceHelper, H5.createAtlasPaths, H5.Device, window.navigator.userAgent);
H5.FontLoader = (function (addFontToDOM, URL) {
    'use strict';

    var font;
    var path;
    var name;
    return {
        register: function (fontPath, fontName) {
            path = fontPath;
            name = fontName;
        },
        load: function (resourceLoader) {
            font = resourceLoader.addFont(path);
        },
        process: function () {
            if (URL) {
                addFontToDOM([
                    {
                        name: name,
                        url: URL.createObjectURL(font.blob)
                    }
                ]);
            }
        }
    };
})(H5.addFontToDOM, window.URL);
H5.HtmlAudioLoader = (function (SoundResources) {
    'use strict';

    var sounds;
    var dict;
    var path;
    var format;
    return {
        register: function (soundDict, optionalPath, optionalExtension) {
            dict = soundDict;
            path = optionalPath;
            format = optionalExtension;
        },
        load: function (resourceLoader) {
            sounds = new SoundResources(resourceLoader, path, format).createHtmlAudioSounds(dict);
        },
        process: function (services) {
            services.sounds = sounds;
        }
    };
})(H5.SoundResources);
H5.HtmlAudioSpriteLoader = (function (HtmlAudioSprite, installHtmlAudioSprite) {
    'use strict';

    var musicInfoFilePath;
    var musicFilePath;
    var sfxInfoFilePath;
    var sfxFilePath;

    var musicInfo;
    var music;
    var sfxInfo;
    var sfxTracks = [];
    var tracks = 0;

    return {
        register: function (musicInfoPath, musicPath, sfxInfoPath, sfxPath, sfxTrackCount) {
            musicInfoFilePath = musicInfoPath;
            musicFilePath = musicPath;
            sfxInfoFilePath = sfxInfoPath;
            sfxFilePath = sfxPath;

            tracks = sfxTrackCount;
        },
        load: function (resourceLoader) {
            sfxInfo = resourceLoader.addJSON(sfxInfoFilePath);
            musicInfo = resourceLoader.addJSON(musicInfoFilePath);

            music = resourceLoader.addAudio(musicFilePath);

            while (tracks-- > 0) {
                sfxTracks.push(resourceLoader.addAudio(sfxFilePath));
            }
        },
        postProcess: function (services) {
            services.sfx = new HtmlAudioSprite(sfxInfo.spritemap, sfxTracks, services.timer, services.stage);
            services.music = new HtmlAudioSprite(musicInfo.spritemap, music, services.timer, services.stage);

            installHtmlAudioSprite(services.events, services.sfx);
            installHtmlAudioSprite(services.events, services.music);
        }
    };
})(H5.HtmlAudioSprite, H5.installHtmlAudioSprite);
H5.ImageLoader = (function () {
    'use strict';

    //noinspection JSUnusedLocalSymbols
    return {
        register: function (info) {
            throw 'not implemented';
        },
        load: function (resourceLoader) {
            throw 'not implemented';
        },
        process: function (services) {
            throw 'not implemented';
        }
    };
})();
H5.LocalesLoader = (function (UniversalTranslator) {
    'use strict';

    var locales;
    var path;
    return {
        register: function (localesPath) {
            path = localesPath;
        },
        load: function (resourceLoader) {
            locales = resourceLoader.addJSON(path);
        },
        process: function (services) {
            services.messages = new UniversalTranslator(locales);
        }
    };
})(H5.UniversalTranslator);
H5.SceneLoader = (function () {
    'use strict';

    var scenes;
    var path;
    return {
        register: function (scenesPath) {
            path = scenesPath;
        },
        load: function (resourceLoader) {
            scenes = resourceLoader.addJSON(path);
        },
        process: function (services) {
            services.scenes = scenes;
        }
    };
})();
H5.WebAudioSpriteLoader = (function (AudioContext, WebAudioSprite, installWebAudioSprite) {
    'use strict';

    var audioCtx;
    var music;
    var sfx;
    var musicInfo;
    var sfxInfo;

    var musicInfoFilePath;
    var musicFilePath;
    var sfxInfoFilePath;
    var sfxFilePath;

    return {
        register: function (musicInfoPath, musicPath, sfxInfoPath, sfxPath) {
            musicInfoFilePath = musicInfoPath;
            musicFilePath = musicPath;
            sfxInfoFilePath = sfxInfoPath;
            sfxFilePath = sfxPath;
        },
        load: function (resourceLoader) {
            audioCtx = new AudioContext();
            music = resourceLoader.addWebAudio(musicFilePath, audioCtx);
            sfx = resourceLoader.addWebAudio(sfxFilePath, audioCtx);

            sfxInfo = resourceLoader.addJSON(sfxInfoFilePath);
            musicInfo = resourceLoader.addJSON(musicInfoFilePath);
        },
        postProcess: function (services) {
            services.sfx = new WebAudioSprite(sfxInfo.spritemap, sfx.buffer, audioCtx, services.timer);
            services.music = new WebAudioSprite(musicInfo.spritemap, music.buffer, audioCtx, services.timer);

            installWebAudioSprite(services.events, services.sfx);
            installWebAudioSprite(services.events, services.music);
        }
    };
})(window.AudioContext, H5.WebAudioSprite, H5.installWebAudioSprite);
H5.ResourceLoader = (function (Blob, Image, Object, JSON, Audio) {
    'use strict';

    var ResourceType = {
        IMAGE: 0,
        SOUND: 1,
        JSON: 2,
        FONT: 3,
        AUDIO: 4,
        WEB_AUDIO: 5
    };

    function ResourceLoader() {
        this.resources = [];
        this.resourcesLoaded = 0;
        this.__counter = 0;
    }

    ResourceLoader.prototype.getCount = function () {
        return this.__counter;
    };

    ResourceLoader.prototype.addImage = function (imgSrc) {
        this.__counter++;
        var img = new Image();
        this.resources.push({
            type: ResourceType.IMAGE,
            file: img,
            src: imgSrc
        });

        return img;
    };

    ResourceLoader.prototype.addAudio = function (audioSrc) {
        this.__counter++;
        var audio = new Audio();
        this.resources.push({
            type: ResourceType.AUDIO,
            file: audio,
            src: audioSrc
        });

        return audio;
    };

    ResourceLoader.prototype.addWebAudio = function (audioSrc, audioCtx) {
        this.__counter++;
        var bufferWrapper = {};
        this.resources.push({
            type: ResourceType.WEB_AUDIO,
            file: bufferWrapper,
            src: audioSrc,
            ctx: audioCtx
        });

        return bufferWrapper;
    };

    ResourceLoader.prototype.addJSON = function (jsonSrc, payload) {
        this.__counter++;
        var jsonObject = {};
        this.resources.push({
            type: ResourceType.JSON,
            file: jsonObject,
            src: jsonSrc,
            payload: payload
        });

        return jsonObject;
    };

    ResourceLoader.prototype.addFont = function (fontSrc) {
        this.__counter++;
        var font = {};
        this.resources.push({
            type: ResourceType.FONT,
            file: font,
            src: fontSrc
        });

        return font;
    };

    ResourceLoader.prototype.load = function () {
        if (this.resources.length == this.resourcesLoaded && this.onComplete) {
            this.onComplete();
            return;
        }

        var self = this;
        self.resources.forEach(function (elem) {

            if (elem.type === ResourceType.IMAGE) {
                elem.file.onload = function () {
                    self.onResourceLoad();
                };
                elem.file.src = elem.src;

            } else if (elem.type === ResourceType.AUDIO) {
                elem.file.addEventListener('canplaythrough', function () {
                    self.onResourceLoad();
                });
                elem.file.src = elem.src;
                elem.file.load();

            } else if (elem.type === ResourceType.JSON) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', elem.src, true);

                xhr.onload = function () {
                    var json = JSON.parse(this.responseText);
                    Object.keys(json).forEach(function (key) {
                        elem.file[key] = json[key];
                    });

                    self.onResourceLoad();
                };
                xhr.send();

            } else if (elem.type === ResourceType.FONT) {
                var xhrFont = new XMLHttpRequest();
                xhrFont.open('GET', elem.src, true);
                xhrFont.responseType = 'arraybuffer';

                xhrFont.onload = function () {

                    if (Blob) {
                        elem.file.blob = new Blob([xhrFont.response], {type: 'application/font-woff'});
                    } else {
                        console.log('error: Blob constructing not supported');
                    }

                    self.onResourceLoad();
                };

                xhrFont.send();

            } else if (elem.type === ResourceType.WEB_AUDIO) {

                var xhrAudio = new XMLHttpRequest();
                xhrAudio.open('GET', elem.src, true);
                xhrAudio.responseType = 'arraybuffer';

                xhrAudio.onload = function () {
                    var audioData = xhrAudio.response;
                    elem.ctx.decodeAudioData(audioData, function (buffer) {
                        elem.file.buffer = buffer;
                        self.onResourceLoad();
                    });
                };
                xhrAudio.send();
            }
        });
    };

    ResourceLoader.prototype.onResourceLoad = function () {
        this.resourcesLoaded++;
        var onProgress = this.onProgress;
        if (onProgress !== undefined && typeof onProgress === 'function') {
            onProgress();
        }

        if (this.resourcesLoaded === this.resources.length) {
            var onComplete = this.onComplete;
            if (onComplete !== undefined && typeof onComplete === 'function') {
                onComplete();
            }
        }
    };

    return ResourceLoader;
})(Blob, Image, Object, JSON, Audio);
H5.ResizeHandler = (function (getDevicePixelRatio, Event, Math) {
    'use strict';

    function ResizeHandler(events, device) {
        this.events = events;
        this.device = device;
    }

    ResizeHandler.prototype.handleResize = function (event) {
        var width = event.target.innerWidth;
        var height = event.target.innerHeight;

        var pixelRatio = getDevicePixelRatio();

        if (!this.device.isLowRez) {
            this.events.fire(Event.RESIZE, {
                width: Math.floor(width * pixelRatio),
                height: Math.floor(height * pixelRatio),
                cssWidth: width,
                cssHeight: height,
                devicePixelRatio: pixelRatio
            });
        } else {
            this.events.fire(Event.RESIZE, {
                width: this.device.width,
                height: this.device.height,
                cssWidth: width,
                cssHeight: height,
                devicePixelRatio: pixelRatio
            });
        }
    };

    return ResizeHandler;
})(H5.getDevicePixelRatio, H5.Event, Math);
H5.SimpleLoadingScreen = (function (Math) {
    'use strict';

    function SimpleLoadingScreen(screenCtx) {
        this.screenCtx = screenCtx;

        this.startBarX = 0;
        this.startBarY = 0;
        this.barWidth = 0;
        this.barHeight = 0;
        this.progressCounter = 1;
        this.parts = 0;
        this.txt = 'LOADING';
    }

    SimpleLoadingScreen.prototype.showNew = function (parts) {
        this.progressCounter = 1;
        this.parts = parts;

        this._calcScreenPositions(this.screenCtx.canvas.width, this.screenCtx.canvas.height);
        this._initialRendering();
    };

    SimpleLoadingScreen.prototype.showProgress = function () {
        if (this.progressCounter <= this.parts) {
            this.screenCtx.fillRect(this.startBarX, this.startBarY, this.barWidth / this.parts * this.progressCounter,
                this.barHeight);
            this.progressCounter++;
        }
    };

    SimpleLoadingScreen.prototype.resize = function (event) {
        this._resizeScreen(event.width, event.height);
        this._calcScreenPositions(event.width, event.height);
        this._initialRendering();

        this.screenCtx.fillRect(this.startBarX, this.startBarY, this.barWidth / this.parts * this.progressCounter,
            this.barHeight);
    };

    SimpleLoadingScreen.prototype._calcScreenPositions = function (width, height) {
        this.centerX = Math.floor(width / 2);
        this.startBarX = width / 4;
        this.startBarY = height / 6;
        this.barWidth = width - (this.startBarX * 2);
        this.barHeight = height - (this.startBarY * 2);
    };

    SimpleLoadingScreen.prototype._initialRendering = function () {
        this.screenCtx.fillStyle = 'grey';
        this.screenCtx.fillRect(0, 0, this.screenCtx.canvas.clientWidth, this.screenCtx.canvas.clientHeight);
        this.screenCtx.strokeStyle = 'white';
        this.screenCtx.strokeRect(this.startBarX, this.startBarY, this.barWidth, this.barHeight);

        this.screenCtx.fillStyle = 'white';
        this.screenCtx.font = 'italic 40pt sans-serif';
        this.screenCtx.textAlign = 'center';

        this.screenCtx.fillText(this.txt, this.centerX, this.startBarY + this.barHeight + 40);
    };

    SimpleLoadingScreen.prototype._resizeScreen = function (width, height) {
        this.screenCtx.canvas.width = width;
        this.screenCtx.canvas.height = height;
    };

    return SimpleLoadingScreen;
})(Math);
H5.OrientationHandler = (function (window, Orientation, screen, Event) {
    'use strict';

    function OrientationHandler(events) {
        this.events = events;
        this.lastOrientation = -1;
    }

    OrientationHandler.prototype.orientationType = function () {
        var currentOrientation = /portrait/i.test(screen.orientation.type) ? Orientation.PORTRAIT :
            Orientation.LANDSCAPE;
        this.__fireEvent(currentOrientation);
    };

    OrientationHandler.prototype.screenOrientation = function () {
        var screenOrientation = screen.orientation || screen.mozOrientation || screen.msOrientation;
        var currentOrientation = /portrait/i.test(screenOrientation) ? Orientation.PORTRAIT : Orientation.LANDSCAPE;
        this.__fireEvent(currentOrientation);
    };

    OrientationHandler.prototype.windowOrientation = function () {
        var currentOrientation;
        switch (window.orientation) {
            case 0:
                currentOrientation = Orientation.PORTRAIT;
                break;
            case -90:
                currentOrientation = Orientation.LANDSCAPE;
                break;
            case 90:
                currentOrientation = Orientation.LANDSCAPE;
                break;
            case 180:
                currentOrientation = Orientation.PORTRAIT;
                break;
        }
        this.__fireEvent(currentOrientation);
    };

    OrientationHandler.prototype.handleResize = function () {
        var currentOrientation = (window.innerWidth > window.innerHeight) ? Orientation.LANDSCAPE :
            Orientation.PORTRAIT;
        this.__fireEvent(currentOrientation);
    };

    OrientationHandler.prototype.__fireEvent = function (currentOrientation) {
        if (this.lastOrientation === currentOrientation) {
            return;
        }

        this.events.fire(Event.SCREEN_ORIENTATION, currentOrientation);
        this.lastOrientation = currentOrientation;
    };

    return OrientationHandler;
})(window, H5.Orientation, window.screen, H5.Event);
H5.VisibilityHandler = (function (document, Event) {
    'use strict';

    function VisibilityHandler(events) {
        this.events = events;
        this.lastState = document.hidden;
    }

    VisibilityHandler.prototype.handleVisibility = function () {
        var hidden = document.hidden;
        if (this.lastState !== hidden) {
            this.events.fireSync(Event.PAGE_VISIBILITY, hidden);
            this.lastState = hidden;
        }
    };

    return VisibilityHandler;
})(window.document, H5.Event);
H5.FullScreenHandler = (function (Event) {
    'use strict';

    function FullScreenHandler(controller, events) {
        this.controller = controller;
        this.events = events;
    }

    FullScreenHandler.prototype.change = function () {
        this.events.fire(Event.FULL_SCREEN, this.controller.isFullScreen());
    };

    return FullScreenHandler;
})(H5.Event);
H5.installCanvas = (function (document, Event, Math) {
    'use strict';

    function installCanvas(events, device, optionalCanvas, width, height, pixelRatio, pixelWidth, pixelHeight) {
        var canvas = optionalCanvas || document.createElement('canvas');

        if (pixelWidth && pixelHeight) {
            canvas.width = pixelWidth;
            canvas.height = pixelHeight;

            canvas.style['display'] = 'none';

            var scale = height / pixelHeight;
            var scaledWidth = pixelWidth * scale;
            var scaledHeight = pixelHeight * scale;
            device.screenScale = scale;

            var scaledCanvas = document.createElement('canvas');
            scaledCanvas.width = scaledWidth;
            scaledCanvas.height = scaledHeight;
            var context = scaledCanvas.getContext('2d');
            if ('imageSmoothingEnabled' in context) {
                context.imageSmoothingEnabled = false;
            } else if ('mozImageSmoothingEnabled' in context) {
                context.mozImageSmoothingEnabled = false;
            } else if ('webkitImageSmoothingEnabled' in context) {
                context.webkitImageSmoothingEnabled = false;
            } else if ('msImageSmoothingEnabled' in context) {
                context.msImageSmoothingEnabled = false;
            }
            document.body.appendChild(scaledCanvas);

            events.subscribe(Event.RESIZE, function (event) {
                // var realScreenWidth = Math.floor(event.cssWidth * event.devicePixelRatio);
                var realScreenHeight = Math.floor(event.cssHeight * event.devicePixelRatio);

                var scale = realScreenHeight / pixelHeight;
                scaledWidth = pixelWidth * scale;
                scaledHeight = pixelHeight * scale;
                scaledCanvas.width = scaledWidth;
                scaledCanvas.height = scaledHeight;
                device.screenScale = scale;

                var context = scaledCanvas.getContext('2d');
                if ('imageSmoothingEnabled' in context) {
                    context.imageSmoothingEnabled = false;
                } else if ('mozImageSmoothingEnabled' in context) {
                    context.mozImageSmoothingEnabled = false;
                } else if ('webkitImageSmoothingEnabled' in context) {
                    context.webkitImageSmoothingEnabled = false;
                } else if ('msImageSmoothingEnabled' in context) {
                    context.msImageSmoothingEnabled = false;
                }
            });

            events.subscribe(Event.TICK_END, function () {
                context.clearRect(0, 0, scaledWidth, scaledHeight);
                context.drawImage(canvas, 0, 0, pixelWidth, pixelHeight, 0, 0, scaledWidth, scaledHeight);
            });

        } else if (pixelRatio > 1) {
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            canvas.width = Math.floor(width * pixelRatio);
            canvas.height = Math.floor(height * pixelRatio);
        } else {
            canvas.width = width;
            canvas.height = height;
        }

        if (!optionalCanvas) {
            document.body.appendChild(canvas);
        }

        return {
            screen: canvas,
            scaledScreen: scaledCanvas
        };
    }

    return installCanvas;
})(window.document, H5.Event, Math);
H5.installResize = (function (window, ResizeHandler, Event) {
    'use strict';

    function installResize(events, device) {
        var resizeHandler = new ResizeHandler(events, device);
        window.addEventListener('resize', resizeHandler.handleResize.bind(resizeHandler));
        events.subscribe(Event.RESIZE, function (event) {
            if (!device.isLowRez) {
                device.width = event.width;
                device.height = event.height;
            }
            device.cssWidth = event.cssWidth;
            device.cssHeight = event.cssHeight;
            device.devicePixelRatio = event.devicePixelRatio;
        });
        device.forceResize = function () {
            events.fire(Event.RESIZE, {
                width: this.width,
                height: this.height,
                cssWidth: this.cssWidth,
                cssHeight: this.cssHeight,
                devicePixelRatio: this.devicePixelRatio
            });
        };
    }

    return installResize;
})(window, H5.ResizeHandler, H5.Event);
H5.installOrientation = (function (window, screen, OrientationHandler, Event) {
    'use strict';

    function installOrientation(events, device) {
        var handler = new OrientationHandler(events);

        if ('orientation' in screen && 'angle' in screen.orientation) {
            handler.orientationType();
            screen.orientation.addEventListener('change', handler.orientationType.bind(handler));

        } else if (screen.orientation || screen.mozOrientation || screen.msOrientation) {
            handler.screenOrientation();
            screen.addEventListener('orientationchange', handler.screenOrientation.bind(handler));
            screen.addEventListener('MSOrientationChange', handler.screenOrientation.bind(handler));
            screen.addEventListener('mozorientationchange', handler.screenOrientation.bind(handler));

        } else if (window.orientation) {
            handler.windowOrientation();
            window.addEventListener('orientationchange', handler.windowOrientation.bind(handler));

        } else {
            handler.handleResize();
            window.addEventListener('resize', handler.handleResize.bind(handler));
        }
        device.orientation = handler.lastOrientation;

        events.subscribe(Event.SCREEN_ORIENTATION, function (orientation) {
            device.orientation = orientation;
        });
    }

    return installOrientation;
})(window, window.screen, H5.OrientationHandler, H5.Event);
H5.installVisibility = (function (VisibilityHandler, document, Event) {
    'use strict';

    function installVisibility(events, device) {
        var handler = new VisibilityHandler(events);

        if (document.hidden !== undefined) {
            document.addEventListener('visibilitychange', handler.handleVisibility.bind(handler));
        } else {
            return;
        }
        device.pageHidden = handler.lastState;
        events.subscribe(Event.PAGE_VISIBILITY, function (hidden) {
            device.pageHidden = hidden;
        });
    }

    return installVisibility;
})(H5.VisibilityHandler, window.document, H5.Event);
H5.installFullScreen = (function (document, FullScreenController, FullScreenHandler) {
    'use strict';

    function installFullScreen(screenElement, events) {
        var controller = new FullScreenController(screenElement);
        var handler = new FullScreenHandler(controller, events);
        if (controller.isSupported) {
            document.addEventListener('fullscreenchange', handler.change.bind(handler));
            document.addEventListener('webkitfullscreenchange', handler.change.bind(handler));
            document.addEventListener('mozfullscreenchange', handler.change.bind(handler));
            document.addEventListener('MSFullscreenChange', handler.change.bind(handler));
        }

        return controller;
    }

    return installFullScreen;
})(window.document, H5.FullScreenController, H5.FullScreenHandler);
H5.installPointer = (function (PointerHandler, Event, window) {
    'use strict';

    function installPointer(events, device, canvas) {
        var pointerHandler = new PointerHandler(events, device);

        if (window.PointerEvent) {

            canvas.addEventListener('pointerdown', pointerHandler.pointerDown.bind(pointerHandler));
            canvas.addEventListener('pointermove', pointerHandler.pointerMove.bind(pointerHandler));
            canvas.addEventListener('pointerup', pointerHandler.pointerUp.bind(pointerHandler));
            canvas.addEventListener('pointerout', pointerHandler.pointerCancel.bind(pointerHandler));

        } else {
            if ('ontouchstart' in window) {

                canvas.addEventListener('touchstart', pointerHandler.touchStart.bind(pointerHandler));
                canvas.addEventListener('touchmove', pointerHandler.touchMove.bind(pointerHandler));
                canvas.addEventListener('touchend', pointerHandler.touchEnd.bind(pointerHandler));
                canvas.addEventListener('touchcancel', pointerHandler.touchCancel.bind(pointerHandler));
            }
            canvas.addEventListener('mousedown', pointerHandler.mouseDown.bind(pointerHandler));
            canvas.addEventListener('mousemove', pointerHandler.mouseMove.bind(pointerHandler));
            canvas.addEventListener('mouseup', pointerHandler.mouseUp.bind(pointerHandler));
            canvas.addEventListener('mouseout', pointerHandler.mouseCancel.bind(pointerHandler));
        }

        events.subscribe(Event.TICK_INPUT, pointerHandler.update.bind(pointerHandler));

        return pointerHandler;
    }

    return installPointer;
})(H5.PointerHandler, H5.Event, window);
H5.installKeyBoard = (function (window, KeyHandler, Event) {
    'use strict';

    function installKeyBoard(events) {
        var keyHandler = new KeyHandler(events);

        function keyDown(event) {
            keyHandler.keyDown(event);
        }

        function keyUp(event) {
            keyHandler.keyUp(event);
        }

        window.addEventListener('keydown', keyDown);
        window.addEventListener('keyup', keyUp);
        events.subscribe(Event.TICK_INPUT, keyHandler.update.bind(keyHandler));

        function removeEventListener() {
            window.removeEventListener('keydown', keyDown);
            window.removeEventListener('keyup', keyUp);
        }

        return removeEventListener;
    }

    return installKeyBoard;
})(window, H5.KeyHandler, H5.Event);
H5.installWheel = (function (window, Event, WheelHandler) {
    'use strict';

    function installKeyBoard(events) {
        var wheelHandler = new WheelHandler(events);

        function wheel(event) {
            wheelHandler.rotation(event);
        }

        window.addEventListener('wheel', wheel);

        events.subscribe(Event.TICK_INPUT, wheelHandler.update.bind(wheelHandler));

        function removeEventListener() {
            window.removeEventListener('wheel', wheel);
        }

        return removeEventListener;
    }

    return installKeyBoard;
})(window, H5.Event, H5.WheelHandler);
H5.installGamePad = (function (window, GamePadHandler, Event) {
    'use strict';

    function installGamePad(events) {
        var gamePadHandler = new GamePadHandler(events);

        window.addEventListener('gamepadconnected', gamePadHandler.connect.bind(gamePadHandler));
        window.addEventListener('gamepaddisconnected', gamePadHandler.disconnect.bind(gamePadHandler));

        events.subscribe(Event.TICK_INPUT, gamePadHandler.update.bind(gamePadHandler));
    }

    return installGamePad;
})(window, H5.GamePadHandler, H5.Event);
H5.EventBus = (function (iterateSomeEntries, Object) {
    'use strict';

    function EventBus() {
        this.dict = {};
        this.idGenerator = 0;
        this.pending = {};
        this.pendingDeletes = [];
    }

    EventBus.prototype.update = function () {
        Object.keys(this.pending).forEach(function (key) {
            var payload = this.pending[key];
            var subscribers = this.dict[key];
            Object.keys(subscribers).forEach(function (subscriberKey) {
                subscribers[subscriberKey](payload);
            });
            delete this.pending[key];
        }, this);
    };

    EventBus.prototype.fire = function (eventName, payload) {
        var subscribers = this.dict[eventName];
        if (subscribers) {
            if (payload != null) {
                this.pending[eventName] = payload;
            } else {
                this.pending[eventName] = true;
            }
        }
    };

    EventBus.prototype.fireSync = function (eventName, payload) {
        var dict = this.dict[eventName];
        if (dict) {
            Object.keys(dict).forEach(function (key) {
                dict[key](payload);
            });
        }
    };

    EventBus.prototype.subscribe = function (eventName, callback, self) {
        if (!this.dict[eventName]) {
            this.dict[eventName] = {};
        }

        var id = this.idGenerator++;
        this.dict[eventName][id] = self ? callback.bind(self) : callback;
        return id;
    };

    EventBus.prototype.unsubscribe = function (id) {
        this.pendingDeletes.push(id);
    };

    EventBus.prototype.__delete = function (id) {
        iterateSomeEntries(this.dict, function (subscribers) {
            if (subscribers[id]) {
                delete subscribers[id];
                return true;
            }
            return false;
        });
    };

    EventBus.prototype.updateDeletes = function () {
        this.pendingDeletes.forEach(this.__delete.bind(this));
        while (this.pendingDeletes.length > 0) {
            this.pendingDeletes.pop();
        }
    };

    return EventBus;
})(H5.iterateSomeEntries, Object);
H5.App = (function (ResourceLoader, SimpleLoadingScreen, installLoop, concatenateProperties, CallbackTimer, Event,
    getStage) {
    'use strict';

    function App(services, resourcesLoadingQueue, runMyScenes, removeKeyHandler, removeWheelHandler) {
        this.services = services;
        this.resourcesQueue = resourcesLoadingQueue;
        this.runMyScenes = runMyScenes;
        this.removeKeyHandler = removeKeyHandler;
        this.removeWheelHandler = removeWheelHandler;
    }

    App.prototype.start = function (appInfo, hideLoadingScreen, callback) {
        // show loading screen, load binary resources
        var resourceLoader = new ResourceLoader();

        this.resourcesQueue.forEach(function (loader) {
            loader.load(resourceLoader);
        });
        var filesCount = resourceLoader.getCount();

        var events = this.services.events;
        if (!hideLoadingScreen) {
            var initialScreen = new SimpleLoadingScreen(this.services.screen.getContext('2d'));
            resourceLoader.onProgress = initialScreen.showProgress.bind(initialScreen);
            var initScreenId = events.subscribe(Event.RESIZE, initialScreen.resize.bind(initialScreen));
            initialScreen.showNew(filesCount);
        }

        var self = this;
        resourceLoader.onComplete = function () {
            if (!hideLoadingScreen) {
                events.unsubscribe(initScreenId);
            }

            var sceneServices = {};

            self.resourcesQueue.forEach(function (loader) {
                if (loader.process) {
                    loader.process(sceneServices);
                }
            });

            sceneServices.stage = getStage(self.services.screen, sceneServices.gfxCache, self.services.device, events);
            sceneServices.loop = self.loop = installLoop(sceneServices.stage, events);

            var timer = new CallbackTimer();
            events.subscribe(Event.TICK_START, timer.update.bind(timer));
            sceneServices.timer = timer;

            sceneServices.sceneStorage = {};
            sceneServices.sceneStorage.endCallback = function () {
                self.stop();
                if (self.removeKeyHandler) {
                    self.removeKeyHandler();
                }
                if (self.removeWheelHandler) {
                    self.removeWheelHandler();
                }
                if (self.services.device.isFullScreen()) {
                    self.services.device.exitFullScreen();
                }
                if (callback) {
                    callback();
                }
            };

            concatenateProperties(self.services, sceneServices);
            sceneServices.info = appInfo;

            self.resourcesQueue.forEach(function (loader) {
                if (loader.postProcess) {
                    loader.postProcess(sceneServices);
                }
            });

            self.runMyScenes(sceneServices);
        };

        resourceLoader.load();
    };

    App.prototype.stop = function () {
        this.loop.stop();
    };

    return App;

})(H5.ResourceLoader, H5.SimpleLoadingScreen, H5.installLoop, H5.concatenateProperties, H5.CallbackTimer, H5.Event,
    H5.getStage);
H5.Bootstrapper = (function ($) {
    'use strict';

    var Bootstrapper = {
        build: buildApp,

        // controls - choose [0...n]
        keyBoard: addKeyBoard,
        gamePad: addGamePad,
        pointer: addPointer,
        wheel: addWheel,

        // system-services / device-events - choose [0...n]
        orientation: addScreenOrientation,
        visibility: addPageVisibility,
        fullScreen: addFullScreen,

        // rendering - choose [1]
        atlas: useAtlasRendering,
        fixedRezAtlas: useFixedRezAtlasRendering,
        image: useImageRendering,

        // screen (size) - choose [0...n]
        responsive: addResize,
        lowRez: addLowResolutionRendering,

        // font - choose [0|1]
        font: useFont,
        ejectaFont: useEjectaFont,

        // framework services - choose [0...n]
        analytics: addAnalytics,
        locales: useLocales,
        scenes: useH5Scenes,

        // audio - choose [0|1]
        webAudioSprite: useWebAudioSprite,
        htmlAudio: useHtmlAudio,
        htmlAudioSprite: useHtmlAudioSprite
    };

    // dependencies on screen, therefore flags because you need a screen first (build: screen -> features: with screen)
    var lowRezWidth;
    var lowRezHeight;
    var useLowRez = false;
    var useFullScreen = false;
    var usePointer = false;

    var events;
    var device;
    var removeKeyListener;
    var removeWheelListener;
    var noOneDidAnInit = true;
    var resourceLoadingQueue;

    function initBootstrap() {
        noOneDidAnInit = false;
        useLowRez = false;
        useFullScreen = false;
        usePointer = false;

        events = new $.EventBus();
        device = new $.Device($.userAgent, $.width, $.height, $.getDevicePixelRatio(), $.screenWidth, $.screenHeight);

        resourceLoadingQueue = [];
    }

    function buildApp(myResources, installMyScenes, optionalCanvas) {
        if (noOneDidAnInit) {
            initBootstrap();
        }

        var screen = useLowRez ?
            $.installCanvas(events, device, optionalCanvas, $.width, $.height, $.getDevicePixelRatio(), lowRezWidth,
                lowRezHeight) :
            $.installCanvas(events, device, optionalCanvas, $.width, $.height, $.getDevicePixelRatio());

        if (useLowRez) {
            device.width = lowRezWidth;
            device.height = lowRezHeight;
            device.isLowRez = true;
        }

        if (useFullScreen) {
            var fs = $.installFullScreen(useLowRez ? screen.scaledScreen : screen.screen, events);
            device.requestFullScreen = fs.request.bind(fs);
            device.isFullScreen = fs.isFullScreen.bind(fs);
            device.isFullScreenSupported = fs.__isSupported.bind(fs);
            device.exitFullScreen = fs.exit.bind(device);
        }

        if (usePointer) {
            $.installPointer(events, device, useLowRez ? screen.scaledScreen : screen.screen);
        }

        var globalServices = {
            screen: screen.screen,
            events: events,
            device: device,
            scaledScreen: screen.scaledScreen
        };

        noOneDidAnInit = true;

        resourceLoadingQueue.push(myResources);

        return new $.App(globalServices, resourceLoadingQueue, installMyScenes, removeKeyListener, removeWheelListener);
    }

    function addLowResolutionRendering(width, height) {
        if (noOneDidAnInit) {
            initBootstrap();
        }

        lowRezWidth = width;
        lowRezHeight = height;
        useLowRez = true;
        return Bootstrapper;
    }

    function addScreenOrientation() {
        if (noOneDidAnInit) {
            initBootstrap();
        }

        $.installOrientation(events, device);
        device.lockOrientation = $.OrientationLock.lock;
        device.unlockOrientation = $.OrientationLock.unlock;
        return Bootstrapper;
    }

    function addPageVisibility() {
        if (noOneDidAnInit) {
            initBootstrap();
        }

        $.installVisibility(events, device);
        return Bootstrapper;
    }

    function addFullScreen() {
        if (noOneDidAnInit) {
            initBootstrap();
        }

        useFullScreen = true;
        return Bootstrapper;
    }

    function addResize() {
        if (noOneDidAnInit) {
            initBootstrap();
        }

        $.installResize(events, device);
        return Bootstrapper;
    }

    function addKeyBoard() {
        if (noOneDidAnInit) {
            initBootstrap();
        }

        removeKeyListener = $.installKeyBoard(events);
        return Bootstrapper;
    }

    function addWheel() {
        if (noOneDidAnInit) {
            initBootstrap();
        }

        removeWheelListener = $.installWheel(events);
        return Bootstrapper;
    }

    function addGamePad() {
        if (noOneDidAnInit) {
            initBootstrap();
        }

        $.installGamePad(events);
        return Bootstrapper;
    }

    function addPointer() {
        if (noOneDidAnInit) {
            initBootstrap();
        }

        usePointer = true;
        return Bootstrapper;
    }

    function addAnalytics(url, tenantCode, appKeyCode) {
        if (noOneDidAnInit) {
            initBootstrap();
        }

        $.installAnalytics(url, tenantCode, appKeyCode, events);
        return Bootstrapper;
    }

    function useAtlasRendering(registerPaths) {
        if (noOneDidAnInit) {
            initBootstrap();
        }
        $.AtlasLoader.register(registerPaths);
        resourceLoadingQueue.push($.AtlasLoader);
        return Bootstrapper;
    }

    function useEjectaFont(path, name) {
        if (noOneDidAnInit) {
            initBootstrap();
        }
        $.EjectaFontLoader.register(path, name);
        resourceLoadingQueue.push($.EjectaFontLoader);
        return Bootstrapper;
    }

    function useFixedRezAtlasRendering(width, height, optionalBaseName, optionalGfxPath, optionalDataPath,
        optionalGfxExtension, optionalDataExtension) {
        if (noOneDidAnInit) {
            initBootstrap();
        }
        $.FixedRezAtlasLoader.register(width, height, optionalBaseName, optionalGfxPath, optionalDataPath,
            optionalGfxExtension, optionalDataExtension);
        resourceLoadingQueue.push($.FixedRezAtlasLoader);
        return Bootstrapper;
    }

    function useFont(path, name) {
        if (noOneDidAnInit) {
            initBootstrap();
        }
        $.FontLoader.register(path, name);
        resourceLoadingQueue.push($.FontLoader);
        return Bootstrapper;
    }

    function useHtmlAudio(soundNamesToPathsDict, optionalPath, optionalExtension) {
        if (noOneDidAnInit) {
            initBootstrap();
        }
        $.HtmlAudioLoader.register(soundNamesToPathsDict, optionalPath, optionalExtension);
        resourceLoadingQueue.push($.HtmlAudioLoader);
        return Bootstrapper;
    }

    function useHtmlAudioSprite(musicInfoPath, musicPath, sfxInfoPath, sfxPath, sfxTrackCount) {
        if (noOneDidAnInit) {
            initBootstrap();
        }
        $.HtmlAudioSpriteLoader.register(musicInfoPath, musicPath, sfxInfoPath, sfxPath, sfxTrackCount);
        resourceLoadingQueue.push($.HtmlAudioSpriteLoader);
        return Bootstrapper;
    }

    function useImageRendering(notImplementedYet) {
        if (noOneDidAnInit) {
            initBootstrap();
        }
        $.ImageLoader.register(notImplementedYet);
        resourceLoadingQueue.push($.ImageLoader);
        return Bootstrapper;
    }

    function useLocales(path) {
        if (noOneDidAnInit) {
            initBootstrap();
        }
        $.LocalesLoader.register(path);
        resourceLoadingQueue.push($.LocalesLoader);
        return Bootstrapper;
    }

    function useH5Scenes(path) {
        if (noOneDidAnInit) {
            initBootstrap();
        }
        $.SceneLoader.register(path);
        resourceLoadingQueue.push($.SceneLoader);
        return Bootstrapper;
    }

    function useWebAudioSprite(musicInfoPath, musicPath, sfxInfoPath, sfxPath) {
        if (noOneDidAnInit) {
            initBootstrap();
        }
        $.WebAudioSpriteLoader.register(musicInfoPath, musicPath, sfxInfoPath, sfxPath);
        resourceLoadingQueue.push($.WebAudioSpriteLoader);
        return Bootstrapper;
    }

    return Bootstrapper;
})({
    installCanvas: H5.installCanvas,
    installResize: H5.installResize,
    installKeyBoard: H5.installKeyBoard,
    installWheel: H5.installWheel,
    installGamePad: H5.installGamePad,
    installOrientation: H5.installOrientation,
    installFullScreen: H5.installFullScreen,
    installPointer: H5.installPointer,
    installVisibility: H5.installVisibility,
    installAnalytics: H5.installHolmes,
    App: H5.App,
    EventBus: H5.EventBus,
    Device: H5.Device,
    width: window.innerWidth,
    height: window.innerHeight,
    screenWidth: window.screen.availWidth,
    screenHeight: window.screen.availHeight,
    getDevicePixelRatio: H5.getDevicePixelRatio,
    OrientationLock: H5.OrientationLock,
    userAgent: window.navigator.userAgent,
    AtlasLoader: H5.AtlasLoader,
    EjectaFontLoader: H5.EjectaFontLoader,
    FixedRezAtlasLoader: H5.FixedRezAtlasLoader,
    FontLoader: H5.FontLoader,
    HtmlAudioLoader: H5.HtmlAudioLoader,
    HtmlAudioSpriteLoader: H5.HtmlAudioSpriteLoader,
    ImageLoader: H5.ImageLoader,
    LocalesLoader: H5.LocalesLoader,
    SceneLoader: H5.SceneLoader,
    WebAudioSpriteLoader: H5.WebAudioSpriteLoader
});