G.MyGameResources = (function () {
    "use strict";

    // your files

    function registerFiles(resourceLoader) {
        // add your files to the resource loader for downloading

        return resourceLoader.getCount(); // number of registered files
    }

    function processFiles() {
        // process your downloaded files

        return {
            // services created with downloaded files
        };
    }

    return {
        create: registerFiles,
        process: processFiles
    };
})();