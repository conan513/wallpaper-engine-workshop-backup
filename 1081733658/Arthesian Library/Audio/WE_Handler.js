'use strict';

/**
 * Arthesian's Sound.WE_Handler
 *
 * Handles most of the basic functionalities of Wallpaper Engine's javascript
 * 
 * @returns {SoundHandler} Sound.WE_Handler singleton
 */
var ARTHESIAN = ARTHESIAN || {};
ARTHESIAN.Audio = ARTHESIAN.Audio || {};
ARTHESIAN.Audio.WE_Handler = ARTHESIAN.Audio.WE_Handler || (function () {


    var _audioSmoothingTime = 50;
    var _usePinkNoiseCorrection = true;

    // Scope object
    var _ = {
        get useGenerator() {
            return useGenerator;
        },
        set useGenerator(value) {
            if (value) {
                _.generator.start();
            } else {
                _.generator.stop();
            }
            useGenerator = value;

            console.log(`Set Wallpaper Engine Handler's 'Audio Generator' Enabled to ${useGenerator}`);
        },
        set audioSmoothingTime(val) {
            _audioSmoothingTime = val;

            console.log(`Set Audio Smoothing time to ${val}ms`);
        },
        set usePinkNoiseCorrection(val) {
            _usePinkNoiseCorrection = val;

            console.log(`Set 'Pink Noise Correction'-Enabled to ${val}`);
        }
    };
    

    // Private variables
    var moduleName = 'ARTHESIAN.Audio.WE_Handler';
    var transitionAudioData;
    
    var useGenerator = false;

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
            console.warn(`${moduleName} will not work (properly) without the proper dependencies loaded!`);
        }

        bind();
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
        if (!ARTHESIAN.Helper.checkDependency(['createjs', 'Tween'])) {
            console.error(`'${moduleName}' uses CreateJS Tween library to 'smooth' the Audio Data. It will not be smoothed unless the library is loaded`);
        }

        // Return true if everything is available
        return true;
    }

    var bind = function () {
        // Listen to the audio Wallpaper Engine provides, or fallback to randomly generated data
        if (window.wallpaperRegisterAudioListener) {
            window.wallpaperRegisterAudioListener((data) => {
                handleWallpaperEngineAudioData(data);
            });
        } else {
            _.useGenerator = true;
        }
    }

    // Pink Noise correction array 
    // All credit goes to 'Squee' :: http://steamcommunity.com/id/allgoodidsaretaken/
    var pinkNoise = [1.1760367470305, 0.85207379418243, 0.68842437227852, 0.63767902570829, 0.5452348949654, 0.50723325864167, 0.4677726234682, 0.44204182748767, 0.41956517802157, 0.41517375040002, 0.41312118577934, 0.40618363960446, 0.39913707474975, 0.38207008614508, 0.38329789106488, 0.37472136606245, 0.36586428412968, 0.37603017335105, 0.39762590761573, 0.39391828858591, 0.37930603769622, 0.39433365764563, 0.38511504613859, 0.39082579241834, 0.3811852720504, 0.40231453727161, 0.40244151133175, 0.39965366884521, 0.39761103827545, 0.51136400422212, 0.66151212038954, 0.66312205226679, 0.7416276690995, 0.74614971301133, 0.84797007577483, 0.8573583910469, 0.96382997811663, 0.99819377577185, 1.0628692615814, 1.1059083969751, 1.1819808497335, 1.257092297208, 1.3226521464753, 1.3735992532905, 1.4953223705889, 1.5310064942373, 1.6193923584808, 1.7094805527135, 1.7706604552218, 1.8491987941428, 1.9238418849406, 2.0141596921333, 2.0786429508827, 2.1575522518646, 2.2196355526005, 2.2660112509705, 2.320762171749, 2.3574848254513, 2.3986127976537, 2.4043566176474, 2.4280476777842, 2.3917477397336, 2.4032522546622, 2.3614180150678];

    /**
     * Correct the Audio Data with the pinkNoise correction array.
     * 
     * @param {any} data 
     * @returns 
     */
    var correctAudioDataWithPinkNoiseResults = function (data) {
        for (var i = 0; i < 64; i++) {
            data[i] /= pinkNoise[i];
            data[i + 64] /= pinkNoise[i];
        }
        return data;
    };

    /**
     * Handler for the WallpaperEngine Audio Data callback
     * 
     * @param {any} data 
     */
    var handleWallpaperEngineAudioData = function (data) {

        if (_usePinkNoiseCorrection) { data = correctAudioDataWithPinkNoiseResults(data); }

        if (!transitionAudioData) { transitionAudioData = data; }

        // If CreateJS is available, smooth the audio data over time
        if (createjs && createjs.Tween) {
            createjs.Tween.get(transitionAudioData, {
                override: true
            }).to(data, _audioSmoothingTime);
        } else {
            transitionAudioData = data;
        }
    }

    /**
     * Get Audio data
     * 
     * @returns {Array<Number>}
     */
    _.getAudioData = function () {
        if(_.useGenerator) {
            return _.generator.getRandomAudioData() || [];
        } else {
            return transitionAudioData || [];
        }
    }

    // Call the init method
    init();

    // Return the scope
    return _;
})();