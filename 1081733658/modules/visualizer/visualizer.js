;
'use strict';

(function($, createjs, document, undefined) {

    /**
     * jQuery module 'visualizer'.
     * Uses 'Visuals' to draw images on a canvas based on array of numbers ( sound data )
     * 
     * @param {any} settings 
     * @returns 
     */
    $.fn.visualizer = function(settings) {

        // Declare a scope for Visualizer
        var scope = {};

        // Bind 'this'
        var _this = this;

        // Private variables for within the plugin only ( no user/ code interaction )
        _this.variables = {
            container: null, // Container
            objects: {}, // Objects reference block
            cursorX: 0,
            cursorY: 0,
            visuals: [],
            idle: false,
            hueShiftBass: 0,
            resolutionText: ""
        };

        // The default values
        var _DEFAULTS = {
            canvasId: "visualizer", // note : this must be an ID ( not a class! )

            enableFPSCounter: false,

            enableIdleState: false,
            enableIdleAnimation: false,
            idleTimeoutSeconds: 10,
            idleMovementSpeedMultiplier: 1,
            idleAnimationStrengthMultiplier: 1,
            idleAnimationIgnoresEffects: false,

            enablePinkNoiseCorrection: true,

            enabled: true,

            enableGlow: false,
            glowSize: 10,
            glowColor: "white",

            // Effects
            effectsEnabled: false,

            blurOnBeatEnabled: false,
            blurOnBeatStrengthMultiplier: 1,

            hilightOnBeatEnabled: false,
            hilightOnBeatStrengthMultiplier: 1,

            bounceOnBeatEnabled: false,
            bounceOnBeatStrengthMultiplier: 1,

            bassShakeEnabled: false,
            bassShakeStrengthMultiplier: 1,
            bassShakeInvert: false,

            hueEnabled: false,
            hueOffset: 0,

            hueRotationEnabled: false,
            hueRotationDuration: 10000,

            hueShiftTemporaryEnabled: false,
            hueShiftTemporaryStrengthMultiplier: 1,

            hueShiftPermanentEnabled: false,
            hueShiftPermanentStrengthMultiplier: 1,

            hueShiftPermanentReset: false,
            hueShiftPermanentResetTimeout: 1000,
            hueShiftPermanentResetDuration: 5000,

            hueShiftBassReset: false,
            hueShiftBassResetTimeout: 1000,
            hueShiftBassResetDuration: 5000,

            transparency_onbeat: false,
            transparency_onbeat_strength: 1,
            transparency_onbeat_inverted: false,


            enableEqualizer: false,
            equalizerMultiplier1: 1, // <200hz
            equalizerMultiplier2: 1, // ~400hz
            equalizerMultiplier3: 1, // ~750hz
            equalizerMultiplier4: 1, // ~1.5khz
            equalizerMultiplier5: 1, // ~3khz
            equalizerMultiplier6: 1, // ~6khz
            equalizerMultiplier7: 1, // ~9khz
            equalizerMultiplier8: 1, // ~12khz
        };

        scope.variables = _this.variables;

        scope.backgroundCanvas = null;
        scope.backgroundStage = null;

        scope.canvas = null;
        scope.stage = null;

        scope.settings = $.extend(_DEFAULTS, settings);

        /**
         * Init function. The constructor for the Visualizer. Will run some general checks, and setup the stages.
         * Creates the stage and is owner of all objects that should be added to draw onto the canvas.
         * 
         */
        _this.init = function() {

            if (!this[0].id) {
                console.error("The targeted canvas needs to have an id specified");
            }

            if (!createjs) {
                console.error("This plugin requires CreateJS to operate!");
            }

            scope.settings.canvasId = this[0].id;
            scope.id = scope.settings.canvasId;

            // The main stage for visuals            
            var stage = new createjs.Stage(scope.settings.canvasId);
            // stage.snapToPixel = true;
            // stage.snapToPixelEnabled = true;
            scope.stage = stage;
            scope.canvas = stage.canvas;
            stage.enableMouseOver(0);

            // The game object of the visualizer itself ( FPS counter for example )            
            _this.variables.container = new createjs.Container();
            _this.variables.container.name = "Visualizer Core";
            _this.variables.container.origRegX = 0;
            _this.variables.container.origRegY = 0;
            stage.addChild(_this.variables.container);

            _this.bind();
        };

        /**
         * Bind events
         * 
         */
        _this.bind = function() {
            document.addEventListener("mousemove", function(event) {
                _this.variables.cursorX = event.pageX || 1;
                _this.variables.cursorY = event.pageY || 1;
            });

            createjs.Ticker.addEventListener("tick", _this.update);

            // ARTHESIAN.EventBus.addEventListener('idle', _this.handleIdleChange);
        };

        /**
         * Enable or disable glow on the canvas of this visualizer ( targets all visuals included )
         * 
         * @param {any} enable 
         */
        scope.enableGlow = function(enable) {
            scope.settings.enableGlow = enable;

            console.log(`Set the visualizer 'glow enabled' to : ${enable}`);
        };

        var hueRotation = { offset: 0 };
        /**
         * Enable or disable rotation tween for Hue offset.
         * 
         * @param {any} enabled 
         */
        scope.startHueRotationTween = function(enabled) {
            scope.settings.hueRotationEnabled = enabled;
            if (enabled) {
                hueRotation.offset %= 360;
                createjs.Tween.get(hueRotation, { override: true, loop: true }).to({ offset: hueRotation.offset + 360 }, scope.settings.hueRotationDuration);
            } else {
                createjs.Tween.get(hueRotation, { override: true }).set({ offset: 0 });
            }
        };

        /**
         * Apply CSS filters on the visualizer
         * 
         * @param {any} data 
         */
        var ApplyCSSFilterCanvas = function(data, filter) {

            _filter = filter || scope.canvas.style.filter;

            // clean
            _filter = _cssFilterHelper.removeShadow(_filter);
            _filter = _cssFilterHelper.removeBlur(_filter);
            _filter = _cssFilterHelper.removeBrightness(_filter);
            _filter = _cssFilterHelper.removeHueRotate(_filter);

            if(scope.settings.enableGlow) {
                _filter = _cssFilterHelper.addShadow(_filter, 0, 0, scope.settings.glowSize, scope.settings.glowColor);
            }

            // return is no effects
            if (!scope.settings.effectsEnabled || (ARTHESIAN.Audio.Source.idleHandler.isIdle && scope.settings.idleAnimationIgnoresEffects)) {

                scope.canvas.style.filter = _filter;
                return;
            }

            //grab the context from your destination canvas
            var baseMultiplier = ARTHESIAN.Audio.Source.getBaseMultiplier(0, 5) - 1;
            baseMultiplier /= 5;

            if (scope.settings.blurOnBeatEnabled) {

                var blurBaseMultiplier = baseMultiplier * 25;
                var blurMultiplier = blurBaseMultiplier * scope.settings.blurOnBeatStrengthMultiplier;

                _filter = _cssFilterHelper.addBlur(_filter, blurMultiplier);
            }

            if (scope.settings.hilightOnBeatEnabled) {

                var brightnessAddition = (baseMultiplier * baseMultiplier) * (scope.settings.hilightOnBeatStrengthMultiplier * scope.settings.hilightOnBeatStrengthMultiplier);
                brightnessAddition *= 300;
                brightnessAddition += 100;

                _filter = _cssFilterHelper.addBrightness(_filter, brightnessAddition);
            }

            // Hue shift
            let hueRotate = 0;

            if (scope.settings.hueOffset) {
                hueRotate += scope.settings.hueOffset;
            }

            if (scope.settings.hueShiftTemporaryEnabled) {

                let hueBaseMultiplier = baseMultiplier * 360;
                hueBaseMultiplier *= scope.settings.hueShiftTemporaryStrengthMultiplier;

                hueRotate += hueBaseMultiplier;
            }

            if (scope.settings.hueRotationEnabled) {
                hueRotate += hueRotation.offset;
            }

            if (scope.settings.hueShiftPermanentEnabled) {
                let hueShiftBass = Math.pow(baseMultiplier, 2) * 720;

                _this.variables.hueShiftBass += hueShiftBass * scope.settings.hueShiftPermanentStrengthMultiplier;
                _this.variables.hueShiftBass %= 360;

                hueRotate += _this.variables.hueShiftBass;
            }

            if (scope.settings.hueEnabled && hueRotate) {
                _filter = _cssFilterHelper.addHueRotate(_filter, hueRotate % 360);
            }

            // Hue shift reset timeout
            if (!ARTHESIAN.Audio.Source.hasSound) {
                if (scope.settings.hueShiftBassReset && !_this.variables.hueShiftBassResetTimeout) {
                    _this.variables.hueShiftBassResetTimeout = setTimeout(function() {
                        createjs.Tween.get(_this.variables).to({ hueShiftBass: 0 }, scope.settings.hueShiftBassResetDuration);
                    }, scope.settings.hueShiftBassResetTimeout);
                }
            } else if (_this.variables.hueShiftBassResetTimeout) {
                clearTimeout(_this.variables.hueShiftBassResetTimeout);
                _this.variables.hueShiftBassResetTimeout = null;
            }

            // Opacity on Beat
            if(scope.settings.transparency_onbeat) {
                var transparencyMultiplier = baseMultiplier * 5;
                var transparency = transparencyMultiplier * scope.settings.transparency_onbeat_strength;

                if(transparency > 1.1) { transparency = 1.1; }

                transparency -= 0.1;

                if(transparency < 0) { transparency = 0; }

                if(scope.settings.transparency_onbeat_inverted) {
                    transparency = 1 - transparency;
                }

                _filter = _cssFilterHelper.replaceOpacity(_filter, transparency * 100);
            }

            scope.canvas.style.filter = _filter;
        };

        var _transform
        var _cssTransformHelper = ARTHESIAN.Helper.Transform;
        var _cssFilterHelper = ARTHESIAN.Helper.Filter;

        /**
         * Apply CSS transforms on the visualzer
         * 
         * @param {any} data 
         */
        var ApplyCSSTransformCanvas = function(data) {
            _transform = scope.canvas.style.transform;

            // clean
            _transform = _cssTransformHelper.removeScale(_transform);

            // return is no effects
            if (!scope.settings.effectsEnabled || (ARTHESIAN.Audio.Source.idleHandler.isIdle && scope.settings.idleAnimationIgnoresEffects)) {
                
                scope.canvas.style.transform = _transform;
                return;
            }

            //grab the context from your destination canvas
            // var baseMultiplierOrg = getBaseMultiplier(data) - 1;
            // baseMultiplierOrg *= 100;
            var baseMultiplier = ARTHESIAN.Audio.Source.getBaseMultiplier(0, 5) - 1;
            baseMultiplier /= 5;

            if (scope.settings.bounceOnBeatEnabled) {
                var scale = baseMultiplier * scope.settings.bounceOnBeatStrengthMultiplier;
                scale += 1;

                _transform = _cssTransformHelper.addScale(_transform, scale);
            }

            scope.canvas.style.transform = _transform;
        };

        /**
         * Add a new visual to the Visualizer
         * 
         * @param {any} visual 
         * @returns 
         */
        scope.addVisual = function(visual) {
            if (_this.variables.visuals[visual.id]) {
                console.error("This visual ID is already in use, please use an other one, or remove the existing one!");
                return;
            }

            console.log(`Added visual (${visual.id}) successfully to the Visualizer`)

            _this.variables.visuals[visual.id] = visual;
            _this.variables.visuals.push(visual);

            visual.parent = scope;
            visual.stage = scope.stage;
            visual.canvas = scope.canvas;
        };

        /**
         * Remove a visual from the Visualizer by ID
         * 
         * @param {any} id 
         */
        scope.removeVisual = function(id) {
            delete _this.variables.visuals[id];

            $.each(_this.variables.visuals, function(i) {
                if (_this.variables.visuals[i].id === id) {
                    _this.variables.visuals.splice(i, 1);
                    return false;
                }
            });
        };

        /**
         * Private method to remove a GameObject from the hierarchy.
         * 
         * @param {any} obj 
         */
        _this.removeGameObject = function(obj) {
            obj.parent.removeChild(obj);
        };

        /**
         * Recieve the Sound Data from an external source ( Wallpaper Engine in this case )
         * All data is 'Smoothed' from the previous set of data to the current, to be able
         * to draw at an higher frequency than the Audio Data is delivered.
         * Keeps track of Inactive timer.
         * 
         * @param {any} data 
         */
        scope.setAudioData = function(data) {
            
            // If pinknoise correction needs to be applied, do so
            if (scope.settings.enablePinkNoiseCorrection) {
                // TODO :: This setting should move to the Audio WE_Handler
            }

            // Apply equalizer when applicable
            if (scope.settings.enableEqualizer) {
                // TODO :: This setting should move to the Audio WE_Handler
            }
        };

        // var isVisualizerIdle = false
        // _this.handleIdleChange = function(isIdle) {
        //     isVisualizerIdle = isIdle;
        //     if(isIdle) {
        //         handleNoSound();
        //     }else{
        //         handleSound();
        //     }
        // }

        var hueResetTimeout = null;
        var hueResetTimeoutRunning = false;
        var handleNoSound = function(){
            // IF Hue shift reset on idle
            if (scope.settings.hueShiftPermanentReset) {

                // If there is not yet a hue reset timeout
                if (!hueResetTimeoutRunning) {
                    hueResetTimeout = setTimeout(function() {
                        createjs.Tween.get(_this.variables).to({ hueShiftBass: 0 }, scope.settings.hueShiftPermanentResetDuration);
                    }, scope.settings.hueShiftPermanentResetTimeout);

                    hueResetTimeoutRunning = true;

                    console.log(`Visualizer Hue Shift Permanent reset timeout started for ${scope.settings.hueShiftPermanentResetTimeout / 1000} seconds`);
                }
                
            } else if (hueResetTimeoutRunning) {
                clearTimeout(hueResetTimeout);
                hueResetTimeoutRunning = false;

                console.log(`Visualizer Hue Shift Permanent reset timeout was cancelled`);
            }
        }

        var handleSound = function(){
            // Remove the inactive timer when sound is detected
            if (hueResetTimeoutRunning) {
                clearTimeout(hueResetTimeout);
                hueResetTimeoutRunning = false;
            }

            if(_this.variables.idle){
                _this.variables.idle = false;
            }
        }

        /**
         * Apply equalizer to audio data
         * 
         * @param {any} data 
         */
        var _eqData = [];
        _this.applyEqualizerToAudioData = function(data) {

            // TODO: create getters/setters for equalizer props, generate eqData based on EQ and only interpolate once!
            // TODO: Interpolate only if data.length != interpolatedEq.length
            var eqData = [
                scope.settings.equalizerMultiplier1, scope.settings.equalizerMultiplier2,
                scope.settings.equalizerMultiplier3, scope.settings.equalizerMultiplier4,
                scope.settings.equalizerMultiplier5, scope.settings.equalizerMultiplier6,
                scope.settings.equalizerMultiplier7, scope.settings.equalizerMultiplier8
            ];

            var interpolatedEq = ARTHESIAN.Helper.Array.interpolate(eqData, data.length / 2);
            interpolatedEq.push(interpolatedEq);

            _eqData = []

            for (var x = 0; x < data.length / 2; x++) {
                _eqData[x] = (interpolatedEq[x] < 0 ? 0 : interpolatedEq[x]) * data[x];
            }
            for (var x = data.length / 2; x < data.length; x++) {
                _eqData[x] = (interpolatedEq[x - data.length / 2] < 0 ? 0 : interpolatedEq[x - data.length / 2]) * data[x];
            }

            return _eqData;
        };

        var _sortVisuals = (a,b) => a.settings.zIndex - b.settings.zIndex;

        /**
         * Update all visual states of the Visuals that have been added to this Visualizer
         * 
         * @param {any} data 
         */
        scope.updateVisuals = function(data) {

            if(this.settings.enableEqualizer) {
                // TODO : Optimize Apply Equalizer
                _data = _this.applyEqualizerToAudioData(data);
            } else {
                _data = data;
            }

            let bassMultiplier = ARTHESIAN.Audio.Source.getBaseMultiplier(0, 4) - 1;

            bassMultiplier -= 0.5;
            if(bassMultiplier < 0) { bassMultiplier = 0; }

            _offset = ARTHESIAN.Audio.Source.getBassOffsetValues(bassMultiplier * scope.settings.bassShakeStrengthMultiplier);

            // Sort on zIndex setting
            _this.variables.visuals.sort(_sortVisuals);

            // Magic starts here :D
            _this.variables.visuals.forEach(_updateVisual);
        };

        var _offset = { x : 0, y: 0 };
        var _data = [];
        var _updateVisual = (visual) => {

            if(!visual.settings.enabled) { return; }

            visual.update(_data);

                // TODO: sort visuals by zIndex
                if (visual.gameObject) {

                    // Apply Shake to the container if applicable
                    if(scope.settings.effectsEnabled && scope.settings.bassShakeEnabled) {
                        
                        if(scope.settings.bassShakeInvert) {
                            visual.gameObject.regX = -_offset.x;
                            visual.gameObject.regY = -_offset.y;
                        } else {
                            visual.gameObject.regX = _offset.x;
                            visual.gameObject.regY = _offset.y;
                        }

                    } else {
                        visual.gameObject.regX = 0;
                        visual.gameObject.regY = 0;
                    }

                    scope.stage.addChild(visual.gameObject);
                }
        }

        /**
         * Checks for any active visuals
         * 
         * @returns 
         */
        _this.checkVisualsActive = function() {

            // If there are no visuals attached, return false;
            if (_this.variables.visuals.length < 1) {
                return false;
            }

            return _this.variables.visuals.some(v => v.settings.enabled);
            
            // // Filter all active visuals from total list of visuals
            // var activeVisuals = _this.variables.visuals.filter(function(visual) {
            //     return visual.settings.enabled;
            // });

            // // If there is at least one active visual, return true
            // if (activeVisuals.length > 0) {
            //     return true;
            // }

            // // Default : return false
            // return false;
        };

        scope.clearCanvas = function(){
            // Clear the stage            
            scope.stage.removeAllChildren();
            // Update the stage
            if(scope.canvas.nodeName === "CANVAS") {
                scope.stage.update();
            }
        }

        _newAudioData = [];
        _update = true;
        /**
         * The update method fired by the Createjs.Ticker object.
         * The stage get cleared of any object, and is reconstructed by updating the Visuals.
         * 
         */
        _this.update = function() {

            _update = true;

            // If Visualizer is disabled, don't update
            if (!scope.settings.enabled) {
                _update = false;
            }

            // If no active visuals, don't update
            if (!_this.checkVisualsActive()) {
                _update = false;
            }

            // If performance callback is assigned
            if (scope.performanceCallback) {

                // Set screen resolution
                _this.variables.resolutionText = scope.canvas.width + "x" + scope.canvas.height;

                // perform the callback with data
                scope.performanceCallback(scope);
            }

            // if update disabled, return
            if (!_update) { return; }

            // Get Audio data
            _newAudioData = ARTHESIAN.Audio.Source.getWallpaperEngineAudioData();

            // Clear the stage            
            scope.stage.removeAllChildren();

            // clear local gameobject
            _this.variables.container.removeAllChildren();

            // Update visuals
            scope.updateVisuals(_newAudioData);

            // Add the visualizer to the main stage            
            scope.stage.addChild(_this.variables.container);

            // Update the stage
            if(scope.canvas.nodeName === "CANVAS") {
                scope.stage.update();
            }
            
            // Apply effects 
            ApplyCSSFilterCanvas(_newAudioData);
            ApplyCSSTransformCanvas(_newAudioData);

            // Handle sound/no sound timers
            if(ARTHESIAN.Audio.Source.hasSound) {
                handleSound();
            } else {
                handleNoSound();
            }
        };

        /**
         * Enable or disable the visualizer
         * 
         * @param {any} enabled 
         */
        scope.Enable = function(enabled) {
            scope.settings.enabled = enabled;

            console.log(`Set the visualizer 'enabled' to : ${enabled}`);
        };

        _this.init();

        return scope;
    };

}(jQuery, createjs, document));