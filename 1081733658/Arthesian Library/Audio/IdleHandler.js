'use strict';

/**
 * Arthesian's IdleHandler
 *
 * Handles idle sound when applicable
 * 
 * @returns {IdleHandler} IdleHandler singleton
 */
var ARTHESIAN = ARTHESIAN || {};
ARTHESIAN.Audio = ARTHESIAN.Audio || {};
ARTHESIAN.Audio.IdleHandler = function () {

    // Private properties
    var _enabled = true;
    var _animationEnabled = false;
    var _timeOutSeconds = 3;
    var _type = "NORMAL";

    // Setters
    var _ = {
        set enabled(val) {
            _enabled = val;
            console.log(`Set Idle Handler 'Enabled' to ${val}`);

            // Cancel timeout if disabled
            if(!val) { stopIdleTimeOut(); }
        },
        get enabled() { return _enabled; },
        set animationEnabled(val) {
            _animationEnabled = val;

            console.log(`Set Idle Animation 'Enabled' to ${val}`);
        },
        get animationEnabled() { return _animationEnabled; },
        set timeOutSeconds(val) {
            _timeOutSeconds = val;

            stopIdleTimeOut();

            console.log(`Set Idle Timeout to ${val} seconds`)
        },
        get timeOutSeconds() { return _timeOutSeconds; },
        set type(val) {
            let valid = ["NORMAL","RANDOM"].includes(val);
            _type = valid ? val : 'NORMAL';

            if(!valid) { console.log(`Input '${val}' was invalid! defaulted to 'NORMAL'`); }

            console.log(`Set Idle Audio Generation Type to '${_type}`)
        },
        get type() { return _type; },
        get isIdle() {
            return idleState.enabled;
        }
    };

    // Public variables
    _.generator;

    // Private variables
    var moduleName = 'ARTHESIAN.Audio.IdleHandler';

    /**
     * @private
     *
     * Initializating method
     */
    var init = function () {

        // Check dependencies
        var dependenciesLoaded = checkDependencies();

        // If not all dependencies where loaded, log a warning
        if (!dependenciesLoaded) {
            console.warn(`${moduleName} will not work without the proper dependencies loaded!`);
        } else {
            _.generator = new ARTHESIAN.Audio.Generator();
        }
    };

    /**
     * @private
     * 
     * Check if all dependencies are loaded
     * 
     * @returns {boolean} Whether all dependencies where available or not
     */
    var checkDependencies = function () {

        // Check if the Helper.Array module is loaded
        if (!ARTHESIAN.Helper.checkDependency(['ARTHESIAN', 'Audio', 'Generator'])) {
            console.error(`'${moduleName}' depends upon the module 'ARTHESIAN.Audio.Generator'. Please load the appropiate files.`);
            return false;
        }

        // Check if the Helper.Array module is loaded
        if (!ARTHESIAN.Helper.checkDependency(['ARTHESIAN', 'Helper', 'Array', 'average'])) {
            console.error(`'${moduleName}' depends upon the module 'ARTHESIAN.Helper.Array'. Please load the appropiate files.`);
            return false;
        }

        // Check if the EventBus module is loaded
        if (!ARTHESIAN.Helper.checkDependency(['ARTHESIAN', 'EventBus'])) {
            console.warn(`'${moduleName}' uses the 'ARTHESIAN.EventBus' to fire events. It will still work without the EventBus, but listeners will never receive data.`);
            return false;
        }

        // Return true if everything is available
        return true;
    }

    var idleState = {
        strength: 1,
        enabled: false,
        timeOutRunning: false,
        timeOutHandler: null
    }

    /**
     * Process the audio data to determine whether the audio is 'idle' or not
     * If it's determined to be idle, and idlestate is enabled, it will return
     * generated audio data
     * 
     * @param {any} data 
     * @returns 
     */
    _.processAudioData = function (data) {

        // If not enabled, pass through data
        if(!_enabled) { return data; }

        // Check the data
        checkIdleData(data);

        // If the idlestate is enabled, and the generator instantiated, generate audio data
        if (_.generator && idleState.enabled && _animationEnabled) {
            if (_type === "RANDOM") {
                data = _.generator.getRandomAudioData(data.length, true);
            } else {
                data = _.generator.getIdleAudioData(data.length, idleState.strength);
            }
        }

        // return the original or generated audio data
        return data;
    }

    var wasIdle = false;
    /**
     * Determine whether the volume is so low, that the audio is considered idle
     * 
     * @param {any} data 
     * @returns {null} if not all modules where loaded
     */
    var checkIdleData = function (data) {

        // Check if dependencies are loaded
        if (!ARTHESIAN.Helper || !ARTHESIAN.Helper.Array || !ARTHESIAN.EventBus) { return; }

        // Check if there is no sound
        if (!ARTHESIAN.Audio.Source.hasSound) {
            setIdleTimeOut();

            // If a change was detected, trigger event
            if (!wasIdle) {
                ARTHESIAN.EventBus.trigger('idle', { enabled : true });
                wasIdle = true;
            }

        } else {
            resetIdleState();

            // If a change was detected, trigger event
            if (wasIdle) {
                ARTHESIAN.EventBus.trigger('idle', { enabled: false });
                wasIdle = false;
            }
        }
    }
    /**
     * Reset timers when idle state is over
     * 
     */
    var resetIdleState = function () {

        //console.log(`Idle State was reset`);

        stopIdleTimeOut();

        // Reset values
        idleState.strength = 1;
        idleState.enabled = false;

        _.generator.stop();

        //console.log(`Idle audio data generator was stopped`);
    }

    /**
     * Stop the Idle timeout ( if it was started )
     *
     */
    var stopIdleTimeOut = function (){

        // Clear timeout if running
        if (idleState.timeOutRunning) {
            clearTimeout(idleState.timeOutHandler);
            idleState.timeOutRunning = false;
            idleState.enabled = false;

            console.log(`Idle TimeOut was cancelled`);
        }
    }

    /**
     * Start idle timers when idle state is detected
     * 
     */
    var setIdleTimeOut = function () {

        // Don't start if it's already running
        if (!idleState.timeOutRunning) {

            // Start timeout
            idleState.timeOutHandler = setTimeout(() => {
                idleState.enabled = true;

                _.generator.start();

                idleState.strength = 0;
                createjs.Tween.get(idleState).to({ strength: 1 }, 1000);

                console.log(`Idle state is active`);

            }, _timeOutSeconds * 1000);

            // Set running to true
            idleState.timeOutRunning = true;

            console.log(`Idle TimeOut was started for ${_timeOutSeconds} seconds...`);
        }
    }

    // Call the init method
    init();

    // Return the scope
    return _;
};