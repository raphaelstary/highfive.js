G.DecisionAI = (function (isNaN, range) {
    "use strict";

    function random() {
        return range(0, 100);
    }

    function selectCommand(commands, random) {
        return commands.reduce(function (previous, current) {
            if (isNaN(previous))
                return previous;

            if (random >= previous && random <= current.probability + previous)
                return current;
            return current.probability + previous;
        }, 0);
    }

    return {
        getRandom: random,
        selectCommand: selectCommand
    };
})(isNaN, H5.range);