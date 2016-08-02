H5.Stats = (function (Math, Date) {
    "use strict";
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