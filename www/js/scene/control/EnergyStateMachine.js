var EnergyStateMachine = (function () {
    "use strict";

    function EnergyStateMachine(stage, world, shieldsDrawable, shieldsUpSprite, shieldsDownSprite, energyBarDrawable, sounds) {
        this.stage = stage;
        this.world = world;
        this.shieldsDrawable = shieldsDrawable;
        this.shieldsUpSprite = shieldsUpSprite;
        this.shieldsDownSprite = shieldsDownSprite;
        this.energyBarDrawable = energyBarDrawable;
        this.sounds = sounds;

        this.energyDrainSprite = stage.getSprite('energy_drain/energy_drain', 45, false);
        this.energyLoadSprite = stage.getSprite('energy_load/energy_load', 45, false);
    }

    EnergyStateMachine.prototype.drainEnergy = function () {
        var self = this;
        function turnShieldsOn() {
            self.sounds.play('shields-up');
            self.world.shieldsOn = true;
            self.stage.animate(self.shieldsDrawable, self.shieldsUpSprite, function () {
                self.shieldsDrawable.img = self.stage.getSubImage("shield3");
            });
        }

        function startDraining() {
            var position = 0;
            if (self.stage.animations.has(self.energyBarDrawable)) {
                position = 89 - self.stage.animations.animationStudio.animationsDict[self.energyBarDrawable.id].time;
            }

            self.stage.animate(self.energyBarDrawable, self.energyDrainSprite, self.energyEmpty.bind(self));

            self.stage.animations.animationStudio.animationsDict[self.energyBarDrawable.id].time = position;
            self.energyBarDrawable.img =
                self.stage.animations.animationStudio.animationsDict[self.energyBarDrawable.id].sprite.frames[position];
        }

        turnShieldsOn();
        startDraining();
    };

    EnergyStateMachine.prototype.energyEmpty = function () {
        var self = this;
        function setEnergyBarEmpty() {
            self.energyBarDrawable.img = self.stage.getSubImage('energy_bar_empty');
        }

        this.turnShieldsOff();
        setEnergyBarEmpty();
    };

    EnergyStateMachine.prototype.turnShieldsOff = function () {
        var self = this;
//        self.sounds.play('shields-down');
        this.world.shieldsOn = false;
        self.stage.animate(self.shieldsDrawable, self.shieldsDownSprite, function () {
            self.stage.remove(self.shieldsDrawable);
        });
    };

    EnergyStateMachine.prototype.loadEnergy = function () {
        var self = this;
        function startLoading() {
            var position = 0;
            if (self.stage.animations.has(self.energyBarDrawable)) {
                position = 89 - self.stage.animations.animationStudio.animationsDict[self.energyBarDrawable.id].time;
            }
            self.stage.animate(self.energyBarDrawable, self.energyLoadSprite, self.energyFull.bind(self));

            self.stage.animations.animationStudio.animationsDict[self.energyBarDrawable.id].time = position;
            self.energyBarDrawable.img =
                self.stage.animations.animationStudio.animationsDict[self.energyBarDrawable.id].sprite.frames[position];
        }

        if (this.world.shieldsOn) {
            this.turnShieldsOff();
        }
        startLoading();
    };

    EnergyStateMachine.prototype.energyFull = function () {
        var self = this;
        function setEnergyBarFull() {
            self.energyBarDrawable.img = self.stage.getSubImage('energy_bar_full');
        }

        setEnergyBarFull();
    };

    return EnergyStateMachine;
})();