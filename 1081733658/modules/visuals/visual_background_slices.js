;

var visualisations = (function($, createjs, document, visualisations, undefined) {

    visualisations.background = visualisations.background || {};

    /**
     * Moving background slices
     * 
     * @param {any} id 
     * @param {any} settings 
     * @returns 
     */
    visualisations.background.slices = function(id, settings) {

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
        var _DEFAULTS = {
            precision: 64, // Number of 'samples' taken from the song each frame ( lower this if you have issues with performance )
            mirror: false, // Mirror all frequency data ( so left is equal to right visually )
            rotate: false,
            rotateDuration: 30000,
            type: "normal", // "normal" or "circle" allowed ( default : normal )
            fade: false, // when fade set to 'true', the line will 'ghost'
            fadeDuration: 1000, // number in miliseconds
            borderColor: "rgba(255,255,255,1)",
            fillColor: "rgba(255,0,125,0.5)", // bar fillcolor ( default : transparent )
            timeSkip: 2000,
            borderThickness: 0,
            placement: "middle", // "bottom", "top", "middle" are valid values
            maxWidth: 0,
            circleOffsetX: 0, // negative value = to the left, positive value is to the right
            circleSize: 200,
            barWidth: 10,
            strength: 2,
            reduceSize: true, // scales bars to zero initialy ( default : true )
        }

        scope.canvas = null;
        scope.parent = null;

        scope.gameObject = new createjs.Container();

        scope.settings = $.extend(_DEFAULTS, settings);

        _this.init = function() {

            if (!createjs) { console.error("This visual requires CreateJS to operate!"); }
        }

        /**
         * Update the Visual with audio data provided by Wallpaper Engine
         * 
         * @param {Array<number>} data 
         */
        scope.update = function(data: Array<number>) {

            if (scope.settings.mirror) {
                var mirror = data.slice(0);
                mirror.reverse();

                data.push(mirror);
            }

            // If timeSkip is enabled, and is currently not skipping, then draw
            if (!_this.variables.isSkipping && scope.settings.timeSkip > 0) {

                _this.draw(data);
                // Set the new timeOut for the next draw
                setTimeout(function() {
                    _this.variables.isSkipping = false;
                    // Draw to the cnavas
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
         * Draw a slice shaped segment of a circle on to a Graphics object
         * 
         * @param {any} target 
         * @param {any} x 
         * @param {any} y 
         * @param {any} r 
         * @param {any} aStart 
         * @param {any} aEnd 
         * @param {any} step 
         */
        _this.drawSegment = function(target, x, y, r, aStart, aEnd, step) {

            if (!step) step = 10;
            // More efficient to work in radians
            var degreesPerRadian = Math.PI / 180;
            aStart *= degreesPerRadian;
            aEnd *= degreesPerRadian;
            step *= degreesPerRadian;

            // Draw the segment
            target.graphics.moveTo(x, y);
            for (var theta = aStart; theta < aEnd; theta += Math.min(step, aEnd - theta)) {
                target.graphics.lineTo(x + r * Math.cos(theta), y + r * Math.sin(theta));
            }
            target.graphics.lineTo(x + r * Math.cos(aEnd), y + r * Math.sin(aEnd));
            target.graphics.lineTo(x, y);
        };

        /**
         * Draw the Visual on the canvas
         * 
         * @param {any} data 
         */
        _this.draw = function(data) {

            var container = new createjs.Container();

            var canvas_w = scope.canvas.width;
            var canvas_h = scope.canvas.height;
            var canvas_m = canvas_h * 0.5;

            var size = 300; // doorsnee
            var radius = size / 2;

            // place container in the center
            var maxWidth = scope.settings.maxWidth || scope.canvas.width;

            container.x = (canvas_w - maxWidth) * 0.5;

            var degrees = 360 / scope.settings.precision;

            var random_offset = Math.random() * 90;

            for (var i = 0; i < scope.settings.precision; i++) {

                var bar = new createjs.Shape();

                bar.graphics.ss(1);
                bar.graphics.rf(["rgba(255,0,0,0)", "rgba(255,0,0,0.8)", "rgba(255,128,0,0.4)", "rgba(255,0,0,0.8)", "rgba(255,0,0,0)"], [0.1, 0.15, 0.3, 0.8, 0.9], 0, 0, 0, 0, 0, radius);
                bar.graphics.rs(["rgba(255,0,0,0)", "rgba(255,0,0,1)", "rgba(255,128,0,1)", "rgba(255,0,0,1)", "rgba(255,0,0,0)"], [0.1, 0.15, 0.3, 0.8, 0.9], 0, 0, 0, 0, 0, radius);

                _this.drawSegment(bar, 0, 0, radius, i * degrees + random_offset, (i + 2) * degrees + random_offset);

                // rotate the bars
                bar.rotation = 360 * (i / scope.settings.precision);
                bar.x = canvas_w / 2;
                bar.y = canvas_m;


                var random_time_offset = Math.random() * 6000;
                var degreesPerRadian = Math.PI / 180;

                var theta = ((i + 0.5) * degrees * 2 + random_offset) * degreesPerRadian;

                var movement = radius * 0.5;

                bar.alpha = 0;
                createjs.Tween.get(bar).wait(random_time_offset).to({ alpha: 0.5 }, 1000).to({ alpha: 0 }, 3000);

                createjs.Tween.get(bar).wait(random_time_offset).to({ scaleX: 5, scaleY: 5, x: canvas_w / 2 + movement * Math.cos(theta), y: canvas_m + movement * Math.sin(theta) }, 4000);

                container.addChild(bar);
            }

            scope.gameObject.addChild(container);

            setTimeout(function() { _this.removeGameObject(container) }, 10000); // 3 x 2000


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