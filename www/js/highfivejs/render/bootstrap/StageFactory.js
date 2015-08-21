var StageFactory = (function ($) {
    "use strict";

    function createAtlasRenderer(screen) {
        var renderer = new $.Renderer(screen);
        renderer.registerRenderer($.SubImage.prototype, $.renderAtlas);
        renderer.registerRenderer($.TextWrapper.prototype, $.renderText);
        renderer.registerRenderer($.Rectangle.prototype, $.renderRectangle);
        renderer.registerRenderer($.Circle.prototype, $.renderCircle);
        renderer.registerRenderer($.DrawableLine.prototype, $.renderLine);
        return renderer;
    }

    function createImageRenderer(screen) {
        var renderer = new $.Renderer(screen);
        renderer.registerRenderer($.ImageWrapper.prototype, $.renderImage);
        renderer.registerRenderer($.TextWrapper.prototype, $.renderText);
        renderer.registerRenderer($.Rectangle.prototype, $.renderRectangle);
        renderer.registerRenderer($.Circle.prototype, $.renderCircle);
        renderer.registerRenderer($.DrawableLine.prototype, $.renderLine);
        return renderer;
    }

    function createLegacy(gfxCache, renderer) {

        var motions = new $.Motions(new $.BasicAnimations());
        var spriteAnimations = new $.SpriteAnimations();
        var animations = new $.BasicAnimations();
        var animationHelper = new $.BasicAnimationHelper(animations);
        var timer = new $.CallbackTimer();

        return new $.Stage(gfxCache, motions, new $.MotionTimer(motions, timer), new $.MotionHelper(motions),
            spriteAnimations, new $.SpriteTimer(spriteAnimations, timer), animations, animationHelper,
            new $.BasicAnimationTimer(animations, timer), new $.PropertyAnimations(animations, animationHelper),
            renderer, timer);
    }

    function createResponsiveLegacy(gfxCache, renderer, device, events) {
        var stage = new $.ResizableStage(createLegacy(gfxCache, renderer), gfxCache, new $.Repository(),
            $.Touchables.get, $.fetchDrawableIntoTouchable, device.width, device.height, new $.CallbackTimer());

        events.subscribe($.Event.RESIZE, stage.resize.bind(stage));

        return stage;
    }

    function createResponsive(gfxCache, renderer, device, events) {
        var repoKeys = [
            'position', 'width', 'height', 'size', 'lineWidth', 'lineHeight', 'lineLength', 'path', 'radius'
        ];
        var legacyStage = createLegacy(gfxCache, renderer);
        var stage = new $.NewStageAPI(legacyStage, gfxCache, new $.KeyRepository(repoKeys), device.width, device.height,
            new $.CallbackTimer());

        events.subscribe($.Event.RESIZE, stage.resize.bind(stage));

        return stage;
    }

    return {
        getResponsiveAtlasLegacyStage: function (screen, gfxCache, device, events) {
            return createResponsiveLegacy(gfxCache, createAtlasRenderer(screen), device, events);
        },
        getResponsiveAtlasStage: function (screen, gfxCache, device, events) {
            return createResponsive(gfxCache, createAtlasRenderer(screen), device, events);
        },
        getAtlasLegacyStage: function (screen, gfxCache) {
            return createLegacy(gfxCache, createAtlasRenderer(screen));
        },
        getResponsiveImageLegacyStage: function (screen, gfxCache, device, events) {
            return createResponsiveLegacy(gfxCache, createImageRenderer(screen), device, events);
        },
        getResponsiveImageStage: function (screen, gfxCache, device, events) {
            return createResponsive(gfxCache, createImageRenderer(screen), device, events);
        },
        getImageLegacyStage: function (screen, gfxCache) {
            return createLegacy(gfxCache, createImageRenderer(screen));
        }
    };
})({
    Renderer: Renderer,
    renderImage: renderImage,
    renderText: renderText,
    renderAtlas: renderAtlas,
    SubImage: SubImage,
    TextWrapper: TextWrapper,
    ImageWrapper: ImageWrapper,
    Stage: Stage,
    MotionHelper: MotionHelper,
    MotionTimer: MotionTimer,
    Motions: Motions,
    SpriteTimer: SpriteTimer,
    SpriteAnimations: SpriteAnimations,
    PropertyAnimations: PropertyAnimations,
    BasicAnimationHelper: AnimationHelper,
    BasicAnimationTimer: AnimationTimer,
    BasicAnimations: BasicAnimations,
    ResizableStage: ResizableStage,
    NewStageAPI: NewStageAPI,
    Repository: Repository,
    KeyRepository: KeyRepository,
    Touchables: Touchables,
    fetchDrawableIntoTouchable: fetchDrawableIntoTouchable,
    CallbackTimer: CallbackTimer,
    Rectangle: Rectangle,
    renderRectangle: renderRectangle,
    Circle: Circle,
    renderCircle: renderCircle,
    DrawableLine: DrawableLine,
    renderLine: renderLine,
    Event: Event
});