;

var visualisations = (function($, createjs, document, visualisations, undefined) {

    visualisations.background = visualisations.background || {};

    /**
     * Confetti bursts on music volume
     * 
     * @param {any} id 
     * @param {any} settings 
     * @returns 
     */
    visualisations.background.confetti = function(id, settings) {

        // Declare a scope for Visualizer
        var scope = {};

        scope.id = id;

        // Bind 'this'
        var _this = this;

        // Private variables for within the plugin only ( no user/ code interaction )
        _this.variables = {
            analyser: null,
            objects: [],
            delayTime: new Date().getTime()
        }

        // The default values ( which can be overriden by supplied settings )
        var _DEFAULTS = {
            enabled: true,

            spawnDelay: 500,
            burstSize: 10,

            animationSpeed: 10,
            minimumSound: 10,
            movementEase: "cubicOut",
            movementDirection: "UP",
            travelDistanceMultiplier: 2,
            useFade: true,

            size: 15,

            rainbowPhase: 5.9,
            rainbowCenter: 128,
            rainbowWidth: 256,
            color: null,

            offsetX: 0,
            offsetY: 0,

            rotate: false,
            rotationCCW: false,
            rotateDuration: 5000,

            enabledIdle: false,

            spawnCircleSize: 0,
            circleMode: true
        }

        scope.canvas = null;
        scope.parent = null;

        scope.gameObject = new createjs.Container();
        var confettiContainer = new createjs.Container();

        scope.settings = $.extend(_DEFAULTS, settings);

        var rainbow = [];

        _this.init = function() {

            if (!createjs) { console.error("This visual requires CreateJS to operate!"); }

            _this.bind();

            scope.generateRainbow();
        }

        scope.generateRainbow = function() {
            rainbow = generateRainbowColorArray(64);
        }

        var rotationObject = { value: 0 }
        scope.EnableRotation = function(enable, counter) {
            scope.settings.rotate = enable;
            scope.settings.rotationCCW = !!counter;

            console.log(`Set the background confetti 'rotation' to : ${enable}`);
            console.log(`Rotate counter clockwise : ${!!counter}`);

            var rotation = 360;
            if (counter) { rotation = -360; }

            if (enable) {
                createjs.Tween.get(rotationObject, { override: true, loop: true }).to({ value: rotationObject.value + rotation }, scope.settings.rotateDuration);
            } else {
                createjs.Tween.get(rotationObject, { override: true }).set({ value: 0 });
            }
        }

        scope.setRotationDuration = function(duration) {
            scope.settings.rotateDuration = duration;
            scope.EnableRotation(scope.settings.rotate, scope.settings.rotationCCW);
        }

        _this.bind = function() {

        }
        
        var max = 1000;
        var _bassMultiplier; 
        scope.update = function(analyzer) {

            if (!scope.settings.enabled) { return; }
            if (!scope.settings.enabledIdle && ARTHESIAN.Audio.Source.idleHandler.isIdle) { return; }

            if(scope.settings.enabledIdle) {
                _bassMultiplier = ARTHESIAN.Audio.Source.getBaseMultiplier(0, 6, true) - 1;
            } else {
                _bassMultiplier = ARTHESIAN.Audio.Source.getBaseMultiplier(0, 6) - 1;
            }

            let time = new Date().getTime();

            if (_this.variables.delayTime + scope.settings.spawnDelay < time) {

                _this.variables.delayTime = time;

                // If there is no or low sound, don't spawn items
                if (_bassMultiplier * 150 >= scope.settings.minimumSound) {
                    for (let x = 0; x < scope.settings.burstSize; x++) {
                        _this.spawn();
                    }
                }
            }

            // Hard limite amount of confetti on screen
            if (confettiContainer.children.length > max) {
                while (confettiContainer.children.length > max) {
                    confettiContainer.removeChildAt(0);
                }
            }

            _this.draw();
        }

        let _obj, _color, _travelDistance, _endScale, _animationSpeed, _movementSpeed, _circleSize, _circleDistance;
        _this.spawn = function() {

            _obj = new createjs.Shape();

            _color = scope.settings.color || rainbow[Math.floor(Math.random() * rainbow.length)];

            _obj.graphics.f(_color).drawCircle(0, 0, scope.settings.size);

            _obj.x = scope.canvas.width / 2;
            _obj.y = scope.canvas.height / 2;

            _obj.regY = scope.settings.size / 2;

            _travelDistance = window.innerHeight > window.innerHeight ? window.innerHeight / 2 : window.innerWidth / 2;
            _travelDistance += scope.settings.size * 2;

            _travelDistance *= scope.settings.travelDistanceMultiplier;

            if(scope.settings.circleMode) {
                _circleSize = scope.settings.spawnCircleSize
                _obj.rotation = Math.random() * 360;
                _obj.regX = _circleSize;
            } else {
                _obj.rotation = 90;
                _obj.y = scope.canvas.height * 0.5; // offset
                _obj.x = Math.random() * scope.canvas.width;
            }
            
            // Movement direction of the Confetti flakes
            if(scope.settings.movementDirection === "BOTH") {
                if(scope.settings.circleMode) {
                    _obj.targetX = !!Math.round(Math.random()) ? _circleSize - _travelDistance: _circleSize + _travelDistance;
                } else {
                    _obj.targetX = !!Math.round(Math.random()) ? -_travelDistance : _travelDistance;
                }
            } else if (scope.settings.movementDirection === "UP") {
                if(scope.settings.circleMode) {
                    _obj.targetX = _circleSize + _travelDistance;
                } else {
                    _obj.targetX = _travelDistance;
                }
            } else if (scope.settings.movementDirection === "DOWN") {
                if(scope.settings.circleMode) {
                    _obj.targetX = _circleSize - _travelDistance;
                } else {
                    _obj.targetX = -_travelDistance;
                }
            }


            //_obj.scaleX = _obj.scaleY = 0.5; // _obj.scaleY = (Math.random() * 0.02) + 0.01; // between 0.01 and 0.03
            //_endScale = (Math.random() * 0.5) + 0.5; // between 0.5 and 1
            
            _obj.speedMultiplier = _bassMultiplier * _bassMultiplier;

            _animationSpeed = 10000 / scope.settings.animationSpeed;
            _animationSpeed *= Math.random() * 2 + 0.5; // 0.5 - 2.5;

            _movementSpeed = _animationSpeed / (_obj.speedMultiplier || 1);

            if (_movementSpeed < _animationSpeed) { _animationSpeed = _movementSpeed; }

            //createjs.Tween.get(_obj).to({ scaleX : _endScale, scaleY: _endScale }, _animationSpeed, createjs.Ease[scope.settings.movementEase]);
            createjs.Tween.get(_obj).to({ regX: _obj.targetX }, _movementSpeed, createjs.Ease[scope.settings.movementEase]).call(_removeConfettiFlake);
            
            if(scope.settings.useFade) {
                _obj.alpha = 0;
                createjs.Tween.get(_obj).to({ alpha: 1 }, _animationSpeed * 0.1).wait( _animationSpeed * 0.6).to({ alpha: 0}, _animationSpeed * 0.3);
            }

            confettiContainer.addChild(_obj);
        }

        var _removeConfettiFlake = function(tween) {
            confettiContainer.removeChild(tween.target);
        }

        var draw_midY;
        var draw_midX;
        var draw_fragmentX;
        var draw_fragmentY;
        _this.draw = function() {

            draw_midY = scope.canvas.height / 2;
            draw_midX = scope.canvas.width / 2;

            draw_fragmentX = draw_midX / 100;
            draw_fragmentY = draw_midY / 100;

            confettiContainer.x = draw_midX + (draw_fragmentX * scope.settings.offsetX);
            confettiContainer.y = draw_midY + (draw_fragmentY * scope.settings.offsetY);

            confettiContainer.regX = draw_midX;
            confettiContainer.regY = draw_midY;

            // set rotation
            confettiContainer.rotation = rotationObject.value;

            scope.gameObject.addChild(confettiContainer);

            scope.parent.stage.addChild(scope.gameObject);
        }

        function generateRainbowColorArray(length, phase, center, width) {
            phase = phase || scope.settings.rainbowPhase;
            center = center || scope.settings.rainbowCenter;
            width = width || scope.settings.rainbowWidth;
            frequency = Math.PI * 2 / length;

            var rainbow = [];

            for (var i = 0; i < length; ++i) {
                red = Math.sin(frequency * i + 2 + phase) * width + center;
                green = Math.sin(frequency * i + 0 + phase) * width + center;
                blue = Math.sin(frequency * i + 4 + phase) * width + center;

                rainbow.push('rgb(' + Math.round(red) + ',' + Math.round(green) + ',' + Math.round(blue) + ')');
            }

            return rainbow;
        }

        scope.Enable = function(enable) {
            scope.settings.enabled = enable;

            console.log(`Set the background confetti 'enabled' to : ${enable}`);

            if (!enable) {
                scope.gameObject.removeAllChildren();
                scope.stage.update();
            }
        }

        _this.removeGameObject = function(obj) {
            obj.parent.removeChild(obj);
        }

        _this.init();

        return scope;
    };

    return visualisations;

}(jQuery, createjs, document, visualisations || {}));

// Helper methods
Array.prototype.sum = Array.prototype.sum || function() {
    return this.reduce(function(sum, a) { return sum + Number(a) }, 0);
}

Array.prototype.take = Array.prototype.take || function(num) {
    return this.slice(0, num);
}

Array.prototype.average = Array.prototype.average || function() {
    return this.sum() / (this.length || 1);
}