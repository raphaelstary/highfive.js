window.onload = function () {
    "use strict";

    var app = Bootstrapper.atlas().tap().pushRelease().build(MyGameResources);
    app.start();
};