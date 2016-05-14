H5.SimpleLoadingScreen = (function (Math) {
    "use strict";

    function SimpleLoadingScreen(screenCtx) {
        this.screenCtx = screenCtx;

        this.startBarX = 0;
        this.startBarY = 0;
        this.barWidth = 0;
        this.barHeight = 0;
        this.progressCounter = 1;
        this.parts = 0;
        this.txt = "LOADING";
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