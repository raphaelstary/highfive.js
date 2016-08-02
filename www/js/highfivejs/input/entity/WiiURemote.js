H5.WiiURemote = (function () {
    "use strict";

    function WiiURemote(index, remote) {
        this.remote = remote;
        this.index = index;
        // todo state = remote.update(index) http://wiiubrew.org/wiki/Internet_Browser
    }

    return WiiURemote;
})();