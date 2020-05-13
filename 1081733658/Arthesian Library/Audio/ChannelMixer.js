'use strict';

/**
 * Arthesian's ChannelMixer module
 * 
 * @returns {ChannelMixer} ChannelMixer instance for Audio
 */
var ARTHESIAN = ARTHESIAN || {};
ARTHESIAN.Audio = ARTHESIAN.Audio || {}
ARTHESIAN.Audio.ChannelMixer = (function () {

    var _enabled = true;

    // Define scope
    var _ = {
        set enabled(val) {
            _enabled = val;

            console.log(`Set ChannelMixer 'Enabled' to ${_enabled}`);
        }
    };

    // Private variables
    var moduleName = 'ARTHESIAN.Audio.ChannelMixer';

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

        // Trigger complete
        triggerEvent('ChannelMixer:initCompleted');
    }

    /**
     * @private
     * 
     * Check if all dependencies are loaded
     * 
     * @returns {boolean} Whether all dependencies where available or not
     */
    var checkDependencies = function(){
        
        // Check for Array Helper
        if(!ARTHESIAN.Helper.checkDependency(['ARTHESIAN', 'Helper', 'Array', 'interpolate'])) {
            console.error(`'${moduleName}' depends upon the module 'ARTHESIAN.Helper.Array'. Please load the appropiate files.`);
            return false;
        }

        // Check if the EventBus module is loaded
        if(!ARTHESIAN.Helper.checkDependency(['ARTHESIAN', 'EventBus'])) {
            console.warn(`'${moduleName}' uses the 'ARTHESIAN.EventBus' to fire events. It will still work without the EventBus, but listeners will not receive data.`);
        }

        // Return true if everything is available
        return true;
    }

    _.processWallpaperEngineAudioData = function(audioData, channel, option, reverse) {
        return _.processAudioData(audioData, true, channel, option, reverse);
    }

    var getLeftHalf = function(data, reversed) {
        
        _halfLength = data.length / 2;

        if(reversed) {
            // Take 63 - 0
            for(_loopCounter = _halfLength - 1, _indexCounter = _mixedAudioData.length; _loopCounter >= 0; _loopCounter--, _indexCounter++) {
                _mixedAudioData[_indexCounter] = data[_loopCounter];
            }
        } else {
            // Take 0 - 63
            for(_loopCounter = 0, _indexCounter = _mixedAudioData.length; _loopCounter < _halfLength; _loopCounter++, _indexCounter++) {
                _mixedAudioData[_indexCounter] = data[_loopCounter];
            }
        }
    }

    var getRightHalf = function(data, reversed) {
        
        _halfLength = data.length / 2;

        if(reversed) {
            // Take 127 - 64
            for(_loopCounter = data.length - 1, _indexCounter = _mixedAudioData.length; _loopCounter >= _halfLength; _loopCounter--, _indexCounter++) {
                _mixedAudioData[_indexCounter] = data[_loopCounter];
            }
        } else {
            // Take 64 - 127
            for(_loopCounter = _halfLength, _indexCounter = _mixedAudioData.length; _loopCounter < data.length; _loopCounter++, _indexCounter++) {
                _mixedAudioData[_indexCounter] = data[_loopCounter];
            }
        }
    }

    var _loopCounter = 0;
    var _indexCounter = 0;
    var _halfLength;
    var _mixedAudioData = [];
    var mixMirror = function(audioData, channel) {

        _mixedAudioData = [];

        if(channel === 'LEFT') {
            getLeftHalf(audioData);
            getLeftHalf(audioData, true);
        }else if(channel === 'RIGHT'){
            getRightHalf(audioData);
            getRightHalf(audioData, true);
        }else{
            getLeftHalf(audioData);
            getRightHalf(audioData, true);
        }

        return _mixedAudioData;
    }
    
    var mixRepeat = function(audioData, channel) {

        _mixedAudioData = [];

        if(channel === 'LEFT') {
            getLeftHalf(audioData);
            getLeftHalf(audioData);
        }else if(channel === 'RIGHT'){
            getRightHalf(audioData);
            getRightHalf(audioData);
        }else{
            _mixedAudioData = audioData.slice(0);
        }

        return _mixedAudioData;
    }

    var _leftChannel;
    var _rightChannel;
    var mixNormal = function(audioData, channel) {

        _mixedAudioData = [];

        _leftChannel = audioData.slice(0, audioData.length / 2);
        _rightChannel = audioData.slice(audioData.length / 2, audioData.length);

        if(channel === 'LEFT') {
            _mixedAudioData = ARTHESIAN.Helper.Array.interpolate(_leftChannel, audioData.length);
        }else if(channel === 'RIGHT'){
            _mixedAudioData = ARTHESIAN.Helper.Array.interpolate(_rightChannel, audioData.length);
        }else{
            
            for(_loopCounter = 0; _loopCounter < _leftChannel.length; _loopCounter++) {
                _mixedAudioData.push((_leftChannel[_loopCounter] + _rightChannel[_loopCounter]) / 2);
            }

            _mixedAudioData = ARTHESIAN.Helper.Array.interpolate(_mixedAudioData, audioData.length);
        }

        return _mixedAudioData;
    }

    var _dualChannelData = [];
    _.processAudioData = function(audioData, is2Channels, channel, option, reverse) {
        // audiodata is start array
        // is2channels = boolean to know if the data is already 1 or 2 channels
        // channel = 'LEFT', 'RIGHT', 'BOTH'
        // option  = 'NORMAL', 'MIRROR' or 'REPEAT'
        // reversed = boolean
        // note : repeat == normal for both channels
        // data = [1,2,3,4]

        // If disabled, pass through the audio data
        if(!_enabled) {
            return audioData;
        }

        if(is2Channels) {
            switch(option){
                case 'MIRROR':
                    mixMirror(audioData, channel);
                    break;
                case 'REPEAT':
                    mixRepeat(audioData, channel);
                    break;
                default:
                    mixNormal(audioData, channel);
            }
        }else {
            _dualChannelData = [];
            _dualChannelData.push(...audioData);
            _dualChannelData.push(...audioData);
            
            switch(option){
                case 'MIRROR':
                    audioData = mixMirror(_dualChannelData, channel);
                    break;
                case 'REPEAT':
                    audioData = mixRepeat(_dualChannelData, channel);
                    break;
                default:
                    audioData = mixNormal(_dualChannelData, channel);
            }
        }

        if(reverse) {
            if(option === "MIRROR") {

                _mixedAudioData = [];

                getLeftHalf(audioData, true);
                getRightHalf(audioData);
                
                return _mixedAudioData;

            } else {
                _mixedAudioData.reverse();
            }
        }

        return _mixedAudioData;
    }

    /**
     * @private
     * 
     * Trigger events on the EventBus for other objects to listen to
     * 
     * @param {String} name Name of the event to trigger
     * @param {Object} [data] Additional data to send
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