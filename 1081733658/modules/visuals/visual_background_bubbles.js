;

var visualisations = (function($, createjs, document, visualisations, undefined) {

    visualisations.background = visualisations.background || {};

    /**
     * Floating bubbles based on audio
     * 
     * @param {any} id 
     * @param {any} settings 
     * @returns 
     */
    visualisations.background.bubbles = function(id, settings) {

        // Declare a scope for Visualizer
        var scope = {};

        scope.id = id;

        // Bind 'this'
        var _this = this;

        // Private variables for within the plugin only ( no user/ code interaction )
        _this.variables = {
            analyser: null,
            objects: [],
            delayTime: new Date().getTime(),
            cursorPosition: null
        }

        // The default values ( which can be overriden by supplied settings )
        var _DEFAULTS = {
            rotate: false,
            rotateDuration: 30000,
            size: 200,
            strength: 2,
            spawnDelay: 100,
            maximumObjects: 100,
        }

        scope.canvas = null;
        scope.parent = null;

        scope.gameObject = new createjs.Container();

        scope.settings = $.extend(_DEFAULTS, settings);

        /**
         * Init method for the Visual
         * 
         */
        _this.init = function() {

            if (!createjs) { console.error("This visual requires CreateJS to operate!"); }

            _this.variables.cursorPosition = _this.variables.cursorPosition || { x: $(document).width() / 2, y: $(document).height() / 2 };

            _this.bind();
        }

        /**
         * User can control the movement of the bubbles with it's cursor
         * 
         */
        _this.bind = function() {
            $(document).on("mousemove", _this.cursorPos);
        }

        /**
         * Update method is provided with audio data by Wallpaper Engine
         * 
         * @param {any} data 
         * @returns 
         */
        scope.update = function(data) {

            var time = new Date().getTime();

            if (_this.variables.delayTime + scope.settings.spawnDelay < time) {

                _this.variables.delayTime = time;

                // If there is no or low sound, don't spawn items
                if (data.average() < 10) return;

                _this.spawn();
            }

            _this.draw(data);
        }

        /**
         * Get the cursor position ( on move )
         * 
         * @param {any} e 
         */
        _this.cursorPos = function(e) {
            var posx = posy = 0;
            if (e.pageX || e.pageY) {
                posx = e.pageX;
                posy = e.pageY;
            } else if (e.clientX || e.clientY) {
                posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }
            _this.variables.cursorPosition.x = posx;
            _this.variables.cursorPosition.y = posy;
        }

        /**
         * Spawn a new bubble
         * 
         */
        _this.spawn = function() {

            var obj = new createjs.Bitmap("img/bubble_6.png");

            obj.y = scope.canvas.height;
            obj.x = Math.random() * scope.canvas.width;

            obj.regY = obj.image.height / 2;
            obj.regX = obj.image.width / 2;

            speedMultiplier = (Math.random() * 1.5) + 0.5;

            obj.scaleX = obj.scaleY = (Math.random() * 0.02) + 0.01; // between 0.01 and 0.03
            var endScale = (Math.random() * 0.5) + 0.25; // between 0.25 and 0.75
            obj.alpha = 0;
            obj.speedMultiplier = speedMultiplier;

            createjs.Tween.get(obj).to({ scaleX: 0.5, scaleY: 0.5 }, 10000);
            createjs.Tween.get(obj).to({ alpha: 1 }, 250).to({ alpha: 0 }, 10000).call(function(tween) {
                scope.gameObject.removeChild(tween.target);
            });

            if (scope.settings.rotate) {
                createjs.Tween.get(obj).to({ rotate: 360 }, 10000);
            }

            scope.gameObject.addChild(obj);

            if (scope.gameObject.children.length > scope.settings.maximumObjects) {
                scope.gameObject.children.shift();
            }
        }

        /**
         * Draw the Visual to the screen
         * 
         * @param {any} data 
         */
        _this.draw = function(data) {

            var movement = data.average();

            var mousemove = _this.variables.cursorPosition.x - (scope.canvas.width / 2);

            scope.gameObject.children.forEach(function(obj) {

                obj.y -= (movement / 10) * obj.speedMultiplier;
                obj.x += mousemove / 100;

                if (obj.y < -obj.image.width) {
                    scope.gameObject.removeChild(obj);
                }
            });
        }

        /**
         * Remove a gameobject from the stage
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