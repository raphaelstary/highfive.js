var GetReady = (function (Transition, calcScreenConst, changeCoords, changePath) {
    "use strict";

    function GetReady(stage, resizeBus) {
        this.stage = stage;
        this.resizeBus = resizeBus;
    }

    GetReady.prototype.show = function (nextScene, screenWidth, screenHeight) {
        var self = this;
        self.resizeBus.add('get_ready_scene', this.resize.bind(this));
        var heightThird = calcScreenConst(screenHeight, 3);
        var readyWidth = self.stage.getSubImage('getready').width;
        self.readyDrawable = self.stage.getDrawable(- readyWidth, heightThird, 'getready');

        self.readyPath = self.stage.getPath(- readyWidth, heightThird, screenWidth + readyWidth, heightThird, 90,
            Transition.EASE_OUT_IN_SIN);

        self.stage.move(self.readyDrawable, self.readyPath, function () {

            // create end event method to end scene, this is endGetReadyScene
            self.stage.remove(self.readyDrawable);

            self.resizeBus.remove('get_ready_scene');
            delete self.readyDrawable;
            delete self.readyPath;
            nextScene();
        });
    };

    GetReady.prototype.resize = function (width, height) {
        var heightThird = calcScreenConst(height, 3);
        var readyWidth = this.stage.getSubImage('getready').width;
        if (this.readyDrawable)
            changeCoords(this.readyDrawable, - readyWidth, heightThird);
        if (this.readyPath)
            changePath(this.readyPath, - readyWidth, heightThird, width + readyWidth, heightThird);
    };

    return GetReady;
})(Transition, calcScreenConst, changeCoords, changePath);