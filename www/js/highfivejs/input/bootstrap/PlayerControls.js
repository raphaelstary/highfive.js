H5.PlayerControls = (function (Event, Array) {
    "use strict";

    function createGamePadControls() {
        return createControls(Event.GAME_PAD);
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
                    },
                    onDown: function (callback, self) {
                        if (self) {
                            command.onDown = callback.bind(self);
                        } else {
                            command.onDown = callback;
                        }
                    },
                    onUp: function (callback, self) {
                        if (self) {
                            command.onUp = callback.bind(self);
                        } else {
                            command.onUp = callback;
                        }
                    },
                    remove: function () {
                        commands.splice(commands.indexOf(command), 1);
                    }
                }
            },

            register: function (events) {
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
            },

            cancel: function () {
                if (unsubscribe) unsubscribe();
            }
        }
    }

    return {
        getGamePad: createGamePadControls,
        getKeyBoard: createKeyBoardControls
    }
})(H5.Event, Array);