;

var visualisations = (function($, createjs, document, visualisations, undefined) {

    visualisations.bar = visualisations.bar || {};

    /**
     * Rainbow Bar visual ( Simple Lines )
     * 
     * @param {any} id 
     * @param {any} settings 
     * @returns 
     */
    visualisations.bar.rainbow = function(id, settings) {

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
            hidden: false,
            rotation: 0,
        }

        // The default values ( which can be overriden by supplied settings )
        var _DEFAULTS = {
            precision: 64, // Number of 'samples' taken from the song each frame ( lower this if you have issues with performance )

            enabled: true,

            strengthMultiplier: 100,

            barGap: 20,
            barWidth: 5,

            color: null,
            alpha: 1,

            barsVerticalPosition: 0, // percentage from top
            barsHorizontalPosition: 0,

            hideNoSound: false,
            hideNoSoundFadeDuration: 500,
            hideNoSoundDelay: 2000,

            rotation: 0,

            lineCapsType: 1,
            heightLimit: 0,

            verticalGrowthOffset: 100,

            enableSplit: false,
            splitAlpha: 0.3,

            enableRotateColours: false,
            rotateColoursDuration: 1,
            rotateColoursL2R: false,
            reverseRainbow: false,

            circleMode: false,
            circleSize: 200,
            arc_degrees: 360,

            enableRotation: false,
            rotationCCW: false,
            rotationDuration: 10000, // 10 seconds

            channel: "STEREO", // LEFT / RIGHT
            channel_render: 0,
            channel_reverse: false,

            enableBorder: false,
            borderWidth: 2,
            borderAlpha: 0.5,
            borderColor: "rgb(0,0,0)",

            enableCustomGradient: false,


            drawMode: "bar",
            spline_empty_endpoints: false,
            spline_layers: 1,
            spline_fill_alpha: 0,
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
            grid = [];
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
                _this.variables.rotation = 0;
                createjs.Tween.get(_this.variables, { override: true, loop: true }).to({ rotation: rotation }, scope.settings.rotationDuration);
            } else {
                createjs.Tween.get(_this.variables, { override: true }).set({ rotation: 0 });
            }
        }

        var customGradientMorpher;
        scope.setCustomGradient = function(colorObject) {
            var morpher = new ARTHESIAN.Helper.Colour.Morpher();

            for(var x = 1; x <= colorObject.count; x++) {
                morpher.setHEXColour(colorObject[`color${x}`], colorObject[`color${x}position`]);
            }

            customGradientMorpher = morpher;  
            
            scope.createCustomGradient();
        }

        scope.createCustomGradient = function(){
            customGradient = [];

            if(!customGradientMorpher || !customGradientMorpher.colours.length) { return; }

            var part = 100 / scope.settings.precision;
            for(var x = 0; x < scope.settings.precision; x++){
                customGradient.push(customGradientMorpher.getRGBColourString(x * part));
            }
        }

        var customGradient = [];
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
            scope.createCustomGradient();
        }

        var _option;
        var _data;
        scope.update = function(analyzer) {

            _option = 'NORMAL'

            if(scope.settings.channel_render === 1) { _option = "MIRROR"; }
            if(scope.settings.channel_render === 2) { _option = "REPEAT"; }

            _data = ARTHESIAN.Audio.ChannelMixer.processAudioData(analyzer, true, scope.settings.channel, _option, scope.settings.channel_reverse) // [];

            if(!_data.length) { return; }

            _data = _data.interpolate(scope.settings.precision);

            _this.draw(_data);
        }

        var draw_container;
        var draw_totalWidth;
        var draw_spacing;
        var draw_bar;
        var draw_length;
        var draw_color;
        var draw_startPoint;
        var draw_startPointX;
        var draw_endPoint;
        var draw_border;
        var draw_borderColor;
        var draw_borderWidth;
        var draw_rgbaColor;
        _this.draw = function(data) {

            if (!scope.settings.enabled) {
                return;
            }

            scope.gameObject.removeAllChildren();

            draw_container = new createjs.Container();

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

            draw_totalWidth = (data.length * (scope.settings.barGap)) - scope.settings.barGap; // subtract one barGap :)

            draw_container.width = draw_totalWidth;

            if (!scope.settings.circleMode) {
                draw_container.regX = (draw_totalWidth / 2);
            }

            scope.gameObject.x = (scope.settings.barsHorizontalPosition / 200) * scope.canvas.width + (scope.canvas.width * 0.5);
            scope.gameObject.y = (scope.settings.barsVerticalPosition / 200) * scope.canvas.height + (scope.canvas.height / 2);

            draw_spacing = scope.settings.barGap;

            if(scope.settings.drawMode == "spline") {
                drawSpline(data);
            } else {          
                drawBars(data);
            }

            draw_container.alpha = scope.settings.alpha;
            draw_container.rotation = scope.settings.rotation + _this.variables.rotation + (180 + scope.settings.arc_degrees * -0.5);

            scope.gameObject.addChild(draw_container);

            scope.stage.addChild(scope.gameObject);
        }

        var spline_layers;
        var spline_colorArray;
        var spline_colorStep;
        var spline_growthOffsetMultiplierTop;
        var spline_growthOffsetMultiplierBot;
        var spline_fraction;
        var spline_loopCounter;
        var spline_color;
        var spline_dataPoints
        function drawSpline(data) {

            spline_layers = scope.settings.spline_layers;
            
            if(scope.settings.spline_empty_endpoints) {
                data.unshift(0);
                data.push(0);
            }
            
            spline_colorArray = rainbow;
            spline_colorStep = Math.floor(rainbow.length / spline_layers);

            if(scope.settings.enableCustomGradient && customGradient.length) {
                Math.floor(customGradient.length / spline_layers);
                spline_colorArray = customGradient;
            }

            spline_growthOffsetMultiplierTop = ((scope.settings.verticalGrowthOffset) / 100)
            spline_growthOffsetMultiplierBot = ((200 - scope.settings.verticalGrowthOffset) / 100)

            for(spline_loopCounter = 0; spline_loopCounter < spline_layers; spline_loopCounter++) {

                spline_fraction = (spline_layers - spline_loopCounter) / spline_layers;
                spline_color = scope.settings.color || spline_colorArray[spline_colorStep * spline_loopCounter];

                let shape = new createjs.Shape();

                if(scope.settings.spline_fill_alpha > 0) {
                    shape.graphics.f(spline_color);
                    shape.alpha = scope.settings.spline_fill_alpha / 100;
                }

                if(scope.settings.circleMode) {
                    ARTHESIAN.Helper.drawBlob(shape, data, scope.settings.strengthMultiplier * spline_fraction, scope.settings.circleSize, scope.settings.heightLimit);
                    shape.rotation = scope.settings.rotation - 90;
                    draw_container.addChild(shape);

                    if(scope.settings.enableBorder && scope.settings.borderWidth) {
                        let border = new createjs.Shape();
                        
                        border.graphics.ss(scope.settings.borderWidth);
                        border.graphics.s(scope.settings.borderColor);
                        
                        ARTHESIAN.Helper.drawBlob(border, data, scope.settings.strengthMultiplier * spline_fraction, scope.settings.circleSize, scope.settings.heightLimit);

                        border.alpha = scope.settings.borderAlpha;
                        border.rotation = scope.settings.rotation - 90;

                        draw_container.addChild(border);
                    }    

                } else{

                    spline_dataPoints = [];

                    data.forEach((d, i) => {
                        spline_dataPoints.push({ x: draw_spacing * i, y: d * scope.settings.strengthMultiplier * spline_growthOffsetMultiplierTop * spline_fraction });
                    })

                    for(let i = data.length; i >= 0; i--) {
                        spline_dataPoints.push({ x: draw_spacing * i, y: -data[i] * scope.settings.strengthMultiplier * spline_growthOffsetMultiplierBot * spline_fraction });
                    }

                    ARTHESIAN.Helper.drawPoints(shape, spline_dataPoints);

                    draw_container.addChild(shape);

                    if(scope.settings.enableBorder && scope.settings.borderWidth) {
                        let border = new createjs.Shape();
                        
                        border.graphics.ss(scope.settings.borderWidth);
                        border.graphics.s(scope.settings.borderColor)

                        ARTHESIAN.Helper.drawPoints(border, spline_dataPoints);

                        border.alpha = scope.settings.borderAlpha;
                        //border.rotation = scope.settings.rotation - 90;

                        draw_container.addChild(border);
                    }    
                }

            }
        }

        function drawBars(data) {

            draw_startPointX = scope.settings.barWidth / 2;
            
            for (x = 0; x < data.length; x++) {
                draw_bar = new createjs.Shape();

                draw_bar.x = x * draw_spacing;
                draw_bar.regX = draw_startPointX;

                draw_length = data[x] * (scope.settings.strengthMultiplier);

                if (scope.settings.heightLimit && draw_length > scope.settings.heightLimit) {
                    draw_length = scope.settings.heightLimit;
                }

                draw_color = scope.settings.color || rainbow[x];

                if (scope.settings.reverseRainbow) {
                    draw_color = scope.settings.color || rainbow[data.length - (x + 1)];
                }

                if(scope.settings.enableCustomGradient && customGradient.length) {
                    draw_color = customGradient[x];
                }

                draw_startPoint = ((200 - scope.settings.verticalGrowthOffset) / 100) * draw_length;
                draw_endPoint = (scope.settings.verticalGrowthOffset / 100) * draw_length;

                if (scope.settings.enableBorder) {
                    draw_border = new createjs.Shape();
                    draw_border.x = draw_bar.x;
                    draw_border.regX = draw_startPointX;
                    draw_border.alpha = scope.settings.borderAlpha;

                    draw_borderColor = scope.settings.borderColor || rainbow[x];

                    if(scope.settings.enableCustomGradient && customGradient.length) {
                        draw_borderColor = scope.settings.borderColor || customGradient[x];
                    }

                    draw_borderWidth = scope.settings.barWidth + scope.settings.borderWidth * 2;

                    if (scope.settings.enableSplit) {
                        draw_rgbaColor = draw_borderColor.replace(")", "," + scope.settings.splitAlpha + ")").replace("rgb", "rgba");
                        draw_border.graphics.ss(draw_borderWidth, scope.settings.lineCapsType).s(draw_borderColor).mt(draw_startPointX, -draw_startPoint).lt(draw_startPointX, 0).s(draw_rgbaColor).mt(draw_startPointX, -draw_startPoint).lt(draw_startPointX, draw_endPoint);
                    } else {
                        draw_border.graphics.ss(draw_borderWidth, scope.settings.lineCapsType).s(draw_borderColor).mt(draw_startPointX, -draw_startPoint).lt(draw_startPointX, draw_endPoint);
                    }

                    if (scope.settings.circleMode) {
                        draw_border.rotation = scope.settings.arc_degrees * (x / scope.settings.precision);
                        draw_border.regY += scope.settings.circleSize;
                        draw_border.x = 0;
                        // draw_border.regX = scope.settings.barWidth / 2;
                    }

                    draw_container.addChild(draw_border);
                }

                if (scope.settings.enableSplit) {
                    draw_rgbaColor = draw_color.replace(")", "," + scope.settings.splitAlpha + ")").replace("rgb", "rgba");
                    draw_bar.graphics.ss(scope.settings.barWidth, scope.settings.lineCapsType).s(draw_color).mt(draw_startPointX, -draw_startPoint).lt(draw_startPointX, 0).s(draw_rgbaColor).mt(draw_startPointX, -draw_startPoint).lt(draw_startPointX, draw_endPoint);
                } else {
                    draw_bar.graphics.ss(scope.settings.barWidth, scope.settings.lineCapsType).s(draw_color).mt(draw_startPointX, -draw_startPoint).lt(draw_startPointX, draw_endPoint);
                }

                if (scope.settings.circleMode) {
                    draw_bar.rotation = scope.settings.arc_degrees * (x / scope.settings.precision);
                    draw_bar.regY += scope.settings.circleSize;
                    draw_bar.x = 0
                    // draw_bar.regX = scope.settings.barWidth / 2;
                }

                draw_container.addChild(draw_bar);
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