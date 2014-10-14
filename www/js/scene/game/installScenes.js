var installScenes = (function (PreGame, MainGame) {
    "use strict";

    function installScenes(sceneServices, sceneManager) {

        var stage = sceneServices.stage,
            messages = sceneServices.messages,
            sounds = sceneServices.sounds,
            keyBoard = sceneServices.keyBoard,
            gamePad = sceneServices.gamePad;

        var preGame = new PreGame(stage, messages, sounds, keyBoard, gamePad);
        var theGame = new MainGame(stage, messages, sounds, keyBoard, gamePad);

        sceneManager.add(preGame.show.bind(preGame));
        sceneManager.add(theGame.show.bind(theGame));
    }

    return installScenes;
})(PreGame, MainGame);