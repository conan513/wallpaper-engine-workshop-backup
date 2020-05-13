;

var visualisations = (function($, createjs, document, visualisations, undefined) {

    visualisations.circle = visualisations.circle || {};

    /**
     * Rainbow Bar visual ( Simple Lines )
     * 
     * @param {any} id 
     * @param {any} settings 
     * @returns 
     */
    visualisations.circle.blob = function(id, settings) {

        // Declare a scope for Visual
        var scope = {};

        scope.id = id;

        // Bind 'this'
        var _this = this;

        // Private variables for within the plugin only ( no user/ code interaction )
        _this.variables = {
            analyser: null,
            isSkipping: false,
            hideNoSoundTimeout: null,
            hidden: false
        }

        // The default values ( which can be overriden by supplied settings )
        var _DEFAULTS = {
            precision: 32, // Number of 'samples' taken from the song each frame ( lower this if you have issues with performance )

            enabled: true,

            // strengthMultiplier: 100,

            // barWidth: 5,

            // color: null,
            alpha: 1,

            barsVerticalPosition: 0, // percentage from top
            barsHorizontalPosition: 0,

            hideNoSound: false,
            hideNoSoundFadeDuration: 500,
            hideNoSoundDelay: 2000,

            rotation: 270,

            // lineCapsType: 1,
            // heightLimit: 0,

            // verticalGrowthOffset: 100,

            // enableSplit: false,
            // splitAlpha: 0.3,

            // enableRotateColours: false,
            // rotateColoursDuration: 1,
            // rotateColoursL2R: false,
            // reverseRainbow: false,

            // circleMode: false,
            // circleSize: 200,

            enableRotation: false,
            rotationCCW: false,
            rotationDuration: 10000, // 10 seconds

            channel: "STEREO", // LEFT / RIGHT
            channel_render: 1,
            channel_reverse: false,

            // enableBorder: false,
            // borderWidth: 2,
            // borderAlpha: 0.5,
            // borderColor: "rgb(0,0,0)",

            blobCloneAmount: 0,
            blobCloneStrength: 5,
            blobCloneColor: null,

            blobTopColor: "white",
            blobMinRadius: 100,
            blobStrength: 30,

            topLogoUrl: "",

            useOnlyBase: true
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

            _this.bind();
            _this.create();
        }

        scope.reset = function() {
            // Resets
            scope.gameObject.removeAllChildren();
            rainbow = [];
            rainbowHighlights = [];

            _this.bind();
            _this.create();
        }

        _this.bind = function() {

        }

        scope.setPrecision = function(number) {
            scope.settings.precision = number;
            scope.reset();
        }

        var rotateColoursInterval = null;

        scope.enableRotateColours = function(enable) {
            scope.settings.enableRotateColours = enable;
            clearInterval(rotateColoursInterval);

            if (enable) {
                rotateColoursInterval = setInterval(_this.shiftColours, scope.settings.rotateColoursDuration / (scope.settings.precision || 1));
            }
        }

        _this.shiftColours = function() {

            if (scope.settings.rotateColoursL2R) {
                rainbowFirst = rainbow.pop();
                rainbow.unshift(rainbowFirst);

                rainbowHighlightsFirst = rainbowHighlights.pop();
                rainbowHighlights.unshift(rainbowHighlightsFirst);
            } else {
                rainbowFirst = rainbow.shift();
                rainbow.push(rainbowFirst);

                rainbowHighlightsFirst = rainbowHighlights.shift();
                rainbowHighlights.push(rainbowHighlightsFirst);
            }
        }

        scope.enableRotation = function(enable, counter) {
            scope.settings.enableRotation = enable;
            scope.settings.rotationCCW = !!counter;

            var rotation = 360;
            if (counter) { rotation = -360; }

            if (enable) {
                createjs.Tween.get(scope.gameObject, { override: true, loop: true }).to({ rotation: scope.gameObject.rotation + rotation }, scope.settings.rotationDuration);
            } else {
                createjs.Tween.get(scope.gameObject, { override: true }).set({ rotation: 0 });
            }
        }

        var rainbow = [];
        var rainbowHighlights = [];

        scope.setPrecision = function(number) {
            scope.settings.precision = number || 64;

            _this.create();
        }

        _this.create = function() {

            // create rainbow 
            rainbow = generateRainbowColorArray(scope.settings.precision);
            rainbowHighlights = generateRainbowColorArray(scope.settings.precision, null, 350, 256);
        }

        var loopIndex = 0;
        var preAudioData = [];
        scope.update = function(analyzer) {

            // Left Channel
            for(loopIndex = 0; loopIndex < 8; loopIndex++) {
                preAudioData[loopIndex] = analyzer[loopIndex];
            }

            // Right Channel
            for(loopIndex; loopIndex < 16; loopIndex++) {
                preAudioData[loopIndex] = analyzer[loopIndex + 56];
            }

            let channel = scope.settings.channel;
            let reverse = scope.settings.channel_reverse;
            let option = 'NORMAL'

            if(scope.settings.channel_render === 1) { option = "MIRROR"; }
            if(scope.settings.channel_render === 2) { option = "REPEAT"; }

            data = ARTHESIAN.Audio.ChannelMixer.processAudioData(preAudioData, true, channel, option, reverse) // [];

            data = data.interpolate(scope.settings.precision);

            _this.draw(data);
        }

        _this.draw = function(data) {

            if (!scope.settings.enabled) {
                return;
            }

            scope.gameObject.removeAllChildren();

            var container = new createjs.Container();

            // Hide no Sound fade settings
            if (!!scope.settings.hideNoSound) {
                if (!_this.variables.hideNoSoundTimeout && !ARTHESIAN.Audio.Source.hasSound) {
                    _this.variables.hideNoSoundTimeout = setTimeout(function() {
                        createjs.Tween.get(scope.gameObject, { override: true }).to({ alpha: 0 }, scope.settings.hideNoSoundFadeDuration).call(function() {
                            _this.variables.hidden = true;
                        });
                    }, scope.settings.hideNoSoundDelay);
                } else if (_this.variables.hideNoSoundTimeout && ARTHESIAN.Audio.Source.hasSound) {
                    clearTimeout(_this.variables.hideNoSoundTimeout);
                    _this.variables.hideNoSoundTimeout = null;
                    _this.variables.hidden = false;
                    createjs.Tween.get(scope.gameObject, { override: true }).to({ alpha: 1 }, scope.settings.hideNoSoundFadeDuration);
                }
            } else if (_this.variables.hideNoSoundTimeout && _this.variables.hideNoSoundTimeout) {
                clearTimeout(_this.variables.hideNoSoundTimeout);
                _this.variables.hideNoSoundTimeout = null;
                _this.variables.hidden = false;
                createjs.Tween.get(scope.gameObject, { override: true }).to({ alpha: 1 }, scope.settings.hideNoSoundFadeDuration);
            }

            if (_this.variables.hidden) {
                return;
            }
            // End of Hide no sound fade settings

            var totalWidth = (data.length * (scope.settings.barGap)) - scope.settings.barGap; // subtract one barGap :)

            container.width = totalWidth;

            if (!scope.settings.circleMode) {
                container.regX = (totalWidth / 2);
            }

            scope.gameObject.x = (scope.settings.barsHorizontalPosition / 200) * scope.canvas.width + (scope.canvas.width * 0.5);
            scope.gameObject.y = (scope.settings.barsVerticalPosition / 200) * scope.canvas.height + (scope.canvas.height / 2);

            var minLength = 120;

            var rainbow = generateRainbowColorArray(8, 8, 32);

            for (var x = rainbow.length - 1; x > 0; x--) {
                var shape = createBlob(data, 25 + x * 2, minLength - x * 3, rainbow[x]);
                container.addChild(shape);
            }

            var baseShape = createBlob(data, 25, minLength, "white");

            container.addChild(baseShape);


            scope.gameObject.addChild(container);

            scope.stage.addChild(scope.gameObject);
        }

        var rotation;
        var radians;
        var length;
        var createBlobX;
        var createBlobY;
        function createBlob(data, strength, minLength, color) {
            var rdata = [];
            var deg = 360 / (data.length || 1);

            for (var x = 0; x < data.length; x++) {

                rotation = deg * 0.5 + (x * deg);
                radians = Math.PI / 180 * rotation;
                length = (data[x] * strength) + minLength;

                createBlobX = length * Math.cos(radians);
                createBlobY = length * Math.sin(radians);

                rdata.push({ x: createBlobX, y: createBlobY });
            }

            var shape = new createjs.Shape();
            shape.graphics.beginFill(color).setStrokeStyle(strength).beginStroke(color);
            drawPoints(shape, rdata);
            shape.graphics.quadraticCurveTo(rdata[rdata.length - 1].x, rdata[rdata.length - 1].y, rdata[0].x, rdata[0].y);
            shape.graphics.closePath();

            shape.rotation = scope.settings.rotation;

            return shape;
        }

        function drawPoints(s, points) {
            // move to the first point
            s.graphics.moveTo(points[0].x, points[0].y);
            //s.graphics.moveTo(points[points.length - 1].x, points[points.length - 1].y);

            for (i = 1; i < points.length; i++) {

                if(i == 0 || i == points.length - 1) {
                    var xc = (points[i].x + points[points.length - 1].x) / 2;
                    var yc = (points[i].y + points[points.length - 1].y) / 2;
                } else {
                    var xc = (points[i].x + points[i + 1].x) / 2;
                    var yc = (points[i].y + points[i + 1].y) / 2;
                }
                s.graphics.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
            }
        }

        function generateRainbowColorArray(length, phase, center, width) {
            phase = phase || 5.9;
            center = center || 128;
            width = width || 256;
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