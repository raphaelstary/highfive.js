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

            Object.keys(this.shaker)
                .forEach(function (key) {
                    var item = this.shaker[key];
                    if (item._startValueX !== undefined) {
                        item.x = item._startValueX;
                    }
                }, this);

            if (this.bigShaking) {
                Object.keys(this.shaker)
                    .forEach(function (key) {
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
            Object.keys(this.shaker)
                .forEach(function (key) {
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

                Object.keys(this.shaker)
                    .forEach(function (key) {
                        var item = this.shaker[key];
                        if (this.time === 0 || item._startValueX === undefined) {
                            item._startValueX = item.x;
                        }

                        item.x = item._startValueX + offSet;
                    }, this);

            } else if (this.bigShaking) {
                var amplitude = this.__150;
                var period = this.__5;
                var offSetX = elasticOutShake(this.time, this.duration, amplitude - this.__50, period + this.__5);
                var offSetY = elasticOutShake(this.time, this.duration, amplitude, period);

                Object.keys(this.shaker)
                    .forEach(function (key) {
                        var item = this.shaker[key];
                        if (this.time === 0 || item._startValueX === undefined) {
                            item._startValueX = item.x;
                            item._startValueY = item.y;
                        }

                        item.x = item._startValueX + offSetX;
                        item.y = item._startValueY + offSetY;

                    }, this);
            }

            this.time++;
            if (this.time >= this.duration) {
                this.time = 0;
                this.shaking = false;

                Object.keys(this.shaker)
                    .forEach(function (key) {
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
        var temp = currentTime / duration;
        if (currentTime === 0 || temp === 1) {
            return 0;
        }

        return Math.floor(amplitude * Math.pow(2, -10 * temp) * Math.sin(temp * duration * 2 * Math.PI / period));
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
        Object.keys(this.shaker)
            .forEach(function (key) {
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
