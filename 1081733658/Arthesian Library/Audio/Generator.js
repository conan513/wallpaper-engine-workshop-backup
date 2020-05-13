'use strict';

/**
 * Arthesian's Audio generator module
 * 
 * @uses ARTHESIAN.Helper.Array
 * @uses createjs.Tween
 * 
 * @returns {AudioGenerator} Instance of an Audio data generator
 */

var ARTHESIAN = ARTHESIAN || {};
ARTHESIAN.Audio = ARTHESIAN.Audio || {};
ARTHESIAN.Audio.Generator = function () {

    var _enabled = true;
    var _idleAnimationStrengthMultiplier = 1;
    var _idleMovementSpeedMultiplier = 1;

    // Declare a scope for Visualizer
    var _ = {
        set enabled(val) {
            _enabled = val;

            console.log(`Set Equalizer 'Enabled' to ${_enabled}`);
        },
        set idleAnimationStrengthMultiplier(val) {
            _idleAnimationStrengthMultiplier = val;

            console.log(`Set Idle Animation Strength Multiplier to ${_idleAnimationStrengthMultiplier}x`);
        },
        set idleMovementSpeedMultiplier(val) {
            _idleMovementSpeedMultiplier = val;

            console.log(`Set Idle Movement Strength Multiplier to ${_idleMovementSpeedMultiplier}x`);
        }
    };

    // Private variables
    var moduleName = 'ARTHESIAN.Audio.Generator';
    var intervalReference;
    var transitionAudioData = [];

    // Audio sets
    var emptyAudioSet = [0, 0, 0, 0, 0, 0, 0, 0];
    var bassAudioSet = [0.5, 2, 0.5, 0.1, 0.3, 0.2, 0.1, 0.05]
    var randomAudioSets = [
        [0.2, 0.4, 0.3, 0.1, 0.8, 0.5, 0.1, 0.02],
        [0.15, 0.2, 0.1, 0.4, 0.2, 0.6, 0.2, 0.2],
        [0.35, 0.15, 0.4, 0.7, 0.55, 0.3, 0.15, 0.6],
        [0.2, 0.45, 0.35, 0.4, 0.7, 0.35, 0.01, 0.01],
        [0.3, 0.05, 0.25, 0.15, 0.9, 0.15, 0.5, 0.1],
        [0.03, 0.25, 0.15, 0.05, 0.2, 0.25, 0.1, 0.01],
    ];

    /**
     * @private 
     * 
     * Initialization function
     */
    var init = function () {
        transitionAudioData = emptyAudioSet;

        // Check whether all dependencies are loaded
        var dependenciesLoaded = checkDependencies();

        // If not all dependencies are loaded, disable this module
        if(!dependenciesLoaded) {
            console.warn(`'${moduleName}' failed to load all dependencies. It will be disabled.`);
            _enabled = false;
        }
    }

    /**
     * @private
     * 
     * Check if all dependencies are loaded
     * 
     * @returns {boolean} Whether all dependencies where available or not
     */
    var checkDependencies = function(){
        
        // Check if the Helper.Array module is loaded
        if(!ARTHESIAN.Helper.checkDependency(['ARTHESIAN', 'Helper', 'Array', 'interpolate'])) {
            console.error(`'${moduleName}' depends upon the module 'ARTHESIAN.Helper.Array'. Please load the appropiate files.`);
            return false;
        }

        // Check if the EventBus module is loaded
        if(!ARTHESIAN.Helper.checkDependency(['ARTHESIAN', 'EventBus'])) {
            console.warn(`'${moduleName}' uses the 'ARTHESIAN.EventBus' to fire events. It will still work without the EventBus, but listeners will never receive data.`);
        }
        
        // Check if the createjs library is loaded
        if(!ARTHESIAN.Helper.checkDependency(['createjs', 'Tween'])) {
            console.warn(`'${moduleName}' uses the 'createjs.Tween' to smooth the generated audio data. It will still work without the smoothing, but >>WILL<< look crappy.`);
        }

        // Return true if everything is available
        return true;
    }

    /**
     * @public
     * 
     * Start the generation of Audio data
     */
    _.start = function () {

        // First stop ( if running )
        _.stop();

        // Start interval at 100ms to change the audio data set
        setInterval(() => {
            generateAudio();
        }, 50);
    }

    /**
     * @public 
     * 
     * Stop the generation of Audio data
     */
    _.stop = function () {

        // If there is already an interval running, clear it
        if (intervalReference) {
            clearInterval(intervalReference);
        }
    }

    /**
     * Validate the length of the supplied length paramater
     * 
     * @default 128
     * 
     */
    var validateAudioDataLength = function (length) {

        // Check if the length is an odd number
        if (!length || length % 2 !== 0) {
            length = 128;
        }

        return length;
    }

    /**
     * @public
     * 
     * Retrieve a new set of Audio data
     * 
     * @param {number} length Amount of samples to retrieve
     * @param {boolean} is2channels If it's stereo or mono channel
     * 
     * @returns {Array} Audio data array
     */
    _.getRandomAudioData = function (length, is2channels) {

        if(!_enabled) {
            return _.getIdleAudioData(length);
        }

        // Validate the supplied length
        length = validateAudioDataLength(length);

        // If 2 channels, create twice at half length
        if (is2channels) {

            // Divide the length by 2
            var length = length / 2;

            // Create left and right channel data
            var leftChannel = ARTHESIAN.Helper.Array.interpolate(transitionAudioData, length);
            var rightChannel = ARTHESIAN.Helper.Array.interpolate(transitionAudioData, length);

            // Merge left and right channel together
            leftChannel.push(...rightChannel);

            // Return the merged audio data
            return leftChannel;
        }

        // Return interpolated audio set
        return ARTHESIAN.Helper.Array.interpolate(transitionAudioData, length);
    }

    /**
     * Retrieve a new set of audio data for the Idle animation
     * 
     * @param {any} length Amount of samples to retrieve
     */
    var inactiveAudioData = [];
    _.getIdleAudioData = function (length, strength) {

        strength = strength || 1;

        // Validate the supplied length
        length = validateAudioDataLength(length);

        inactiveAudioData = [];
        for (var x = 0; x < length; x++) {

            // Generate Sinus based value
            var idleValue = strength * (Math.sin(x / 5 + new Date().getTime() / 2000 * _idleMovementSpeedMultiplier) + 1);

            // Push it to the inactive audio data array
            inactiveAudioData.push(_idleAnimationStrengthMultiplier * idleValue);
        }

        // Return the audio data array
        return inactiveAudioData;
    }

    /**
     * @private
     * @default
     */
    var generateCount = 0;

    /**
     * @private
     * 
     * Method that generates 'realistic' looking audio data
     */
    var generateAudio = function () {
        var randomIndex = Math.round(Math.random() * randomAudioSets.length);

        // Check wheter it's just before every other 'bass' line
        var isBeforeBass = ((generateCount % 20) + 1) == 20;

        // If it's before a bass, empty the data
        var toSet = isBeforeBass ? emptyAudioSet : randomAudioSets[randomIndex];

        // Every 5th set ( halve a second ) should be a Bass
        if (generateCount % 10 == 0) {
            toSet = bassAudioSet;
        }

        // Tween the current set to the new selected set ( note: over 60ms, to have a 10ms overshoot )
        if(createjs && createjs.Tween) {
            createjs.Tween.get(transitionAudioData, {
                override: true
            }).to(toSet, 60);
        }

        // Add to the counter
        generateCount++;
    }

    // Call init
    init();

    // Return the current scope
    return _;
};