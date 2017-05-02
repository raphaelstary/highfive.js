G.runMyScenes = (function (Grid, GridViewHelper, Width, Height, Camera, range, Event, PlayerControls, Key,
    GamePadButton, Stats, Font, Vectors, Object) {
    'use strict';

    function runMyScenes(services) {
        services.events.subscribe(Event.TICK_START, Stats.start);
        services.events.subscribe(Event.TICK_END, Stats.end);

        services.sceneStorage.msTotal = 0;
        services.sceneStorage.msCount = 0;
        services.sceneStorage.fpsTotal = 0;
        services.sceneStorage.fpsCount = 0;

        var ms = services.stage.createText('0').setPosition(Width.get(1920, 1880), Height.get(1080, 1020))
            .setSize(Font._60).setZIndex(11).setColor('black');
        var fps = services.stage.createText('0').setPosition(Width.get(1920, 1880), Height.get(1080, 1040))
            .setSize(Font._60).setZIndex(11).setColor('black');

        services.events.subscribe(Event.TICK_DRAW, function () {
            ms.data.msg = Stats.getMs().toString() + ' ms';
            fps.data.msg = Stats.getFps().toString() + ' fps';

            services.sceneStorage.msTotal += Stats.getMs();
            services.sceneStorage.msCount++;
            services.sceneStorage.fpsTotal += Stats.getFps();
            services.sceneStorage.fpsCount++;
        });

        // create your scenes and add them to the scene manager

        var level = [];
        for (var rows = 0; rows < 30; rows++) {
            var row = [];
            for (var columns = 0; columns < 30; columns++) {
                row.push(range(0, 1));
            }
            level.push(row);
        }
        var levelWrapper = {front: level};

        var grid = new Grid(levelWrapper);

        var gridViewHelper = new GridViewHelper(services.stage, services.device, 16, 9);

        function maxX() {
            var maxCameraPosition = gridViewHelper.getPosition(grid.xTiles - 9, grid.yTiles - 5);
            return maxCameraPosition.x;
        }

        function maxY() {
            var maxCameraPosition = gridViewHelper.getPosition(grid.xTiles - 9, grid.yTiles - 5);
            return maxCameraPosition.y;
        }
        var viewPort = services.stage.createRectangle(false)
            .setPosition(Width.HALF, Height.HALF)
            .setWidth(Width.FULL)
            .setHeight(Height.FULL)
            .setShow(false);

        var camera = new Camera(viewPort, maxX, maxY, services.device);

        var entities = [];

        level.forEach(function (row, v) {
            row.forEach(function (column, u) {
                var color = column ? 'grey' : 'green';
                entities.push({
                    drawable: gridViewHelper.createRect(u, v, color),
                    entity: gridViewHelper.createRect(u, v, color).setShow(false)
                });
            });
        });

        function updateCamera() {
            entities.forEach(function (entity) {
                camera.updateBinding(entity.entity, entity.drawable);
            });
        }

        services.events.subscribe(Event.TICK_CAMERA, updateCamera);

        function moveCursor() {
            gridViewHelper.move(cursor.entity, cursorPosition.u, cursorPosition.v, 10);
        }

        function moveCursorTo(x, y) {

            // todo use camera to calc real position
            // camera.updateBinding

            var coord = gridViewHelper.getCoordinates(x, y);
            cursorPosition.u = coord.u;
            cursorPosition.v = coord.v;
            var position = gridViewHelper.getPosition(coord.u, coord.v);
            cursor.entity.x = position.x;
            cursor.entity.y = position.y;
        }

        function left() {
            cursorPosition.u -= 1;
            moveCursor();
        }

        function right() {
            cursorPosition.u += 1;
            moveCursor();
        }

        function up() {
            cursorPosition.v -= 1;
            moveCursor();
        }

        function down() {
            cursorPosition.v += 1;
            moveCursor();
        }

        var zoom = 1;

        function zoomIn(factor) {
            camera.zoom(zoom += factor || 0.1);
        }

        function zoomOut(factor) {
            camera.zoom(zoom -= factor || 0.1);
        }

        var keyBoard = PlayerControls.getKeyBoard();
        keyBoard.add(Key.LEFT).onDown(left);
        keyBoard.add(Key.RIGHT).onDown(right);
        keyBoard.add(Key.UP).onDown(up);
        keyBoard.add(Key.DOWN).onDown(down);
        keyBoard.add(Key.CTRL).and(Key.EQUALS).onDown(zoomIn);
        keyBoard.add(Key.CTRL).and(Key.MINUS).onDown(zoomOut);
        keyBoard.register(services.events);

        var gamePad = PlayerControls.getGamePad();
        gamePad.add(GamePadButton.D_PAD_LEFT).onDown(left);
        gamePad.add(GamePadButton.D_PAD_RIGHT).onDown(right);
        gamePad.add(GamePadButton.D_PAD_UP).onDown(up);
        gamePad.add(GamePadButton.D_PAD_DOWN).onDown(down);
        gamePad.add(GamePadButton.LEFT_BUMPER).onDown(zoomIn);
        gamePad.add(GamePadButton.RIGHT_BUMPER).onDown(zoomOut);
        gamePad.addLeftStick(0.4).onDirectionLeft(left).onDirectionUp(up).onDirectionRight(right).onDirectionDown(down);
        gamePad.register(services.events);

        var startX;
        var startY;
        var pointerPressed = false;

        function initMove(pointer) {
            if (pointerPressed) {
                return;
            }
            pointerPressed = true;

            startX = pointer.x;
            startY = pointer.y;
        }

        function move(pointer) {
            if (!pointerPressed) {
                return;
            }
            var deltaX = pointer.x - startX;
            var deltaY = pointer.y - startY;

            camera.move({
                x: viewPort.x - deltaX / zoom,
                y: viewPort.y - deltaY / zoom
            });

            startX = pointer.x;
            startY = pointer.y;
        }

        function endMove() {
            if (!pointerPressed) {
                return;
            }
            pointerPressed = false;
        }

        var Gesture = {
            PAN: 'pan',
            ZOOM: 'zoom'
        };

        var currentAction;
        var pointers = {};
        var MAGIC_NR = 25;
        var p1;
        var z1;
        var z2;
        var lastM;

        services.events.subscribe(Event.POINTER, function (pointer) {
            if (currentAction == Gesture.PAN && pointer.id != p1.id) {
                return;
            }
            if (currentAction == Gesture.ZOOM && pointer.id != z1.id && pointer.id != z2.id) {
                return;
            }

            if (pointer.type == 'down') {
                if (currentAction) {
                    return;
                }

                pointers[pointer.id] = {
                    id: pointer.id,
                    x: pointer.x,
                    y: pointer.y
                };

                // test if it's a Gesture.ZOOM
                if (Object.keys(pointers).length > 1) {
                    currentAction = Gesture.ZOOM;
                    var keys = Object.keys(pointers);

                    z1 = pointers[keys.pop()];
                    z2 = pointers[z1.id == pointer.id ? keys.pop() : pointer.id];

                    var __p = Vectors.get(z1.x, z1.y, z2.x, z2.y);
                    lastM = Vectors.squaredMagnitude(__p.x, __p.y);
                }

            } else if (pointer.type == 'move') {

                if (currentAction == Gesture.PAN) {
                    move(pointer);

                } else if (currentAction == Gesture.ZOOM) {

                    pointers[pointer.id].x = pointer.x;
                    pointers[pointer.id].y = pointer.y;

                    var _p = Vectors.get(z1.x, z1.y, z2.x, z2.y);
                    var currentM = Vectors.squaredMagnitude(_p.x, _p.y);
                    if (currentM > lastM) {
                        zoomIn(0.01);
                    } else if (currentM < lastM) {
                        zoomOut(0.01);
                    }

                    lastM = currentM;

                } else {

                    var start = pointers[pointer.id];
                    var p = Vectors.get(start.x, start.y, pointer.x, pointer.y);
                    // test if it's a Gesture.PAN
                    if (MAGIC_NR * MAGIC_NR < Vectors.squaredMagnitude(p.x, p.y)) {
                        currentAction = Gesture.PAN;
                        p1 = start;
                        initMove(start);
                        move(pointer);
                    }
                }
            } else if (pointer.type == 'up') {
                if (currentAction == Gesture.PAN) {
                    endMove();
                    p1 = undefined;
                    currentAction = undefined;

                } else if (currentAction == Gesture.ZOOM) {
                    z1 = undefined;
                    z2 = undefined;
                    lastM = undefined;
                    currentAction = undefined;

                } else {
                    var s = pointers[pointer.id];
                    var ___p = Vectors.get(s.x, s.y, pointer.x, pointer.y);
                    // test if it's a TAP
                    if (MAGIC_NR * MAGIC_NR > Vectors.squaredMagnitude(___p.x, ___p.y)) {
                        moveCursorTo(pointer.x, pointer.y);
                    }
                }
                delete pointers[pointer.id];
            }
        });

        services.events.subscribe(Event.WHEEL, function (wheel) {
            if (wheel.deltaY > 0) {
                zoomOut();
            } else {
                zoomIn();
            }
        });

        var cursorPosition = gridViewHelper.getCoordinates(viewPort.x, viewPort.y);
        var cursor = {
            drawable: gridViewHelper.createRect(cursorPosition.u, cursorPosition.v, 'blue'),
            entity: gridViewHelper.createRect(cursorPosition.u, cursorPosition.v, 'blue').setShow(false)
        };
        cursor.drawable.setFilled(false).setZIndex(6);
        entities.push(cursor);

        camera.move(cursor.entity);
    }

    return runMyScenes;
})(H5.Grid, H5.GridViewHelper, H5.Width, H5.Height, H5.Camera, H5.range, H5.Event, H5.PlayerControls, H5.Key,
    H5.GamePadButton, H5.Stats, H5.Font, H5.Vectors, Object);