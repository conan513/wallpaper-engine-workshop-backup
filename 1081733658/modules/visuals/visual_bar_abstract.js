;

var visualisations = (function($, createjs, document, visualisations, undefined) {

    visualisations.bar = visualisations.bar || {};

    /**
     * Abstract Bar visual ( Simple Lines )
     * 
     * @param {any} id 
     * @param {any} settings 
     * @returns 
     */
    visualisations.bar.abstract = function(id, settings) {

        // Declare a scope for Visual
        var scope = {};

        scope.id = id;

        // Bind 'this'
        var _this = this;

        // Private variables for within the plugin only ( no user/ code interaction )
        _this.variables = {
            analyser: null,
            mixer: null,
            isSkipping: false,
            hideNoSoundTimeout: null,
            hidden: false,
            rotation: 0,
        }

        // The default values ( which can be overriden by supplied settings )
        var _DEFAULTS = {
            precision: 64, // Number of 'samples' taken from the song each frame ( lower this if you have issues with performance )

            enabled: true,

            strengthMultiplier: 100,

            audioChannel: "STEREO", // LEFT, RIGHT, STEREO
            audioOption: "NORMAL", // NORMAL, MIRROR, REPEAT
            audioDataReverse: false,
        };

        scope.canvas = null;
        scope.parent = null;
        scope.stage = null;

        scope.gameObject = new createjs.Container();

        scope.settings = $.extend(_DEFAULTS, settings);

        _this.init = function() {

            if (!createjs) {
                console.error("This visual requires CreateJS to operate!");
            }

            _this.variables.mixer = new ARTHESIAN.Audio.ChannelMixer();

            _this.bind();
            _this.create();
        }

        scope.reset = function() {
            // Resets
            scope.gameObject.removeAllChildren();

            _this.bind();
            _this.create();
        }

        _this.bind = function() {
            // Any interactions?
        }

        scope.setPrecision = function(number) {
            scope.settings.precision = number || 64;
            _this.create();
        }

        _this.create = function() {
        }

        scope.update = function(audioData) {

            var data = _this.variables.mixer.processAudioData(audioData, true, scope.settings.audioChannel, scope.settings.audioOption, scope.settings.audioDataReverse);

            if(!data.length) { return; }

            data = data.interpolate(scope.settings.precision);

            _this.draw(data);
        }

        _this.draw = function(data) {

            if (!scope.settings.enabled) {
                return;
            }

            scope.gameObject.removeAllChildren();

            let w = scope.canvas.width;
            let h = scope.canvas.height;

            let bm = getBaseMultiplier(data);

            
            let lw = bm * 100;
            
            let lines = 100;
            
            var interpolated = data.interpolate(lines);

            // Do draw logic here - use data
            for(let i = 0; i < lines; i++) {
                var line = new createjs.Shape();

                let dw = w - (w / lines) * i;
                let dh = h - (h / lines) * i;

                line.graphics.ss((lw + 1) - (lw / lines * i), 1).s(`rgba(255,0,0,${(i / lines)})`).mt(dw, 0).lt(scope.canvas.width - dw, scope.canvas.height);
                line.alpha = 1 - (0.9 / lines) * i;
                // line.regX = scope.canvas.width / 2;
                // line.regY = scope.canvas.height / 2;

                line.rotation = 25 * interpolated[i];

                scope.gameObject.addChild(line);
            }
            

            scope.stage.addChild(scope.gameObject);
        }

        /**
         * Method that calculates an multiplier for low range audio data values
         * 
         * @param {any} data 
         * @returns 
         */
        var getBaseMultiplier = function(data) {

            var num = 0;
            let hl = data.length / 2;

            for (x = 0; x < 5; x++) {
                num += data[x] + data[x + hl];
            }

            return num / 100 + 1;
        };

        scope.Enable = function(enable) {
            scope.settings.enabled = enable;

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