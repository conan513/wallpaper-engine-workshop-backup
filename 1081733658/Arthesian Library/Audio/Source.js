'use strict';

/**
 * Arthesian's Source module
 * 
 * @returns {Source} Source instance for Audio
 */
var ARTHESIAN = ARTHESIAN || {};
ARTHESIAN.Audio = ARTHESIAN.Audio || {}
ARTHESIAN.Audio.Source = (function () {

    var _enabled = true;
    var _silent = true;

    // Define scope
    var _ = {
        set enabled(val) {
            _enabled = val;

            console.log(`Set Audio Source 'Enabled' to ${val}`);
        },
        get hasSound() { return !_silent; }
    };

    // Private variables
    var moduleName = 'ARTHESIAN.Audio.Source';

    // Audio Transformers
    _.equalizer;
    _.generator;
    _.idleHandler;

    /**
     * @private
     * 
     * Initialization
     */
    var init = function() {

        // Check whether all dependencies are loaded
        var dependenciesLoaded = checkDependencies();

        // If not all dependencies are loaded, disable this module
        if(!dependenciesLoaded) {
            console.warn(`'${moduleName}' failed to load all dependencies. It will be disabled.`);
            _enabled = false;
        }

        startBassOffsetTween();

        // Trigger complete
        triggerEvent('Source:initCompleted');
    }

    /**
     * @private
     * 
     * Check if all dependencies are loaded
     * 
     * @returns {boolean} Whether all dependencies where available or not
     */
    var checkDependencies = function(){

        // Check for WE_Handler
        if(!ARTHESIAN.Helper.checkDependency(['ARTHESIAN', 'Audio', 'WE_Handler'])) {
            console.error(`'${moduleName}' depends upon the module 'ARTHESIAN.Audio.WE_Handler'. Please load the appropiate files.`);
            return false;
        }
    
        // Check if the Helper.Array module is loaded
        if (!ARTHESIAN.Helper.checkDependency(['ARTHESIAN', 'Audio', 'Generator'])) {
            console.warn(`'${moduleName}' uses upon the module 'ARTHESIAN.Audio.Generator'. Generating Audio data will not be possible unless the module is loaded.`);
        }else{
            _.generator = new ARTHESIAN.Audio.Generator();
        }

        // Check if the EventBus module is loaded
        if (!ARTHESIAN.Helper.checkDependency(['ARTHESIAN', 'Audio', 'Equalizer'])) {
            console.warn(`'${moduleName}' uses the 'ARTHESIAN.Audio.Equalizer'. Equalizer will not work unless the module is loaded.`);
        }else{
            _.equalizer = new ARTHESIAN.Audio.Equalizer();
        }

        // Check if the EventBus module is loaded
        if (!ARTHESIAN.Helper.checkDependency(['ARTHESIAN', 'Audio', 'IdleHandler'])) {
            console.warn(`'${moduleName}' uses the 'ARTHESIAN.Audio.IdleHandler'. IdleMode will not work unless the module is loaded.`);
        }else{
            _.idleHandler = new ARTHESIAN.Audio.IdleHandler();
        }

        // Check if the EventBus module is loaded
        if(!ARTHESIAN.Helper.checkDependency(['ARTHESIAN', 'EventBus'])) {
            console.warn(`'${moduleName}' uses the 'ARTHESIAN.EventBus' to fire events. It will still work without the EventBus, but listeners will not receive data.`);
        }

        // Return true if everything is available
        return true;
    }

    var _data = [];
    var _rawData = [];
     /**
     * Get Audio data
     * 
     * @param {any} length The length of the audio data set
     * @param {boolean} raw Skip all processing, and return the raw audio data
     * @returns {array<Number>} Array of audio representitive numbers
     */
    _.getWallpaperEngineAudioData = function (length, raw) {

        // Use the current transition data
        _data = ARTHESIAN.Audio.WE_Handler.getAudioData();
        _rawData = _data;

        // If no data, log error
        if (!_data.length) { console.error(`No audio data was found, please check the Wallpaper Engine Audio Listener!`); }

        // Set boolean for other libs to check if there was sound or not
        if (ARTHESIAN.Helper.Array.average(_data) < 0.01) {
            _silent = true;
        } else {
            _silent = false;
        }

        // Skip all processing
        if(!_enabled) { return _data; }

        // Get the requested length or use default length
        length = length || _data.length;

        // When generator is enabled, generate audio _data
        if (!raw && _.useGenerator && ARTHESIAN.Audio.Generator) {
            _data = _.generator.getRandomAudioData(length, true);
        }

        // When equalizer is enabled, pass through EQ
        if (!raw && _.useEqualizer && ARTHESIAN.Audio.Equalizer) {
            _data = _.equalizer.processAudioData(_data, true);
        }

        // When idlehandler is loaded, check for idle state
        if (ARTHESIAN.Audio.IdleHandler) {
            _data = _.idleHandler.processAudioData(_data);
        }

        // If the data length is not equal to requested length, interpolate to correct length
        if (_data.length != length) {
            _data = ARTHESIAN.Helper.Array.interpolate(_data, length);
        }

        // Return data
        return _data;
    }

    var bassValue = 0;
    _.getBaseMultiplier = function(minSample, maxSample, useManipulatedData) {

        minSample = minSample || 0;
        maxSample = maxSample || 6;

        bassValue = 0;

        //let data = _.getWallpaperEngineAudioData(null, true);

        // Create a sum of the samples
        for (let x = minSample; x < maxSample; x++) {
            if(useManipulatedData) {
                bassValue += _data[x] + _data[x + _data.length / 2];
            } else {
                bassValue += _rawData[x] + _rawData[x + _rawData.length / 2];
            }
        }

        bassValue /= (maxSample - minSample);
        bassValue /= 2;

        // Some arbritary bassValueber

        if(_.idleHandler.isIdle && WALLPAPER.visualizer.settings.idleAnimationIgnoresEffects) { return 1; }

        return bassValue + 1;
    }

    var bassOffsetX = { value: 0 }
    var bassOffsetY = { value: 0 }
    /**
     * The rotation tween is constantly running, but only has effect if the setting is turned on
     * 
     */
    var startBassOffsetTween = function() {

        let maxXOffset = 22;
        let maxYOffset = 27;

        createjs.Tween.get(bassOffsetX, { override: true, loop: true }).to({ value: -maxXOffset }, 50, createjs.Ease.sineInOut).to({ value: maxXOffset }, 50, createjs.Ease.sineInOut);
        createjs.Tween.get(bassOffsetY, { override: true, loop: true }).to({ value: -maxYOffset }, 44, createjs.Ease.sineInOut).to({ value: maxYOffset }, 44, createjs.Ease.sineInOut);
    }

    var _bassOffsetReturnObject = { x : 0, y: 0 };
    _.getBassOffsetValues = function(strength) {
        
        _bassOffsetReturnObject.x = bassOffsetX.value * strength;
        _bassOffsetReturnObject.y = bassOffsetY.value * strength;
        
        return _bassOffsetReturnObject; //{ x: bassOffsetX.value * strength, y : bassOffsetY.value * strength };
    }

    /**
     * @private
     * 
     * Trigger events on the EventBus for other objects to listen to
     * 
     * @param {String} name Name of the event to trigger
     * @param {Object} data [Optional] Additional data to send
     */
    var triggerEvent = function(name, data) {
        if(ARTHESIAN.EventBus) {
            ARTHESIAN.EventBus.trigger(name, { sender: _, data : data });
        }
    }
    
    // Call initialization
    init();

    // return the scope
    return _;

})();