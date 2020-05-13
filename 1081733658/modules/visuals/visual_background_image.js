;

var visualisations = (function($, createjs, document, visualisations, undefined) {

    visualisations.background = visualisations.background || {};

    /**
     * Extensive Visual that makes it possible to apply effects on background images
     * 
     * @param {any} id 
     * @param {any} visualizer 
     * @param {any} settings 
     * @returns 
     */
    visualisations.background.image = function(id, visualizer, settings) {

        // Declare a scope for Visualizer
        var scope = {};

        scope.id = id;

        // Bind 'this'
        var _this = this;

        // Private variables for within the plugin only ( no user/ code interaction )
        _this.variables = {
            video: document.getElementById("background-video"),
            image: null,
            previousImage: null,
            imageRotation: 0,
            hueShiftBass: 0,
            hueShiftBassResetTimout: null
        }

        // The default values ( which can be overriden by supplied settings )
        var _DEFAULTS = {
            enabled: true,

            strengthMultiplier: 1,

            effectsEnabled: true,

            rotationEnabled: false,
            rotationSpeedMultiplier: 1,
            rotationStrengthMultiplier: 1,

            scaleEnabled: false,
            scaleStrengthMultiplier: 1,

            blurEnabled: true,
            blurStrengthMultiplier: 1,

            lightEnabled: false,
            lightStrengthMultiplier: 1,

            hueRotate: 0,
            hueRotateEnabled: false,
            hueRotateStrengthMultiplier: 1,

            hueRotationEnabled: false,
            hueRotationDuration: 10000,

            hueShiftBassEnabled: false,
            hueShiftBassStrengthMultiplier: 1,

            hueShiftBassReset: false,
            hueShiftBassResetTimeout: 1000,
            hueShiftBassResetDuration: 5000,

            slideshowFolderProperty: "directory",
            slideshowDurationTypeMultiplier: 1, // 1, 60, 3600 ( seconds, minutes, hours )
            slideShowFadeDuration: 3000,
            slideShowShowTime: 5000,

            pauseVideoOnIdle: false,

            scaleBackgroundToFit: false,

            set enableDistort(val) {
                _enableDistort = val;

                if(_this.variables.image) {
                    _this.setImageCorruptedDataUrl(_this.variables.image.image || _this.variables.image);
                } else {
                    _this.setImageCorruptedDataUrl(null);
                }
            },
            get enableDistort() { return _enableDistort; },

            distortBassLevel: 1,
            distortStrength: 1,
            distortErrors: 1,
            distortOpacity: 0.5
        }

        var _enableDistort = false;

        scope.canvas = null;
        scope.parent = null;

        scope.gameObject = new createjs.Container();

        scope.settings = $.extend(_DEFAULTS, settings);

        /**
         * Init method of the Visual
         * 
         */
        _this.init = function() {

            if (!createjs) { console.error("This visual requires CreateJS to operate!"); }

            scope.gameObject.name = "Visualizer Background Image";

            scope.startRotationTween();
        }

        /**
         * Reset the TimeOut ( when a user changes time based properties )
         * 
         */
        scope.resetTimeOut = function() {
            _this.setTimeout();
        }

        /**
         * Start the slideshow
         * 
         * @returns nothing if the slideshow wasn't started before, else returns itself
         */
        scope.startSlideShow = function() {

            // Don't start twice :D
            if (!!slideshowStarted) { return; }

            console.log(`Started the background slideshow`);

            slideshowStarted = true;
            scope.slideShowNext();

            return scope;
        }

        var slideshowStarted = false;
        var nextSlideTimeOut = null;

        /**
         * Timeout method for the next slide to show
         * 
         */
        _this.setTimeOut = function() {
            if (!!nextSlideTimeOut) {
                clearTimeout(nextSlideTimeOut);
            }

            nextSlideTimeOut = setTimeout(function() {

                scope.slideShowNext();

            }, scope.settings.slideShowShowTime + scope.settings.slideShowFadeDuration);
        }

        /**
         * Trigger the next slide in the slideshow
         * 
         */
        scope.slideShowNext = function() {

            // Callback method
            var imageResponse = function(propertyName, filePath) {

                var path = "file:///" + filePath;

                console.log(`Progressed the background slideshow to next image (${path})`);

                scope.setImage(path);

                _this.setTimeOut();
            }

            // Actually call 
            window.wallpaperRequestRandomFileForProperty(scope.settings.slideshowFolderProperty, imageResponse);
        }

        /**
         * Stop the slideshow ( immediately or with a fade-out effect )
         * 
         * @param {any} immediate 
         */
        scope.stopSlideShow = function(immediate) {

            console.log(`Stopped the background 'slideshow'`);

            slideshowStarted = false;

            clearTimeout(nextSlideTimeOut);

            _this.variables.previousImage = _this.variables.image;
            _this.variables.image = null;

            if (!!immediate) {
                _this.variables.previousImage = null;
                // _this.draw();
                // //scope.stage.update();
            } else {
                createjs.Tween.get(_this.variables.previousImage).to({ alpha: 0 }, scope.settings.slideShowFadeDuration).call(function() {
                    _this.variables.previousImage = null;
                });
            }
        }

        var tempImg;
        /**
         * Set a new background image ( for slideshow or static )
         * 
         * @param {any} url 
         * @param {any} immediate 
         * @returns 
         */
        scope.setImage = function(url, immediate) {

            console.log(`Set the background 'image' to : ${url}`);

            if (!url) {
                _this.variables.image = null;
                _this.setImageCorruptedDataUrl(null);

                if (tempImg) {
                    tempImg.onload = null;
                }

                scope.parent.clearCanvas();

                return;
            }

            tempImg = new createjs.Bitmap(url);

            tempImg.image.onload = function() {

                if (_this.variables.image) {
                    _this.variables.previousImage = _this.variables.image;
                }

                if(scope.settings.enableDistort) {
                    _this.setImageCorruptedDataUrl(tempImg.image);
                }

                tempImg.regX = tempImg.image.width / 2;
                tempImg.regY = tempImg.image.height / 2;

                _this.variables.image = tempImg;

                if (!immediate) {
                    _this.variables.image.alpha = 0;

                    createjs.Tween.get(_this.variables.image).to({ alpha: 1 }, scope.settings.slideShowFadeDuration).call(function() {
                    });
                    createjs.Tween.get(_this.variables.previousImage).to({ alpha: 0 }, scope.settings.slideShowFadeDuration).call(function() {
                        _this.variables.previousImage = null;
                    });
                }
            }
        }

        _this.setImageCorruptedDataUrl = function(image){

            
            if(!image) { distortedImageData = null; return; }
            
            var canvas = document.createElement('CANVAS');
            var ctx = canvas.getContext('2d');
            
            var factor = (image.height / scope.canvas.height) * 2;
            
            var iw = image.width / factor;
            var ih = image.height / factor;
            
            canvas.width = iw;
            canvas.height = ih;
            
            ctx.drawImage(image, 0, 0, iw, ih);      

            console.log(`Created a cached 'corrupted image' for the background effects`);
        
            // convert to base64
            var dataURL = canvas.toDataURL("image/jpeg", 0.8);
            distortedImageData = dataURL.replace("data:image/jpeg;base64,", "");
            canvas = null; 
        }

        var tempVid;
        /**
         * Set Video background from souce url ( also generates background image )
         * 
         * @param {any} src 
         * @returns 
         */
        scope.setVideo = function(src) {

            console.log(`Set the background 'video' to : ${src}`);

            if (!src) {
                _this.variables.previousImage = null;
                _this.variables.image = null;

                _this.setImageCorruptedDataUrl(null);

                if (tempVid) {
                    tempVid.image.oncanplay = null;
                }

                return;
            }

            var video = _this.variables.video;
            video.src = src;

            tempVid = new createjs.Bitmap(video);

            tempVid.image.oncanplay = function() {

                var cachevas = document.createElement("canvas");
                cachevas.width = tempVid.image.videoWidth;
                cachevas.height = tempVid.image.videoHeight;

                var ctx = cachevas.getContext("2d");
                ctx.drawImage(tempVid.image, 0, 0);

                var backupImg = new createjs.Bitmap(cachevas);

                _this.variables.previousImage = backupImg;

                _this.setImageCorruptedDataUrl(backupImg.image);

                tempVid.image.oncanplay = null;
            };

            _this.variables.image = tempVid;
        }

        var imgRot = { r: 0 }

        /**
         * The rotation tween is constantly running, but only has effect if the setting is turned on
         * 
         */
        scope.startRotationTween = function() {

            var deg = 15;
            var rotationSpeed = 2000;

            var mp = (1 / scope.settings.rotationSpeedMultiplier);

            rotationSpeed *= mp;

            createjs.Tween.get(imgRot, { override: true }).to({ r: -deg }, rotationSpeed, createjs.Ease.sineInOut).to({ r: deg }, rotationSpeed, createjs.Ease.sineInOut).call(scope.startRotationTween);
        }

        scope.setRotationSpeed = function(speedMultiplier) {
            scope.settings.rotationSpeedMultiplier = speedMultiplier;

            console.log(`Set the background 'rotation speed' to : ${speedMultiplier}`);

            scope.startRotationTween();
        }

        /**
         * Update method that is provided with audio data from Wallpaper Engine
         * 
         * @param {any} input
         * @returns 
         */
        scope.update = function(input) {

            if (!scope.settings.enabled) { return; }

            data = [];

            // If there is no sound ( after timeout )
            if (ARTHESIAN.Audio.Source.idleHandler.isIdle && scope.settings.pauseVideoOnIdle) {
                _this.variables.video.pause();
            } else {
                if (_this.variables.video.paused) {
                    _this.variables.video.play();
                }
            }

            for (var x = 0; x < input.length; x++) {
                data.push(input[x] * 200);
            }

            _this.draw(data);
        }

        /**
         * Scale the image based on the audio data provided
         * 
         * @param {any} img 
         * @param {any} data 
         */
        _this.scaleImage = function(img, data) {

            var scale = img.scaleX;

            var baseMultiplier = ARTHESIAN.Audio.Source.getBaseMultiplier(0, 5) - 1;
            baseMultiplier /= 10;

            baseMultiplier *= scope.settings.scaleStrengthMultiplier;

            scale += baseMultiplier;

            img.scaleX = img.scaleY = scale;
        }

        /**
         * Rotate the image based on the rotation tween that is constantly running in the background
         * 
         * @param {any} img 
         */
        _this.rotateImage = function(img) {

            rotateScaleDefault = 0.6;

            var strength_mp = scope.settings.rotationStrengthMultiplier;
            var mp = strength_mp;

            var rotateDeg = imgRot.r * mp; // 0.2 - 1.2
            var rotateScale = rotateScaleDefault * (mp * 0.8); // 0.2 - 1.2

            var scale = 1 + rotateScale;

            img.rotation = rotateDeg;

            img.scaleY = img.scaleX *= scale;
        }

        /**
         * Apply CSS filters on the background image(s)
         * 
         * @param {any} data 
         */
        _this.filterBackground = function(data) {

            var filter = scope.canvas.style.filter;
            var cssHelper = ARTHESIAN.Helper.Filter;

            // Welp, cross referencing data here --> Please fix soon xD
            if(!scope.settings.effectsEnabled || (ARTHESIAN.Audio.Source.idleHandler.isIdle && WALLPAPER.visualizer.settings.idleAnimationIgnoresEffects)) {
                
                // clean
                filter = cssHelper.removeBlur(filter);
                filter = cssHelper.removeShadow(filter);
                filter = cssHelper.removeBrightness(filter);
                filter = cssHelper.removeHueRotate(filter);
                
                return;
            }

            //grab the context from your destination canvas
            var baseMultiplier = ARTHESIAN.Audio.Source.getBaseMultiplier(0, 6) - 1;
            baseMultiplier /= 5;

            var filter = "";

            if (scope.settings.blurEnabled) {

                var blurBaseMultiplier = baseMultiplier * 25;

                var blurMultiplier = blurBaseMultiplier * scope.settings.blurStrengthMultiplier;
                filter = cssHelper.replaceBlur(filter, blurMultiplier);
            }

            if (scope.settings.lightEnabled) {

                var brightnessAddition = (baseMultiplier * baseMultiplier) * (scope.settings.lightStrengthMultiplier * scope.settings.lightStrengthMultiplier);
                brightnessAddition *= 300;
                brightnessAddition += 100;

                filter = cssHelper.replaceBrightness(filter, brightnessAddition);
            }

            var hueRotate = 0;

            if (scope.settings.hueRotate) {
                hueRotate += scope.settings.hueRotate;
            }

            if (scope.settings.hueRotateEnabled) {

                var hueBaseMultiplier = baseMultiplier * 360;

                hueBaseMultiplier *= scope.settings.hueRotateStrengthMultiplier;

                hueRotate += hueBaseMultiplier;
            }

            if (scope.settings.hueRotationEnabled) {
                hueRotate += hueRotation.offset;
            }

            if (scope.settings.hueShiftBassEnabled) {
                var hueShiftBase = Math.pow(baseMultiplier, 2) * 720;

                _this.variables.hueShiftBass += hueShiftBase * scope.settings.hueShiftBassStrengthMultiplier;
                _this.variables.hueShiftBass %= 360;

                hueRotate += _this.variables.hueShiftBass;
            }

            if (!ARTHESIAN.Audio.Source.hasSound) {
                if (!_this.variables.hueShiftBassResetTimeout) {
                    _this.variables.hueShiftBassResetTimeout = setTimeout(function() {
                        createjs.Tween.get(_this.variables).to({ hueShiftBass: 0 }, scope.settings.hueShiftBassResetDuration);
                    }, scope.settings.hueShiftBassResetTimeout);
                }
            } else if (_this.variables.hueShiftBassResetTimeout) {
                clearTimeout(_this.variables.hueShiftBassResetTimeout);
                _this.variables.hueShiftBassResetTimeout = null;
            }

            if (hueRotate) {
                filter = cssHelper.replaceHueRotate(filter, hueRotate % 360);
            }

            scope.canvas.style.filter = filter.trim();
        }

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
                createjs.Tween.get(hueRotation, { override: true, loop: true }).to({ offset: hueRotation.offset += 360 }, scope.settings.hueRotationDuration);
            } else {
                createjs.Tween.get(hueRotation, { override: true }).set({ offset: 0 });
            }
        }

        var distortedImageData;
        var distortedImage = document.getElementById("background-canvas-distorted");

        /**
         * Draw method which draws the visual to the canvas
         * 
         * @param {any} data 
         */
        _this.draw = function(data) {
            // Clean
            scope.gameObject.removeAllChildren();

            var container = new createjs.Container();


            if (!!_this.variables.previousImage) {

                ARTHESIAN.Helper.Image.scaleImageToCanvas(_this.variables.previousImage, scope.canvas, scope.settings.scaleBackgroundToFit);

                if (scope.settings.effectsEnabled && scope.settings.scaleEnabled) {
                    _this.scaleImage(_this.variables.previousImage, data);
                }

                if (scope.settings.effectsEnabled && scope.settings.rotationEnabled) {
                    _this.rotateImage(_this.variables.previousImage);
                } else {
                    _this.variables.previousImage.rotation = 0;
                }

                container.addChild(_this.variables.previousImage);
            }

            if (!!_this.variables.image) {

                ARTHESIAN.Helper.Image.scaleImageToCanvas(_this.variables.image, scope.canvas, scope.settings.scaleBackgroundToFit);

                if (scope.settings.effectsEnabled && scope.settings.scaleEnabled) {
                    _this.scaleImage(_this.variables.image, data);
                }

                if (scope.settings.effectsEnabled && scope.settings.rotationEnabled) {
                    _this.rotateImage(_this.variables.image);
                } else {
                    _this.variables.image.rotation = 0;
                }

                // _this.filterBackground(data);

                container.addChild(_this.variables.image);
            }

            //_this.filterBackground(data);

            // Distortion effect ???
            if(scope.settings.effectsEnabled && scope.settings.enableDistort && distortedImageData && distortedImage) {
                _this.distortImage(data);
            }else{
                distortedImage.style.backgroundImage = null;
            }

            // Add to object
            scope.gameObject.addChild(container);

            // Add to stage
            scope.stage.addChild(scope.gameObject);
        };

        _this.distortImage = function(data){
            var bassmp = (ARTHESIAN.Audio.Source.getBaseMultiplier(0, 6) - 1) * 2;

            var frequency = 0.5 * scope.settings.distortStrength;

            if (bassmp > scope.settings.distortBassLevel && Math.random() < frequency ) {

                var bassCorrection = bassmp - scope.settings.distortBassLevel;

                var maxErrors = (bassCorrection * 100 * scope.settings.distortErrors);
                var errors = Math.round(Math.random() * maxErrors);

                var corrupted = distortedImageData;
                
                for(var i = 0; i < errors; i++){
                    var l = 1000 + Math.round(Math.random() * (corrupted.length - 1002)); 
                    corrupted = corrupted.substr(0,l) + corrupted.charAt(l+1) + corrupted.charAt(l) + corrupted.substr(l+2);
                }
        
                distortedImage.style.backgroundImage = "url(" + "data:image/jpeg;base64," + corrupted + ")";
                distortedImage.style.opacity = scope.settings.distortOpacity * (bassCorrection * 4); 

                if(scope.settings.scaleBackgroundToFit) {
                    distortedImage.style.backgroundSize = "contain";
                }else{
                    distortedImage.style.backgroundSize = "cover";
                }

            }else{
                distortedImage.style.backgroundImage = null;
            }
        }

        /**
         * Enable or disable the background
         * 
         * @param {any} enable 
         */
        scope.Enable = function(enable) {
            scope.settings.enabled = enable;

            scope.parent.clearCanvas();

            if (!enable) {
                scope.stopSlideShow(true);
                scope.setImage(null);
            }

            console.log(`Set the background 'enabled' to : ${enable}`);
        }

        /**
         * Remove gameobject from the stage
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