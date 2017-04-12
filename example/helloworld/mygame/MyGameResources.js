G.MyGameResources = (function () {
    'use strict';

    // your files

    function initLoadingFiles(resourceLoader) {
        // add your files to the resource loader
    }

    function processFiles(services) {
        // process your downloaded files & maybe add them to the global scene services object
    }

    return {
        load: initLoadingFiles,
        process: processFiles
    };

})();