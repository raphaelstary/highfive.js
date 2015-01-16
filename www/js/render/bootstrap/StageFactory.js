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

    function create(gfxCache, renderer) {

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

    function createResponsive(gfxCache, renderer, device, events) {
        var stage = new $.ResizableStage(create(gfxCache, renderer), gfxCache, new $.Repository(), $.Touchables.get,
            $.fetchDrawableIntoTouchable, device.width, device.height, new $.CallbackTimer());

        events.subscribe($.Event.RESIZE, stage.resize.bind(stage));

        return stage;
    }

    return {
        getResponsiveAtlasStage: function (screen, gfxCache, device, events) {
            return createResponsive(gfxCache, createAtlasRenderer(screen), device, events);
        },
        getAtlasStage: function (screen, gfxCache) {
            return create(gfxCache, createAtlasRenderer(screen));
        },
        getResponsiveImageStage: function (screen, gfxCache, device, events) {
            return createResponsive(gfxCache, createImageRenderer(screen), device, events);
        },
        getImageStage: function (screen, gfxCache) {
            return create(gfxCache, createImageRenderer(screen));
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
    Repository: Repository,
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