var GetReady = (function (Transition, calcScreenConst, changeCoords, changePath, GameStuffHelper) {
    "use strict";

    function GetReady(stage, sceneStorage, resizeBus) {
        this.stage = stage;
        this.sceneStorage = sceneStorage;
        this.resizeBus = resizeBus;
    }

    var GET_READY_SCENE = 'get_ready_scene';
    var GET_READY = 'get_ready';

    GetReady.prototype.show = function (nextScene, screenWidth, screenHeight) {
        var self = this;
        self.resizeBus.add(GET_READY_SCENE, this.resize.bind(this));
        var heightThird = calcScreenConst(screenHeight, 3);
        var readyWidth = self.stage.getSubImage(GET_READY).width;
        self.readyDrawable = self.stage.getDrawable(- readyWidth, heightThird, GET_READY);

        self.readyPath = self.stage.getPath(- readyWidth, heightThird, screenWidth + readyWidth, heightThird, 90,
            Transition.EASE_OUT_IN_SIN);

        self.stage.move(self.readyDrawable, self.readyPath, function () {

            // create end event method to end scene, this is endGetReadyScene
            self.stage.remove(self.readyDrawable);

            self.resizeBus.remove(GET_READY_SCENE);
            delete self.readyDrawable;
            delete self.readyPath;
            nextScene();
        });
    };

    GetReady.prototype.resize = function (width, height) {
        var heightThird = calcScreenConst(height, 3);
        var readyWidth = this.stage.getSubImage(GET_READY).width;
        if (this.readyDrawable)
            changeCoords(this.readyDrawable, - readyWidth, heightThird);
        if (this.readyPath)
            changePath(this.readyPath, - readyWidth, heightThird, width + readyWidth, heightThird);

        GameStuffHelper.resize(this.stage, this.sceneStorage, width, height);
    };

    return GetReady;
})(Transition, calcScreenConst, changeCoords, changePath, GameStuffHelper);