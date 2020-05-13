'use strict';

/**
 * Arthesian's Equalizer module
 * 
 * @uses ARTHESIAN.Helper.Array Array Helper module
 * 
 * @event equalizer:initCompleted
 * @event equalizer:channelChange
 * @event equalizer:processedAudio
 * 
 * @returns {Equalizer} Equalizer instance for Audio
 */
var ARTHESIAN = ARTHESIAN || {};
ARTHESIAN.Audio = ARTHESIAN.Audio || {}
ARTHESIAN.Audio.Equalizer = function () {

    // Private variables
    var _enabled = true;

    var moduleName = 'ARTHESIAN.Audio.Equalizer';
    var dependenciesLoaded = false;
    var numberOfChannels = 8;
    var channelsArray;

    // Scope object with getters and setters
    var _ = {
        get channels() {

            // Return the number of channels
            return numberOfChannels; 
        },
        set channels(number) {

            // Set value
            numberOfChannels = number;

            // When the number of channels changes, create that amount of channels
            createChannels(number);
        },
        set enabled(val) {
            _enabled = val;

            console.log(`Set Equalizer 'Enabled' to ${_enabled}`);
        }
    }

    /**
     * @private
     * 
     * Initialization
     */
    var init = function() {
        // Create the (default) amount of channels
        createChannels(numberOfChannels);

        // Check whether all dependencies are loaded
        var dependenciesLoaded = checkDependencies();

        // If not all dependencies are loaded, disable this module
        if(!dependenciesLoaded) {
            console.warn(`'${moduleName}' failed to load all dependencies. It will be disabled.`);
            _enabled = false;
        }

        // Trigger complete
        triggerEvent('equalizer:initCompleted');
    }

    /**
     * @private
     * 
     * Create a specified number of channels 
     * NOTE: this will reset all previous settings to the old channels
     * 
     * @param {number} number Number of channels to use for the equalization
     * @default 8
     */
    var createChannels = function(number) {
        channelsArray = {};
        for(var x = 0; x < number; x++){
            channelsArray[x] = 1;
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

        // Return true if everything is available
        return true;
    }

    /**
     * @public
     * 
     * Set the channels multiplication value (eq. 0 - 2)
     * 
     * @param {number} channel Channel number
     * @param {number} value Multiplication value
     */
    _.setChannelValue = function(channel, value) {
        var oldValue = channelsArray[channel];
        channelsArray[channel] = value;

        console.log(`Set equalizer channel ${channel + 1} to ${value}x`);

        triggerEvent('equalizer:channelChange', { old : oldValue, new : value });
    }

    /**
     * @public
     * 
     * Process the audio data with the set settings
     * 
     * @param {Array} audioData Array of audio data ( number array )
     * @param {boolean} is2Channels [Optional] Boolean to indicate the audio data contains 2 channels ( left & right )
     * 
     * @returns {Array} Processed audio data
     */
    _.processAudioData = function(audioData, is2Channels) {

        // If not all dependencies where loaded or not enabled, return the raw data
        if(!dependenciesLoaded || !_enabled) { return audioData; }

        // The number of samples is either the data array length, or half that if 2 channels
        var samples = is2Channels ? audioData.length / 2 : audioData.length;

        // The equalizer channels are interpolated to match the sample length
        var interpolatedEQ = ARTHESIAN.Helper.Array.interpolate(Object.values(channelsArray), samples);

        // New data array
        var newData = [];
        
        // If 2 channels, process left and right seperately, and return combined data
        if(is2Channels) {

            // Process left channel
            newData.push(...equalizeAudioArray(audioData.slice(0, audioData.length / 2), interpolatedEQ));
            
            // Process right channel
            newData.push(...equalizeAudioArray(audioData.slice(audioData.length / 2, audioData.length), interpolatedEQ));
        }else {
            // Return the processed audio data
            newData = equalizeAudioArray(audioData, interpolatedEQ);
        }

        // Trigger event
        triggerEvent('equalizer:processedAudio', { raw : audioData, processed : newData });

        // Return the processed audio data
        return newData;
    }

    /**
     * @private
     * 
     * Private method to process the audio data
     * 
     * @param {Array} data Audio data array
     * @param {Array} eq Equalizer array
     * 
     * @returns {Array} Processed audio data
     */
    var equalizeAudioArray = function(data, eq) {
        var equalizedData = [];
        for (var x = 0; x < data.length; x++) {
            let eqMultiplier = eq[x] < 0 ? 0 : eq[x];
            equalizedData[x] = eqMultiplier * data[x];
        }
        return equalizedData;
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

};