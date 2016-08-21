H5.StageFactory = (function ($) {
    "use strict";

    function createAtlasRenderer(screen) {
        var renderer = new $.Renderer(screen);
        renderer.registerRenderer($.SubImage.prototype, $.renderAtlas);
        renderer.registerRenderer($.TextWrapper.prototype, $.renderText);
        renderer.registerRenderer($.Rectangle.prototype, $.renderRectangle);
        renderer.registerRenderer($.Circle.prototype, $.renderCircle);
        renderer.registerRenderer($.DrawableLine.prototype, $.renderLine);
        renderer.registerRenderer($.Quadrilateral.prototype, $.renderQuadrilateral);
        renderer.registerRenderer($.ABLine.prototype, $.renderABLine);
        return renderer;
    }

    function createImageRenderer(screen) {
        var renderer = new $.Renderer(screen);
        renderer.registerRenderer($.ImageWrapper.prototype, $.renderImage);
        renderer.registerRenderer($.TextWrapper.prototype, $.renderText);
        renderer.registerRenderer($.Rectangle.prototype, $.renderRectangle);
        renderer.registerRenderer($.Circle.prototype, $.renderCircle);
        renderer.registerRenderer($.DrawableLine.prototype, $.renderLine);
        renderer.registerRenderer($.Quadrilateral.prototype, $.renderQuadrilateral);
        renderer.registerRenderer($.ABLine.prototype, $.renderABLine);
        return renderer;
    }

    function createLegacy(gfxCache, renderer) {

        var motions = new $.Motions(new $.BasicAnimations());
        var spriteAnimations = new $.SpriteAnimations();
        var animations = new $.BasicAnimations(); // todo check if it's possible to use same object for motions
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
        var stage = new $.NewStageAPI(legacyStage, gfxCache, new $.KeyRepository(repoKeys), device.width, device.height,
            new $.CallbackTimer());

        if (!device.isLowRez)
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
    Renderer: H5.Renderer,
    renderImage: H5.renderImage,
    renderText: H5.renderText,
    renderAtlas: H5.renderAtlas,
    SubImage: H5.SubImage,
    TextWrapper: H5.TextWrapper,
    ImageWrapper: H5.ImageWrapper,
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
    ResizableStage: H5.ResizableStage,
    NewStageAPI: H5.NewStageAPI,
    Repository: H5.Repository,
    KeyRepository: H5.KeyRepository,
    Touchables: H5.Touchables,
    fetchDrawableIntoTouchable: H5.fetchDrawableIntoTouchable,
    CallbackTimer: H5.CallbackTimer,
    Rectangle: H5.Rectangle,
    renderRectangle: H5.renderRectangle,
    Circle: H5.Circle,
    renderCircle: H5.renderCircle,
    DrawableLine: H5.DrawableLine,
    renderLine: H5.renderLine,
    Event: H5.Event,
    renderQuadrilateral: H5.renderQuadrilateral,
    Quadrilateral: H5.Quadrilateral,
    renderABLine: H5.renderABLine,
    ABLine: H5.ABLine
});