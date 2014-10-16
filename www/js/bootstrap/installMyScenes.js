var installMyScenes = (function (Intro, PreGame, StartingPosition, InGameTutorial, GetReady, PlayGame, KillScreen, PostGame, SceneManager) {
    "use strict";

    function installMyScenes(sceneServices) {

        var intro = new Intro(sceneServices);
        var preGame = new PreGame(sceneServices);
        var startingPosition = new StartingPosition(sceneServices);
        var inGameTutorial = new InGameTutorial(sceneServices);
        var getReady = new GetReady(sceneServices);
        var playGame = new PlayGame(sceneServices);
        var killScreen = new KillScreen(sceneServices);
        var postGame = new PostGame(sceneServices);

        var sceneManager = new SceneManager();

        sceneManager.add(intro.show.bind(intro), true);
        sceneManager.add(preGame.show.bind(preGame), true);
        sceneManager.add(startingPosition.show.bind(startingPosition));
        sceneManager.add(inGameTutorial.show.bind(inGameTutorial), true);
        sceneManager.add(getReady.show.bind(getReady));
        sceneManager.add(playGame.show.bind(playGame));
        sceneManager.add(killScreen.show.bind(killScreen));
        sceneManager.add(postGame.show.bind(postGame));

        return sceneManager;
    }

    return installMyScenes;
})(Intro, PreGame, StartingPosition, InGameTutorial, GetReady, PlayGame, KillScreen, PostGame, SceneManager);