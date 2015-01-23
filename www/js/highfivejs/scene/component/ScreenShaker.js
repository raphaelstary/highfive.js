var ScreenShaker = (function (Math, Object) {
    "use strict";

    function ScreenShaker() {
        this.shaker = {};
        this.__init();
    }

    ScreenShaker.prototype.__init = function () {
        this.shaking = false;
        this.smallShaking = false;
        this.bigShaking = false;

        this.time = 0;
        this.duration = 60;
        this.lastOffSetY = 0;
    };

    ScreenShaker.prototype.startBigShake = function () {
        var self = this;
        if (this.shaking) {
            if (this.smallShaking) {
                this.smallShaking = false;
            }

            Object.keys(this.shaker).forEach(function (key) {
                var item = self.shaker[key];
                item.x = item._startValueX;
            });

            if (this.bigShaking) {
                Object.keys(this.shaker).forEach(function (key) {
                    var item = self.shaker[key];
                    item.y = item.y - self.lastOffSetY;
                });
                this.lastOffSetY = 0;
            }
        }

        this.shaking = true;
        this.time = 0;
        this.bigShaking = true;
    };

    ScreenShaker.prototype.startSmallShake = function () {
        var self = this;
        if (this.shaking) {
            if (this.bigShaking) {
                return;
            }
            Object.keys(this.shaker).forEach(function (key) {
                var item = self.shaker[key];
                item.x = item._startValueX;
            });
        }

        this.shaking = true;
        this.time = 0;
        this.smallShaking = true;
    };

    ScreenShaker.prototype.update = function () {
        if (this.shaking) {
            var self = this;
            if (this.smallShaking) {
                var offSet = elasticOutShake(this.time, this.duration, 25, 5);

                Object.keys(this.shaker).forEach(function (key) {
                    var item = self.shaker[key];
                    if (self.time == 0) {
                        item._startValueX = item.x;
                    }
                    if (offSet != 0) {
                        item.x = item._startValueX + offSet;
                    } else {
                        item.x = item._startValueX;
                    }
                });

            } else if (this.bigShaking) {
                var amplitude = 150;
                var period = 5;
                var offSetX = elasticOutShake(this.time, this.duration, amplitude - 50, period + 5);
                var offSetY = elasticOutShake(this.time, this.duration, amplitude, period);

                Object.keys(this.shaker).forEach(function (key) {
                    var item = self.shaker[key];
                    if (self.time == 0) {
                        item._startValueX = item.x;
//                            item._startValueY = item.y;
                        self.lastOffSetY = 0;
                    }
                    if (offSetX != 0) {
                        item.x = item._startValueX + offSetX;
                    } else {
                        item.x = item._startValueX;
                    }
                    if (offSetY != 0) {
                        item.y = (item.y - self.lastOffSetY) + offSetY;
                    } else {
                        item.y = (item.y - self.lastOffSetY);
                    }
                });
                this.lastOffSetY = offSetY;
            }

            this.time++;
            if (this.time >= this.duration) {
                this.time = 0;
                this.shaking = false;

                Object.keys(this.shaker).forEach(function (key) {
                    var item = self.shaker[key];
                    item.x = item._startValueX;
                    delete item._startValueX;

                    if (self.bigShaking) {
                        item.y = item.y - self.lastOffSetY;
                        self.lastOffSetY = 0;
                    }
                });

                this.smallShaking = false;
                this.bigShaking = false;
            }
        }
    };

    function elasticOutShake(currentTime, duration, amplitude, period) {
        if (currentTime == 0 || (currentTime /= duration) == 1) {
            return 0;
        }

        return Math.floor(amplitude * Math.pow(2, -10 * currentTime) *
        Math.sin((currentTime * duration) * (2 * Math.PI) / period));
    }

    ScreenShaker.prototype.add = function (drawable) {
        this.shaker[drawable.id] = drawable;
    };

    ScreenShaker.prototype.remove = function (drawable) {
        delete this.shaker[drawable.id];
    };

    ScreenShaker.prototype.resize = function () {
        var self = this;
        Object.keys(this.shaker).forEach(function (key) {
            var item = self.shaker[key];
            if (item._startValueX) {
                item._startValueX = item.x;
            }
        });
    };

    ScreenShaker.prototype.reset = function () {
        this.shaker = {};
        this.__init();
    };

    return ScreenShaker;
})(Math, Object);