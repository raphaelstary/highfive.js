H5.PlayerControls = (function (Event, Array, Math, Vectors, Direction) {
    'use strict';

    var Action = {
        LEFT: 'left',
        NOTHING: 'nothing',
        RIGHT: 'right',
        UP: 'up',
        DOWN: 'down'
    };

    function getAxisAction(xAxisValue, yAxisValue, deadZone) {
        var yAxis = yAxisValue;
        if (yAxis > -deadZone && yAxis < deadZone) {
            yAxis = 0;
        }

        var xAxis = xAxisValue;
        if (xAxis > -deadZone && xAxis < deadZone) {
            xAxis = 0;
        }

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
            if (yAxis > 0) {
                return Action.DOWN;
            }
            return Action.UP;
        } else if (xAxis != 0) {
            if (xAxis > 0) {
                return Action.RIGHT;
            }
            return Action.LEFT;
        }
        return Action.NOTHING;
    }

    function getStickFunction(store) {
        return function (deadZone) {
            store.deadZone = deadZone || 0.1;
            store.lastAction = Action.NOTHING;
            return {
                onDirectionUp: getRegisterCallbackFunction(store, 'up'),
                onDirectionRight: getRegisterCallbackFunction(store, 'right'),
                onDirectionDown: getRegisterCallbackFunction(store, 'down'),
                onDirectionLeft: getRegisterCallbackFunction(store, 'left'),
                onDirectionNeutral: getRegisterCallbackFunction(store, 'neutral')
            };
        };
    }

    function getRegisterCallbackFunction(store, name) {
        return function (callback, self) {
            if (self) {
                store[name] = callback.bind(self);
            } else {
                store[name] = callback;
            }
            return this;
        };
    }

    function updateStick(store, xAxis, yAxis) {
        var action = getAxisAction(xAxis, yAxis, store.deadZone);
        if (action != store.lastAction) {
            store.lastAction = action;
            if (action == Action.LEFT) {
                if (store.left) {
                    store.left();
                }
            } else if (action == Action.UP) {
                if (store.up) {
                    store.up();
                }
            } else if (action == Action.RIGHT) {
                if (store.right) {
                    store.right();
                }
            } else if (action == Action.DOWN) {
                if (store.down) {
                    store.down();
                }
            } else {
                if (store.neutral) {
                    store.neutral();
                }
            }
        }
    }

    function createGamePadControls() {
        var directionsLeft = {};
        var directionsRight = {};
        var conditions = [];
        var negativeConditions = [];
        var unsubscribe;

        var gamePad = createControls(Event.GAME_PAD);

        gamePad.addLeftStick = getStickFunction(directionsLeft);
        gamePad.addRightStick = getStickFunction(directionsRight);

        gamePad.basicRegister = gamePad.register;
        gamePad.basicCancel = gamePad.cancel;
        gamePad.register = function (events) {
            this.basicRegister(events);

            var axisListener = events.subscribe(Event.GAME_PAD, function (gamePad) {
                if (shouldIgnore(conditions, negativeConditions, gamePad)) {
                    return;
                }
                updateStick(directionsLeft, gamePad.getLeftStickXAxis(), gamePad.getLeftStickYAxis());
                updateStick(directionsRight, gamePad.getRightStickXAxis(), gamePad.getRightStickYAxis());
            });

            unsubscribe = function () {
                events.unsubscribe(axisListener);
                unsubscribe = undefined;
            };

            return this;
        };
        gamePad.__setCondition = function (condition) {
            conditions.push(condition);
        };
        gamePad.__setNegativeCondition = function (negativeCondition) {
            negativeConditions.push(negativeCondition);
        };
        gamePad.cancel = function () {
            this.basicCancel();
            if (unsubscribe) {
                unsubscribe();
            }
            return this;
        };
        return gamePad;
    }

    function createTvOSRemoteControls() {
        var gestures = {};
        var conditions = [];
        var negativeConditions = [];
        var unsubscribe;

        var gamePad = createControls(Event.GAME_PAD);

        gamePad.onDirectionUp = getRegisterCallbackFunction(gestures, 'up');
        gamePad.onDirectionRight = getRegisterCallbackFunction(gestures, 'right');
        gamePad.onDirectionDown = getRegisterCallbackFunction(gestures, 'down');
        gamePad.onDirectionLeft = getRegisterCallbackFunction(gestures, 'left');

        gamePad.basicRegister = gamePad.register;
        gamePad.basicCancel = gamePad.cancel;

        var started;
        var notCaptured;
        gamePad.captureGesture = function () {
            if (started) {
                notCaptured = false;
            }
        };

        gamePad.register = function (events) {
            this.basicRegister(events);

            var neutral = true;
            notCaptured = true;
            started = false;
            var start = {
                x: 0,
                y: 0
            };
            var end = {
                x: 0,
                y: 0
            };
            var axisListener = events.subscribe(Event.GAME_PAD, function (gamePad) {
                if (shouldIgnore(conditions, negativeConditions, gamePad)) {
                    return;
                }

                neutral = !(gamePad.isDPadDownPressed() || gamePad.isDPadLeftPressed() || gamePad.isDPadUpPressed() ||
                gamePad.isDPadRightPressed());

                if (!neutral && !started) {
                    // start gesture
                    started = true;
                    start.x = gamePad.getLeftStickXAxis();
                    start.y = gamePad.getLeftStickYAxis();

                } else if (!neutral && started) {
                    // continue gesture
                    end.x = gamePad.getLeftStickXAxis();
                    end.y = gamePad.getLeftStickYAxis();

                } else if (neutral && started) {
                    // end gesture

                    if (notCaptured) {

                        var swipe = interpretSwipe(start, end);
                        if (swipe == Direction.DOWN) {
                            if (gestures.down) {
                                gestures.down();
                            }
                        } else if (swipe == Direction.LEFT) {
                            if (gestures.left) {
                                gestures.left();
                            }
                        } else if (swipe == Direction.UP) {
                            if (gestures.up) {
                                gestures.up();
                            }
                        } else if (swipe == Direction.RIGHT) {
                            if (gestures.right) {
                                gestures.right();
                            }
                        }

                    }

                    // clean up
                    notCaptured = true;
                    started = false;
                    start.x = 0;
                    start.y = 0;
                    end.x = 0;
                    end.y = 0;
                }
            });

            unsubscribe = function () {
                events.unsubscribe(axisListener);
                unsubscribe = undefined;
            };

            return this;
        };
        gamePad.__setCondition = function (condition) {
            conditions.push(condition);
        };
        gamePad.__setNegativeCondition = function (negativeCondition) {
            negativeConditions.push(negativeCondition);
        };
        gamePad.cancel = function () {
            this.basicCancel();
            if (unsubscribe) {
                unsubscribe();
            }
            return this;
        };

        gamePad.setCondition('profile', 'microGamepad');

        return gamePad;
    }

    function createKeyBoardControls() {
        return createControls(Event.KEY_BOARD);
    }

    function createControls(event) {

        var unsubscribe;
        var commands = [];
        var conditions = [];
        var negativeConditions = [];

        return {
            setCondition: function (key, value) {
                var condition = {
                    key: key,
                    value: value
                };
                if (this.__setCondition) {
                    this.__setCondition(condition);
                }
                conditions.push(condition);
            },
            setNegativeCondition: function (key, value) {
                var negCondition = {
                    key: key,
                    value: value
                };
                if (this.__setNegativeCondition) {
                    this.__setNegativeCondition(negCondition);
                }
                negativeConditions.push(negCondition);
            },
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
                    and: function (keyCode) {
                        if (command.and === undefined) {
                            command.and = keyCode;
                        } else if (command.and instanceof Array) {
                            command.and.push(keyCode);
                        } else {
                            command.and = [command.and, keyCode];
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
                };
            },

            register: function (events) {
                var eventId = events.subscribe(event, function (inputType) {
                    if (shouldIgnore(conditions, negativeConditions, inputType)) {
                        return;
                    }

                    commands.forEach(function (command) {
                        var isPressed;
                        if (command.or && command.or instanceof Array) {
                            isPressed = inputType.isPressed(command.code) || command.or.some(function (code) {
                                    return inputType.isPressed(code);
                                });
                        } else if (command.or) {
                            isPressed = inputType.isPressed(command.code) || inputType.isPressed(command.or);
                        } else if (command.and && command.and instanceof Array) {
                            isPressed = inputType.isPressed(command.code) && command.and.every(function (code) {
                                    return inputType.isPressed(code);
                                });
                        } else if (command.and) {
                            isPressed = inputType.isPressed(command.code) && inputType.isPressed(command.and);
                        } else {
                            isPressed = inputType.isPressed(command.code);
                        }

                        if (isPressed && !command.isPressed) {
                            command.isPressed = true;
                            if (command.onDown) {
                                command.onDown();
                            }

                        } else if (!isPressed && command.isPressed) {
                            command.isPressed = false;
                            if (command.onUp) {
                                command.onUp();
                            }
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
                if (unsubscribe) {
                    unsubscribe();
                    commands.forEach(function (command) {
                        command.isPressed = false;
                    });
                }

                return this;
            }
        };
    }

    function interpretSwipe(start, end) {
        var vector = Vectors.get(start.x, start.y, end.x, end.y);
        if (Vectors.squaredMagnitude(vector.x, vector.y) < 0.25 * 0.25) {
            // case B: tap
            return getDirection(end);

        }
        // case A: normal swipe
        return getDirection(vector);
    }

    function getDirection(vector) {
        var angle = Vectors.getAngle(vector.x, vector.y);

        if (angle < 0) {
            if (angle < -Math.PI * 3 / 4) {
                return Direction.LEFT;
            } else if (angle < -Math.PI / 4) {
                return Direction.UP;
            }
            return Direction.RIGHT;
        }
        if (angle > Math.PI * 3 / 4) {
            return Direction.LEFT;
        } else if (angle > Math.PI / 4) {
            return Direction.DOWN;
        }
        return Direction.RIGHT;
    }

    var MAGIC_NR = 25;

    /**
     * check a gesture if it's a swipe or a tap, and if it's a swipe get its direction
     *
     * @param start {pointer}
     * @param end {pointer}
     * @returns {Direction|boolean} swipe direction or false if it's no swipe and more like a tap
     */
    function interpretSwipeDirection(start, end) {
        var vector = Vectors.get(start.x, start.y, end.x, end.y);
        if (Vectors.squaredMagnitude(vector.x, vector.y) > MAGIC_NR * MAGIC_NR) {
            return getDirection(vector);
        }
        return false;
    }

    function shouldIgnore(conditions, negativeConditions, inputType) {
        var isNotMet = conditions.some(function (keyValuePair) {
            return inputType[keyValuePair.key] != keyValuePair.value;
        });
        if (isNotMet) {
            return true;
        }
        isNotMet = negativeConditions.some(function (keyValuePair) {
            return inputType[keyValuePair.key] == keyValuePair.value;
        });
        return isNotMet;
    }

    return {
        getGamePad: createGamePadControls,
        getTvOSRemote: createTvOSRemoteControls,
        getKeyBoard: createKeyBoardControls,
        getSwipeDirection: interpretSwipeDirection
    };
})(H5.Event, Array, Math, H5.Vectors, H5.Direction);