(function (describe, beforeEach, it, expect, DecisionAI) {
    "use strict";

    describe("DecisionAI", function () {
        var commands;

        beforeEach(function () {
            commands = [
                {
                    "dialog": "1st",
                    "damage": 20,
                    "probability": 30
                }, {
                    "dialog": "2nd",
                    "damage": 30,
                    "probability": 70
                }
            ];
        });

        it("should select the 1st command", function () {
            var command = DecisionAI.selectCommand(commands, 0);
            expect(command).toBeDefined();
            expect(command.dialog).toBe('1st');
            expect(command.damage).toBe(20);
            expect(command.probability).toBe(30);
        });

        it("should select the 1st command", function () {
            var command = DecisionAI.selectCommand(commands, 1);
            expect(command).toBeDefined();
            expect(command.dialog).toBe('1st');
            expect(command.damage).toBe(20);
            expect(command.probability).toBe(30);
        });

        it("should select the 1st command", function () {
            var command = DecisionAI.selectCommand(commands, 30);
            expect(command).toBeDefined();
            expect(command.dialog).toBe('1st');
            expect(command.damage).toBe(20);
            expect(command.probability).toBe(30);
        });

        it("should select the 2st command", function () {
            var command = DecisionAI.selectCommand(commands, 31);
            expect(command).toBeDefined();
            expect(command.dialog).toBe('2nd');
            expect(command.damage).toBe(30);
            expect(command.probability).toBe(70);
        });

        it("should select the 2st command", function () {
            var command = DecisionAI.selectCommand(commands, 99);
            expect(command).toBeDefined();
            expect(command.dialog).toBe('2nd');
            expect(command.damage).toBe(30);
            expect(command.probability).toBe(70);
        });

        it("should select the 2st command", function () {
            var command = DecisionAI.selectCommand(commands, 100);
            expect(command).toBeDefined();
            expect(command.dialog).toBe('2nd');
            expect(command.damage).toBe(30);
            expect(command.probability).toBe(70);
        });
    });
})(window.describe, window.beforeEach, window.it, window.expect, G.DecisionAI);