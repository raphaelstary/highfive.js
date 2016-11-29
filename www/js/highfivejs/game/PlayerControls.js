H5.PlayerControls = (function (Event, Array, Math, Vectors) {
    "use strict";

    var Action = {
        LEFT: 'left',
        NOTHING: 'nothing',
        RIGHT: 'right',
        UP: 'up',
        DOWN: 'down'
    };

    function getAxisAction(xAxisValue, yAxisValue, deadZone) {
        var yAxis = yAxisValue;
        if (yAxis > -deadZone && yAxis < deadZone) yAxis = 0;

        var xAxis = xAxisValue;
        if (xAxis > -deadZone && xAxis < deadZone) xAxis = 0;

        if (xAxis != 0 && yAxis != 0) {
            var angle = Vectors.getAngle(xAxis, yAxis);

            if (angle < 0) {
                if (angle < -Math.PI * 3 / 4) {
                    return Action.LEFT;
                } else if (angle < -Math.PI / 4) {
                    return Action.UP;
                }
                return Action.RIGHT;
            }
            if (angle > Math.PI * 3 / 4) {
                return Action.LEFT;
            } else if (angle > Math.PI / 4) {
                return Action.DOWN;
            }
            return Action.RIGHT;

        } else if (yAxis != 0) {
            if (yAxis > 0)
                return Action.DOWN;
            return Action.UP;
        } else if (xAxis != 0) {
            if (xAxis > 0)
                return Action.RIGHT;
            return Action.LEFT;
        }
        return Action.NOTHING;
    }

    function getStickFunction(store) {
        function getRegisterCallbackFunction(name) {
            return function (callback, self) {
                if (self) {
                    store[name] = callback.bind(self);
                } else {
                    store[name] = callback;
                }
                return this;
            };
        }

        return function (deadZone) {
            store.deadZone = deadZone || 0.1;
            store.lastAction = Action.NOTHING;
            return {
                onStickUp: getRegisterCallbackFunction('up'),
                onStickRight: getRegisterCallbackFunction('right'),
                onStickDown: getRegisterCallbackFunction('down'),
                onStickLeft: getRegisterCallbackFunction('left'),
                onStickNeutral: getRegisterCallbackFunction('neutral')
            };
        };
    }

    function updateStick(store, xAxis, yAxis) {
        var action = getAxisAction(xAxis, yAxis, store.deadZone);
        if (action != store.lastAction) {
            store.lastAction = action;
            if (action == Action.LEFT) {
                if (store.left) store.left();
            } else if (action == Action.UP) {
                if (store.up) store.up();
            } else if (action == Action.RIGHT) {
                if (store.right) store.right();
            } else if (action == Action.DOWN) {
                if (store.down) store.down();
            } else {
                if (store.neutral) store.neutral();
            }
        }
    }

    function createGamePadControls() {
        var directionsLeft = {};
        var directionsRight = {};
        var unsubscribe;

        var gamePad = createControls(Event.GAME_PAD);

        gamePad.addLeftStick = getStickFunction(directionsLeft);
        gamePad.addRightStick = getStickFunction(directionsRight);

        gamePad.basicRegister = gamePad.register;
        gamePad.basicCancel = gamePad.cancel;
        gamePad.register = function (events) {
            this.basicRegister(events);

            var axisListener = events.subscribe(Event.GAME_PAD, function (gamePad) {
                updateStick(directionsLeft, gamePad.getLeftStickXAxis(), gamePad.getLeftStickYAxis());
                updateStick(directionsRight, gamePad.getRightStickXAxis(), gamePad.getRightStickYAxis());
            });

            unsubscribe = function () {
                events.unsubscribe(axisListener);
                unsubscribe = undefined;
            };

            return this;
        };
        gamePad.cancel = function () {
            this.basicCancel();
            if (unsubscribe) unsubscribe();
            return this;
        };
        return gamePad;
    }

    function createKeyBoardControls() {
        return createControls(Event.KEY_BOARD);
    }

    function createControls(event) {

        var unsubscribe;
        var commands = [];

        return {
            add: function (keyCode) {

                var command = {
                    code: keyCode,
                    isPressed: false
                };

                commands.push(command);

                return {
                    or: function (keyCode) {
                        if (command.or === undefined) {
                            command.or = keyCode;
                        } else if (command.or instanceof Array) {
                            command.or.push(keyCode);
                        } else {
                            command.or = [command.or, keyCode];
                        }

                        return this;
                    },
                    onDown: function (callback, self) {
                        if (self) {
                            command.onDown = callback.bind(self);
                        } else {
                            command.onDown = callback;
                        }

                        return this;
                    },
                    onUp: function (callback, self) {
                        if (self) {
                            command.onUp = callback.bind(self);
                        } else {
                            command.onUp = callback;
                        }

                        return this;
                    },
                    remove: function () {
                        commands.splice(commands.indexOf(command), 1);

                        return this;
                    }
                }
            },

            register: function (events) {
                var setupEventId = events.subscribe(event, function (inputType) {
                    commands.forEach(function (command) {
                        if (command.or && command.or instanceof Array) {
                            command.isPressed = inputType.isPressed(command.code) || command.or.some(function (code) {
                                    return inputType.isPressed(code);
                                });
                        } else if (command.or) {
                            command.isPressed = inputType.isPressed(command.code) || inputType.isPressed(command.or);
                        } else {
                            command.isPressed = inputType.isPressed(command.code);
                        }
                    });

                    events.unsubscribe(setupEventId);
                });

                var eventId = events.subscribe(event, function (inputType) {
                    commands.forEach(function (command) {
                        var isPressed;
                        if (command.or && command.or instanceof Array) {
                            isPressed = inputType.isPressed(command.code) || command.or.some(function (code) {
                                    return inputType.isPressed(code);
                                });
                        } else if (command.or) {
                            isPressed = inputType.isPressed(command.code) || inputType.isPressed(command.or);
                        } else {
                            isPressed = inputType.isPressed(command.code);
                        }

                        if (isPressed && !command.isPressed) {
                            command.isPressed = true;
                            if (command.onDown) command.onDown();

                        } else if (!isPressed && command.isPressed) {
                            command.isPressed = false;
                            if (command.onUp) command.onUp();
                        }
                    });
                });

                unsubscribe = function () {
                    events.unsubscribe(eventId);
                    unsubscribe = undefined;
                };

                return this;
            },

            cancel: function () {
                if (unsubscribe) unsubscribe();

                return this;
            }
        }
    }

    return {
        getGamePad: createGamePadControls,
        getKeyBoard: createKeyBoardControls
    }
})(H5.Event, Array, Math, H5.Vectors);