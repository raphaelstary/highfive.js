var MVVMScene = (function (iterateEntries) {
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
                var drawable;
                if (elem.type == 'image') {
                    var imgName = elem.filename.substring(0, elem.filename.lastIndexOf('.'));
                    drawable = this.stage.drawFresh(xFn(elem.x), yFn(elem.y), imgName, zIndex, undefined, elem.alpha,
                        elem.rotation, elem.scale);
                    drawables.push(drawable);
                    if (elem.viewId) {
                        this.dict[elem.viewId] = drawable;
                    }

                } else if (elem.type == 'text') {
                    drawable = this.stage.drawText(xFn(elem.x), yFn(elem.y), elem.msg, yFn(elem.size), elem.font,
                        elem.color, zIndex, undefined, elem.rotation, elem.alpha, undefined, undefined, elem.scale);
                    drawables.push(drawable);
                    if (elem.viewId) {
                        this.dict[elem.viewId] = drawable;
                    }

                } else if (elem.type == 'rectangle') {
                    drawable = this.stage.drawRectangle(xFn(elem.x), yFn(elem.y), xFn(elem.width), yFn(elem.height),
                        elem.color, elem.filled, undefined, zIndex, elem.alpha, elem.rotation, elem.scale, undefined);
                    drawables.push(drawable);
                    if (elem.viewId) {
                        this.dict[elem.viewId] = drawable;
                    }

                } else if (elem.type == 'button') {
                    drawable = this.buttons.createPrimaryButton(xFn(elem.text.x), yFn(elem.text.y), elem.text.msg,
                        undefined, zIndex, undefined, xFn(elem.background.width), yFn(elem.background.height));
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
})(iterateEntries);