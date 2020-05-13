;

/**
 * Visualisations module. 
 * 
 * @param {any} $ 
 * @param {any} createjs 
 * @param {any} document 
 * @param {any} visualisations 
 * @param {any} undefined 
 * @returns 
 */
var visualisations = (function($, createjs, document, visualisations, undefined) {

    visualisations.bar = visualisations.bar || {};

    /**
     * Bar Visualisations
     * This is the 'simple' bar visual
     * 
     * @param {any} id 
     * @param {any} settings 
     * @returns 
     */
    visualisations.bar.simple = function(id, settings) {

        // Declare a scope for Visualizer
        var scope = {};

        scope.id = id;

        // Bind 'this'
        var _this = this;

        // Private variables for within the plugin only ( no user/ code interaction )
        _this.variables = {
            analyser: null,
            isSkipping: false,
        }

        // The default values ( which can be overriden by supplied settings )
        var _precision = 64;

        var _DEFAULTS = {

            set precision(val) {
                _precision = val;
                generateBars(val);
            },  
            get precision() { return _precision; },

            //precision: 64, // Number of 'samples' taken from the song each frame ( lower this if you have issues with performance )
            mirror: false, // Mirror all frequency data ( so left is equal to right visually )
            rotate: false,
            rotateDuration: 30000,
            type: "normal", // "normal" or "circle" allowed ( default : normal )
            fadeDuration: 1000, // number in miliseconds
            borderColor: "rgba(255,255,255,1)",
            fillColor: "rgba(255,0,125,0.5)", // bar fillcolor ( default : transparent )
            timeSkip: 0,
            borderThickness: 0,
            placement: "middle", // "bottom", "top", "middle" are valid values
            maxWidth: 0,
            circleOffsetX: 0, // negative value = to the left, positive value is to the right
            circleSize: 200,
            barWidth: 10,
            strength: 500,
            reduceSize: true, // scales bars to zero initialy ( default : true )
            alpha: 1,
            enabled: true
        }

        scope.canvas = null;
        scope.parent = null;
        scope.stage = null;

        scope.gameObject = new createjs.Container();

        scope.settings = $.extend(_DEFAULTS, settings);

        /**
         * Init for the Visual
         * 
         */
        _this.init = function() {

            if (!createjs) {
                console.error("This visual requires CreateJS to operate!");
            }
        }

        /**
         * Shortcut to Enable/Disable this visual
         * 
         * @param {any} enable 
         */
        scope.Enable = function (enable) {
            scope.settings.enabled = enable;
        }

        /**
         * Update method that receives the audio data from Wallpaper Engine
         * 
         * @param {any} data 
         */
        scope.update = function(data) {

            _this.draw(data);
        }

        var bars = [];
        generateBars = function(number) {
            
            bars = [];

            for(let x = 0; x < number; x++) {
                bars.push(new createjs.Shape());
            }
        }

        /**
         * Draw method for this Visual
         * 
         * @param {any} data 
         * @returns 
         */
        _this.draw = function(data) {

            if (!scope.settings.enabled) {
                return;
            }

            // clear the gameObject before drawing
            // NOTE: for better performance, don't clear children, and instead use a reference to the created children instead
            scope.gameObject.removeAllChildren();

            var container = new createjs.Container();

            container.alpha = scope.settings.alpha;

            var canvas_w = scope.canvas.width;
            var canvas_h = scope.canvas.height;

            // place container in the center
            var maxWidth = scope.settings.maxWidth || scope.canvas.width;

            container.x = (canvas_w - maxWidth) * 0.5;

            var x_spacing = maxWidth / scope.settings.precision;

            for (var i = 0; i < scope.settings.precision; i++) {

                var bar = bar[x];
                
                bar.graphics.clear();

                var barSize = data[i] * scope.settings.strength;

                if (scope.settings.reduceSize) {
                    var minValue = Math.min(...data);
                    barSize -= (minValue * scope.settings.strength);
                }

                if (scope.settings.borderThickness > 0) {
                    bar.graphics.f(scope.settings.fillColor).s(scope.settings.borderColor).ss(scope.settings.borderThickness).dr(0, 0, scope.settings.barWidth, barSize);
                } else {
                    bar.graphics.f(scope.settings.fillColor).dr(0, 0, scope.settings.barWidth, barSize);
                }

                bar.x = i * x_spacing;
                bar.regX = -scope.settings.barWidth / 2;

                if (scope.settings.placement === "bottom") {
                    bar.y = canvas_h - barSize;
                } else if (scope.settings.placement === "middle") {
                    bar.y = canvas_h * 0.5;
                    bar.regY = (barSize) * 0.5;
                }

                if (scope.settings.type === "circle") {
                    // rotate the bars
                    bar.rotation = 360 * (i / scope.settings.precision);
                    bar.regY += scope.settings.circleSize;
                    bar.x = 0;

                    container.x = (canvas_w * 0.5);
                    bar.regX = scope.settings.barWidth / 2;
                }

                container.addChild(bar);
            }

            scope.gameObject.addChild(container);

            if (!_this.variables.isRotating && scope.settings.rotate) {
                createjs.Tween.get(scope.gameObject, {
                    loop: true,
                    override: true
                }).to({
                    rotation: 360
                }, scope.settings.rotateDuration);

                _this.variables.isRotating = true;

            } else if (_this.variables.isRotating && !scope.settings.rotate) {
                createjs.Tween.get(scope.gameObject, {
                    override: true
                }).set({
                    rotation: 0
                });
                _this.variables.isRotating = false;
            }

            scope.gameObject.regX = scope.canvas.width * 0.5;
            scope.gameObject.regY = scope.canvas.height * 0.5;

            scope.gameObject.x = scope.canvas.width * 0.5;
            scope.gameObject.y = scope.canvas.height * 0.5;
        }

        /**
         * Remove a gameobject from the scene
         * 
         * @param {any} obj 
         */
        _this.removeGameObject = function(obj) {
            obj.parent.removeChild(obj);
        }

        _this.init();

        return scope;
    };

    return visualisations;

}(jQuery, createjs, document, visualisations || {}));