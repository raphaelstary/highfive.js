var StageFactory = (function ($) {
    "use strict";

    function createAtlasRenderer(screen) {
        return new $.Renderer(screen);
    }

    function createImageRenderer(screen) {
        return new $.ImageRenderer(screen);
    }

    function create(gfxCache, renderer) {

        var motions = new $.Motions();
        var spriteAnimations = new $.SpriteAnimations();
        var animations = new $.BasicAnimations();
        var animationHelper = new $.BasicAnimationHelper(animations);

        return new $.Stage(gfxCache, motions, new $.MotionTimer(motions), new $.MotionHelper(motions), spriteAnimations,
            new $.SpriteAnimationTimer(spriteAnimations), animations, animationHelper,
            new $.BasicAnimationTimer(animations), new $.PropertyAnimations(animations, animationHelper), renderer);
    }

    function createResponsive(gfxCache, renderer, resize) {
        var stage = new $.ResizableStage(create(gfxCache, renderer), gfxCache, new $.Repository(), $.Touchables.get,
            $.fetchDrawableIntoTouchable, resize.getWidth(), resize.getHeight(), new $.CallbackTimer());

        resize.add('stage', stage.resize.bind(stage));

        return stage;
    }

    return {
        getResponsiveAtlasStage: function (screen, gfxCache, resize) {
            return createResponsive(gfxCache, createAtlasRenderer(screen), resize);
        },
        getAtlasStage: function (screen, gfxCache) {
            return create(gfxCache, createAtlasRenderer(screen));
        },
        getResponsiveImageStage: function (screen, gfxCache, resize) {
            return createResponsive(gfxCache, createImageRenderer(screen), resize);
        },
        getImageStage: function (screen, gfxCache) {
            return create(gfxCache, createImageRenderer(screen));
        }
    };
})({
    Renderer: Renderer,
    ImageRenderer: ImageRenderer,
    Stage: Stage,
    MotionHelper: MotionHelper,
    MotionTimer: MotionTimer,
    Motions: Motions,
    SpriteAnimationTimer: SpriteTimer,
    SpriteAnimations: SpriteAnimations,
    PropertyAnimations: PropertyAnimations,
    BasicAnimationHelper: AnimationHelper,
    BasicAnimationTimer: AnimationTimer,
    BasicAnimations: BasicAnimations,
    ResizableStage: ResizableStage,
    Repository: Repository,
    Touchables: Touchables,
    fetchDrawableIntoTouchable: fetchDrawableIntoTouchable,
    CallbackTimer: CallbackTimer
});