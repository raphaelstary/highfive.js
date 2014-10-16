var StageFactory = (function ($) {
    "use strict";

    function createAtlasRenderer(screen) {
        return new $.AtlasRenderer(screen);
    }

    function createImageRenderer(screen) {
        return new $.ImageRenderer(screen);
    }

    function create(gfxCache, renderer) {

        return new $.StageDirector(
            gfxCache,
            new $.MotionDirector(new $.MotionStudio()),
            new $.SpriteAnimationDirector(new $.SpriteAnimationStudio()),
            new $.AnimationAssistant(new $.AnimationDirector(new $.AnimationStudio())),
            renderer
        );
    }

    function createResponsive(gfxCache, renderer, resize) {
        var stage = new $.ResizableStageDirector(
            create(gfxCache, renderer),
            gfxCache,
            new $.Repository(),
            $.Touchables.get,
            $.fetchDrawableIntoTouchable,
            resize.getWidth(),
            resize.getHeight());

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
    AtlasRenderer: AtlasRenderer,
    ImageRenderer: ImageRenderer,
    StageDirector: StageDirector,
    MotionDirector: MotionDirector,
    MotionStudio: MotionStudio,
    SpriteAnimationDirector: SpriteAnimationDirector,
    SpriteAnimationStudio: SpriteAnimationStudio,
    AnimationAssistant: AnimationAssistant,
    AnimationDirector: AnimationDirector,
    AnimationStudio: AnimationStudio,
    ResizableStageDirector: ResizableStageDirector,
    Repository: Repository,
    Touchables: Touchables,
    fetchDrawableIntoTouchable: fetchDrawableIntoTouchable
});