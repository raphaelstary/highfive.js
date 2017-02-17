H5.getStage = (function ($) {
    "use strict";

    function createLegacy(gfxCache, renderer) {

        var motions = new $.Motions(new $.BasicAnimations());
        var spriteAnimations = new $.SpriteAnimations();
        var animations = new $.BasicAnimations(); // todo check if it's possible to use same object for motions
        var animationHelper = new $.BasicAnimationHelper(animations);
        var timer = new $.CallbackTimer();

        var audioAnimations = new $.AudioAnimations(animations);

        return new $.Stage(gfxCache, motions, new $.MotionTimer(motions, timer), new $.MotionHelper(motions), spriteAnimations, new $.SpriteTimer(spriteAnimations, timer), animations, animationHelper, new $.BasicAnimationTimer(animations, timer), new $.PropertyAnimations(animations, animationHelper), renderer, timer, audioAnimations);
    }

    function createResponsive(gfxCache, renderer, device, events) {
        var repoKeys = [
            'position',
            'position_a',
            'position_b',
            'position_c',
            'position_d',
            'width',
            'height',
            'size',
            'length',
            'lineWidth',
            'lineHeight',
            'lineLength',
            'path',
            'path_a',
            'path_b',
            'path_c',
            'path_d',
            'radius'
        ];
        var legacyStage = createLegacy(gfxCache, renderer);
        var stage = new $.NewStageAPI(legacyStage, gfxCache, new $.KeyRepository(repoKeys), device.width, device.height, new $.CallbackTimer());

        if (!device.isLowRez) events.subscribe($.Event.RESIZE, stage.resize.bind(stage));

        return stage;
    }

    return function (screen, gfxCache, device, events) {
        return createResponsive(gfxCache, new $.Renderer(screen), device, events);
    };
})({
    Renderer: H5.Renderer,
    Stage: H5.Stage,
    MotionHelper: H5.MotionHelper,
    MotionTimer: H5.MotionTimer,
    Motions: H5.Motions,
    SpriteTimer: H5.SpriteTimer,
    SpriteAnimations: H5.SpriteAnimations,
    PropertyAnimations: H5.PropertyAnimations,
    BasicAnimationHelper: H5.AnimationHelper,
    BasicAnimationTimer: H5.AnimationTimer,
    BasicAnimations: H5.BasicAnimations,
    NewStageAPI: H5.NewStageAPI,
    KeyRepository: H5.KeyRepository,
    CallbackTimer: H5.CallbackTimer,
    Event: H5.Event,
    AudioAnimations: H5.AudioAnimations
});