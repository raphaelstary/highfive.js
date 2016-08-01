H5.OrientationLock = (function (screen) {
    "use strict";

    function lock(orientation) {
        if (!screen)
            return false;

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
        if (!screen)
            return false;

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