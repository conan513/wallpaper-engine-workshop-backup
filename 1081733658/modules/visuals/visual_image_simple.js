;
'use strict';

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

    visualisations.image = visualisations.image || {};

    /**
     * Bar Visualisations
     * This is the 'simple' bar visual
     * 
     * @param {any} id 
     * @param {any} settings 
     * @returns 
     */
    visualisations.image.simple = function(id, settings) {

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
            enabled: true,
            shadow: false,
            shadowColor: "white",
            shadowSize: 10,

            image_offset_x : 100,
            image_offset_y : 100,

            image_max_height: 0
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

            scope.parent.clearCanvas();

            console.log(`Enabled visual image foreground: ${enable}`)
        }

        var tempImg;
        /**
         * Set a new image
         * 
         * @param {any} url 
         * @returns 
         */
        scope.setImage = function(url, isHtmlNode) {

            if(isHtmlNode) {
                if (_this.variables.image) {
                    _this.variables.previousImage = _this.variables.image;
                }

                if(scope.settings.enableDistort) {
                    _this.setImageCorruptedDataUrl(tempImg.image);
                }

                var domElement = new createjs.DOMElement(url);

                _this.variables.image = domElement;
                _this.variables.image.image = url;

                return;
            }

            if (!url) {
                _this.variables.image = null;

                if (tempImg) {
                    tempImg.onload = null;
                }

                return;
            }

            tempImg = new createjs.Bitmap(url);

            tempImg.image.onload = function() {

                tempImg.regX = tempImg.image.width / 2;
                tempImg.regY = tempImg.image.height / 2;

                tempImg.origRegX = tempImg.regX;
                tempImg.origRegY = tempImg.regY;

                _this.variables.image = tempImg;
            }
        }

        /**
         * Scale the image based on the audio data provided
         * 
         * @param {any} img 
         */
        _this.scaleImage = function(img) {

            if(scope.settings.image_max_height && img.image.height != scope.settings.image_max_height) {
                let scale = scope.settings.image_max_height / (img.image.height || 1);

                img.scaleX = img.scaleY = scale;
            } else {
                img.scaleX = img.scaleY = 1;
            }
        }

        /**
         * Update method that receives the audio data from Wallpaper Engine
         * 
         * @param {any} data 
         */
        scope.update = function(data) {

            _this.draw();
        }

        /**
         * Draw method for this Visual
         * 
         * @returns 
         */
        let draw_midx;
        let draw_midy;
        _this.draw = function() {

            // clear the gameObject before drawing
            // NOTE: for better performance, don't clear children, and instead use a reference to the created children instead
            scope.gameObject.removeAllChildren();

            if (!scope.settings.enabled) {
                return;
            }

            // Get Image
            if (!!_this.variables.image) {
                
                _this.scaleImage(_this.variables.image);

                scope.gameObject.addChild(_this.variables.image);
            }

            draw_midx = scope.canvas.width * 0.5;
            draw_midy = scope.canvas.height * 0.5;

            scope.gameObject.x = (draw_midx / 100 * scope.settings.image_offset_x) + draw_midx;
            scope.gameObject.y = (draw_midy / 100 * scope.settings.image_offset_y) + draw_midy;
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