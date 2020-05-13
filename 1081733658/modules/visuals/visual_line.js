;

/**
 * Visualisations module object
 * 
 * @param {any} $ 
 * @param {any} createjs 
 * @param {any} document 
 * @param {any} visualisations 
 * @param {any} undefined 
 * @returns 
 */
var visualisations = (function($, createjs, document, visualisations, undefined) {

    visualisations.lines = visualisations.lines || {};

    /**
     * Simple Line Visual
     * 
     * @param {any} id 
     * @param {any} settings 
     * @returns 
     */
    visualisations.lines.simple = function(id, settings) {

        // Declare a scope for Visualizer
        var scope = {};

        scope.id = id;

        // Bind 'this'
        var _this = this;

        // Private variables for within the plugin only ( no user/ code interaction )
        _this.variables = {
            analyser: null,
            isRotating: false,
            isSkipping: false,
        }

        // The default values ( which can be overriden by supplied settings )
        var _DEFAULTS = {
            precision: 128, // Number of 'samples' taken from the song each frame ( lower this if you have issues with performance )
            mirror: false, // Mirror all frequency data ( so left is equal to right visually )
            type: "waveform", // "waveform" or "frequency" allowed ( default : waveform )
            fade: false, // when fade set to 'true', the line will 'ghost'
            fadeDuration: 1000, // number in miliseconds         
            lineY: 360,
            rotate: false, // when rotate set to 'true', the line will rotate steadily ( clockwise )
            rotateDuration: 30000, // number in miliseconds for full rotation ( default : 30 seconds )
            color: "red",
            timeSkip: 0,
            fill: false,
            fillStyle: "top",
            fillColor: "rgba(255,0,0,0.3)",
            thickness: 2,
            reduceSize: true,
            strength: 2
        }

        scope.stage = null;
        scope.canvas = null;
        scope.parent = null;

        scope.gameObject = new createjs.Container();

        scope.settings = $.extend(_DEFAULTS, settings);

        /**
         * Init method for this Visual
         * 
         */
        _this.init = function() {

            if (!createjs) { console.error("This visual requires CreateJS to operate!"); }
        }

        /**
         * The Update method processes the Audio Data Array as provided by Wallpaper Engine ( number array )
         * 
         * @param {Array<number>} data 
         */
        scope.update = function(data) {

            // If mirrored            
            if (scope.settings.mirror) {
                var mirror = data.slice(0);
                mirror.reverse();

                data.push(mirror);
            }

            // If timeSkip is enabled, and is currently not skipping, then draw
            if (!_this.variables.isSkipping && scope.settings.timeSkip > 0) {

                // Set the new timeOut for the next draw
                setTimeout(function() {
                    _this.variables.isSkipping = false;

                    // Draw to the cnavas
                    _this.draw(data);
                }, scope.settings.timeSkip);

                // Set skipping to true, to prevent calling the method again
                _this.variables.isSkipping = true;

            } else if (_this.variables.isSkipping && scope.settings.timeSkip <= 0) {

                // If skipping was enabled, but settings have been set to not skipping, disable it for the next update
                _this.variables.isSkipping = false;
            } else if (!_this.variables.isSkipping) {

                // If not skipping, draw each update
                _this.draw(data);
            }
        }

        /**
         * Draw method for the visual
         * 
         * @param {any} data 
         */
        _this.draw = function(data) {

            var container = new createjs.Container();

            var canvas_w = 1280; // TODO:: hardcoded
            var canvas_h = 720; // TODO:: hardcoded
            var canvas_m = canvas_h * 0.5;

            var line = new createjs.Shape();
            line.graphics.s(scope.settings.color).ss(scope.settings.thickness);

            var minValue = Math.min(...data);
            var maxValue = Math.max(...data);

            if (scope.settings.fill) {
                line.graphics.f(scope.settings.fillColor);
            }

            var x_spacing = canvas_w / scope.settings.precision;

            for (var i = 0; i < scope.settings.precision; i++) {

                var lineSize = data[i] * scope.settings.strength;

                if (scope.settings.reduceSize) {
                    lineSize -= (minValue * scope.settings.strength) + ((maxValue - minValue) * 0.5);
                }

                lineSize += scope.settings.lineY;

                if (i == 0) {
                    line.graphics.mt(0, lineSize);
                } else if (i == scope.settings.precision - 1) {
                    line.graphics.lt(canvas_w, lineSize);
                } else {
                    line.graphics.lt((i * x_spacing), lineSize);
                }
            }

            line.graphics.lt(canvas_w, data[i]);

            if (scope.settings.fill && scope.settings.fillStyle === "top") {
                line.graphics.lt(canvas_w, 0).lt(0, 0).closePath();
            } else if (scope.settings.fill && scope.settings.fillStyle == "bot") {
                line.graphics.lt(canvas_w, canvas_h).lt(0, canvas_h).closePath();
            }

            container.addChild(line);

            scope.gameObject.addChild(container);

            if (scope.settings.fade) {
                createjs.Tween.get(container).to({ alpha: 0 }, scope.settings.fadeDuration).call(function() { _this.removeGameObject(container) });
            } else {
                setTimeout(function() { _this.removeGameObject(container) }, 0);
            }

            if (!_this.variables.isRotating && scope.settings.rotate) {
                createjs.Tween.get(scope.gameObject, { loop: true, override: true }).to({ rotation: 360 }, scope.settings.rotateDuration);

                _this.variables.isRotating = true;
                scope.gameObject.scaleX = scope.gameObject.scaleY = 1.2;

            } else if (_this.variables.isRotating && !scope.settings.rotate) {
                createjs.Tween.get(scope.gameObject, { loop: true, override: true }).to({ rotation: 0 }, scope.settings.fadeDuration);

                _this.variables.isRotating = false;
                scope.gameObject.scaleX = scope.gameObject.scaleY = 1;
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