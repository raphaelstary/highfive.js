var MVVMScene = (function (iterateEntries, Width, Height) {
    "use strict";

    function MVVMScene(model, view, viewModel) {
        this.services = model;

        this.stage = model.stage;
        this.sceneStorage = model.sceneStorage;
        this.buttons = model.buttons;
        this.messages = model.messages;
        this.timer = model.timer;
        this.device = model.device;
        this.loop = model.loop;
        this.events = model.events;
        this.tap = model.tap;
        this.sounds = model.sounds;

        this.view = view;
        this.viewModel = viewModel;

        this.dict = {};
    }

    MVVMScene.prototype.show = function (next) {
        var drawables = [];
        var buttons = [];
        var taps = [];

        var sceneRect;

        function xFn(x) {
            return Width.get(sceneRect.width, x);
        }

        function yFn(y) {
            return Height.get(sceneRect.height, y);
        }

        iterateEntries(this.view, function (layer, layerKey) {
            if (layerKey == 'screen') {
                sceneRect = layer;
                return;
            }

            var zIndex = layerKey[layerKey.length - 1];
            layer.forEach(function (elem) {

                var x = xFn(elem.x);
                var y = yFn(elem.y);

                if (elem.tags && elem.tags.some(function (tag) {
                        return tag.position == 'relativeToSize';
                    }) && elem.tags.some(function (tag) {
                        return tag.anchor == 'widthHalf';
                    })) {
                    // very specific use case

                    x = function (width, height) {
                        return Math.floor(width / 2 +
                            ((elem.x - sceneRect.width / 2) / elem.height) * yFn(elem.height)(height));
                    };

                }

                var drawable;
                if (elem.type == 'image') {
                    var imgName = elem.filename.substring(0, elem.filename.lastIndexOf('.'));
                    drawable = this.stage.drawFresh(x, y, imgName, zIndex, undefined, elem.alpha, elem.rotation,
                        elem.scale);
                    drawables.push(drawable);
                    if (elem.viewId) {
                        this.dict[elem.viewId] = drawable;
                    }

                } else if (elem.type == 'text') {
                    drawable = this.stage.drawText(x, y, elem.msg, yFn(elem.size), elem.font, elem.color, zIndex,
                        undefined, elem.rotation, elem.alpha, undefined, undefined, elem.scale);
                    drawables.push(drawable);
                    if (elem.viewId) {
                        this.dict[elem.viewId] = drawable;
                    }

                } else if (elem.type == 'rectangle') {
                    drawable = this.stage.drawRectangle(x, y, xFn(elem.width), yFn(elem.height), elem.color,
                        elem.filled, undefined, zIndex, elem.alpha, elem.rotation, elem.scale, undefined);
                    drawables.push(drawable);
                    if (elem.viewId) {
                        this.dict[elem.viewId] = drawable;
                    }

                } else if (elem.type == 'button') {
                    x = xFn(elem.text.x);
                    y = yFn(elem.text.y);

                    drawable = this.buttons.createPrimaryButton(x, y, elem.text.msg, undefined, zIndex, undefined,
                        xFn(elem.background.width), yFn(elem.background.height));
                    // todo: rethink this shit with buttons

                    buttons.push(drawable);
                    if (elem.viewId) {
                        this.dict[elem.viewId] = drawable;
                    }
                }

            }, this);
        }, this);
    };

    return MVVMScene;
})(iterateEntries, Width, Height);