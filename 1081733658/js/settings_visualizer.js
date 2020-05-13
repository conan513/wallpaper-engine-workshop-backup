var visualizerSettingsObject = {};
var visualizer_settings = function(settings) {

    // Set FPS if changed
    if (settings.fps) {
        visualizerSettingsObject.fps = settings.fps;
        //WALLPAPER.visualizer.setFPS(settings.fps);

        createjs.Ticker.setFPS(settings.fps);
    }
    // Enable FPS counter
    if (settings.visualizer_fpscounter) {
        if (settings.visualizer_fpscounter.value !== "") {
            WALLPAPER.performanceHelper.Enable(settings.visualizer_fpscounter.value);
        }
    }
    // Set glow size
    if (settings.visualizer_glowsize) {
        if (settings.visualizer_glowsize.value !== "") {
            WALLPAPER.visualizer.settings.glowSize = settings.visualizer_glowsize.value;
            WALLPAPER.visualizer.enableGlow(WALLPAPER.visualizer.settings.enableGlow);
        }
    }
    // Set glow color
    if (settings.visualizer_glowcolor) {
        if (settings.visualizer_glowcolor.value !== "") {
            var c = settings.visualizer_glowcolor.value;
            var colour = new Colour().FromRGBOneScaleString(c);
            WALLPAPER.visualizer.settings.glowColor = colour.RGBColourString();
            WALLPAPER.visualizer.enableGlow(WALLPAPER.visualizer.settings.enableGlow);
        }
    }
    // Enable glow
    if (settings.visualizer_glow) {
        if (settings.visualizer_glow.value !== "") {
            WALLPAPER.visualizer.enableGlow(settings.visualizer_glow.value);
        }
    }

    // Effects
    if (settings.visualizer_effect) {
        if (settings.visualizer_effect.value !== "") {
            WALLPAPER.visualizer.settings.effectsEnabled = settings.visualizer_effect.value;
        }
    }
    if (settings.visualizer_effect_bluronbeat) {
        if (settings.visualizer_effect_bluronbeat.value !== "") {
            WALLPAPER.visualizer.settings.blurOnBeatEnabled = settings.visualizer_effect_bluronbeat.value;
        }
    }
    if (settings.visualizer_effect_bluronbeatstrength) {
        if (settings.visualizer_effect_bluronbeatstrength.value !== "") {
            WALLPAPER.visualizer.settings.blurOnBeatStrengthMultiplier = settings.visualizer_effect_bluronbeatstrength.value / 100;
        }
    }
    if (settings.visualizer_effect_hilightonbeat) {
        if (settings.visualizer_effect_hilightonbeat.value !== "") {
            WALLPAPER.visualizer.settings.hilightOnBeatEnabled = settings.visualizer_effect_hilightonbeat.value;
        }
    }
    if (settings.visualizer_effect_hilightonbeatstrength) {
        if (settings.visualizer_effect_hilightonbeatstrength.value !== "") {
            WALLPAPER.visualizer.settings.hilightOnBeatStrengthMultiplier = settings.visualizer_effect_hilightonbeatstrength.value / 100;
        }
    }
    if (settings.visualizer_effect_bounceonbeat) {
        if (settings.visualizer_effect_bounceonbeat.value !== "") {
            WALLPAPER.visualizer.settings.bounceOnBeatEnabled = settings.visualizer_effect_bounceonbeat.value;
        }
    }
    if (settings.visualizer_effect_bounceonbeatstrength) {
        if (settings.visualizer_effect_bounceonbeatstrength.value !== "") {
            WALLPAPER.visualizer.settings.bounceOnBeatStrengthMultiplier = settings.visualizer_effect_bounceonbeatstrength.value / 100;
        }
    }

    // Hue
    if (settings.visualizer_effect_hue) {
        if (settings.visualizer_effect_hue.value !== "") {
            WALLPAPER.visualizer.settings.hueEnabled = settings.visualizer_effect_hue.value;
        }
    }
    if (settings.visualizer_effect_huerotate) {
        if (settings.visualizer_effect_huerotate.value !== "") {
            WALLPAPER.visualizer.settings.hueOffset = settings.visualizer_effect_huerotate.value;
        }
    }
    if (settings.visualizer_effect_huerotation) {
        if (settings.visualizer_effect_huerotation.value !== "") {
            WALLPAPER.visualizer.startHueRotationTween(settings.visualizer_effect_huerotation.value);
        }
    }
    if (settings.visualizer_effect_huerotationspeed) {
        if (settings.visualizer_effect_huerotationspeed.value !== "") {
            WALLPAPER.visualizer.settings.hueRotationDuration = settings.visualizer_effect_huerotationspeed.value * 1000;
            WALLPAPER.visualizer.startHueRotationTween(WALLPAPER.visualizer.settings.hueRotationEnabled);
        }
    }
    if (settings.visualizer_effect_hueshifttemp) {
        if (settings.visualizer_effect_hueshifttemp.value !== "") {
            WALLPAPER.visualizer.settings.hueShiftTemporaryEnabled = settings.visualizer_effect_hueshifttemp.value;
        }
    }
    if (settings.visualizer_effect_hueshifttempstrength) {
        if (settings.visualizer_effect_hueshifttempstrength.value !== "") {
            WALLPAPER.visualizer.settings.hueShiftTemporaryStrengthMultiplier = settings.visualizer_effect_hueshifttempstrength.value / 100;
        }
    }
    if (settings.visualizer_effect_hueshiftperm) {
        if (settings.visualizer_effect_hueshiftperm.value !== "") {
            WALLPAPER.visualizer.settings.hueShiftPermanentEnabled = settings.visualizer_effect_hueshiftperm.value;
        }
    }
    if (settings.visualizer_effect_hueshiftpermstrength) {
        if (settings.visualizer_effect_hueshiftpermstrength.value !== "") {
            WALLPAPER.visualizer.settings.hueShiftPermanentStrengthMultiplier = settings.visualizer_effect_hueshiftpermstrength.value / 100;
        }
    }
    if (settings.visualizer_effect_hueshiftpermreset) {
        if (settings.visualizer_effect_hueshiftpermreset.value !== "") {
            WALLPAPER.visualizer.settings.hueShiftPermanentReset = settings.visualizer_effect_hueshiftpermreset.value;
        }
    }
    if (settings.visualizer_effect_hueshiftpermresettimeout) {
        if (settings.visualizer_effect_hueshiftpermresettimeout.value !== "") {
            WALLPAPER.visualizer.settings.hueShiftPermanentResetTimeout = settings.visualizer_effect_hueshiftpermresettimeout.value * 1000;
        }
    }
    if (settings.visualizer_effect_hueshiftpermresetduration) {
        if (settings.visualizer_effect_hueshiftpermresetduration.value !== "") {
            WALLPAPER.visualizer.settings.hueShiftPermanentResetDuration = settings.visualizer_effect_hueshiftpermresetduration.value * 1000;
        }
    }

    if(settings.visualizer_effect_bassshake) {
        WALLPAPER.visualizer.settings.bassShakeEnabled = settings.visualizer_effect_bassshake.value;
    }
 
    if(settings.visualizer_effect_bassshake_invert) {
        WALLPAPER.visualizer.settings.bassShakeInvert = settings.visualizer_effect_bassshake_invert.value;
    }
    
    if(settings.visualizer_effect_bassshakestrength) {
        WALLPAPER.visualizer.settings.bassShakeStrengthMultiplier = settings.visualizer_effect_bassshakestrength.value / 100;
    }

    // Equalizer
    if (settings.visualizer_equalizer) {
        if (settings.visualizer_equalizer.value !== "") {
            WALLPAPER.visualizer.settings.enableEqualizer = settings.visualizer_equalizer.value;
        }
    }
    if (settings.visualizer_equalizer_1) {
        if (settings.visualizer_equalizer_1.value !== "") {
            WALLPAPER.visualizer.settings.equalizerMultiplier1 = settings.visualizer_equalizer_1.value / 100;
        }
    }
    if (settings.visualizer_equalizer_2) {
        if (settings.visualizer_equalizer_2.value !== "") {
            WALLPAPER.visualizer.settings.equalizerMultiplier2 = settings.visualizer_equalizer_2.value / 100;
        }
    }
    if (settings.visualizer_equalizer_3) {
        if (settings.visualizer_equalizer_3.value !== "") {
            WALLPAPER.visualizer.settings.equalizerMultiplier3 = settings.visualizer_equalizer_3.value / 100;
        }
    }
    if (settings.visualizer_equalizer_4) {
        if (settings.visualizer_equalizer_4.value !== "") {
            WALLPAPER.visualizer.settings.equalizerMultiplier4 = settings.visualizer_equalizer_4.value / 100;
        }
    }
    if (settings.visualizer_equalizer_5) {
        if (settings.visualizer_equalizer_5.value !== "") {
            WALLPAPER.visualizer.settings.equalizerMultiplier5 = settings.visualizer_equalizer_5.value / 100;
        }
    }
    if (settings.visualizer_equalizer_6) {
        if (settings.visualizer_equalizer_6.value !== "") {
            WALLPAPER.visualizer.settings.equalizerMultiplier6 = settings.visualizer_equalizer_6.value / 100;
        }
    }
    if (settings.visualizer_equalizer_7) {
        if (settings.visualizer_equalizer_7.value !== "") {
            WALLPAPER.visualizer.settings.equalizerMultiplier7 = settings.visualizer_equalizer_7.value / 100;
        }
    }
    if (settings.visualizer_equalizer_8) {
        if (settings.visualizer_equalizer_8.value !== "") {
            WALLPAPER.visualizer.settings.equalizerMultiplier8 = settings.visualizer_equalizer_8.value / 100;
        }
    }
 
 
 
    if (settings.visualizer_smoothtime) {
        ARTHESIAN.Audio.WE_Handler.audioSmoothingTime = settings.visualizer_smoothtime.value || 0;
    }



    /*
        // IDLE STATE
    */
    // Enable idle state
    if (settings.visualizer_idlestate) {
        if (settings.visualizer_idlestate.value !== "") {
            ARTHESIAN.Audio.Source.idleHandler.enabled = !!settings.visualizer_idlestate.value;
        }
    }
    // Enable idle animation
    if (settings.visualizer_idleanimation) {
        if (settings.visualizer_idleanimation.value !== "") {
            ARTHESIAN.Audio.Source.idleHandler.animationEnabled = !!settings.visualizer_idleanimation.value;
        }
    }
    // Set idle state timeout
    if (settings.visualizer_idletimeout) {
        if (settings.visualizer_idletimeout.value !== "") {
            ARTHESIAN.Audio.Source.idleHandler.timeOutSeconds = settings.visualizer_idletimeout.value;
        }
    }
    // Set idle state movement speed
    if (settings.visualizer_idlemovementspeed) {
        if (settings.visualizer_idlemovementspeed.value !== "") {
            ARTHESIAN.Audio.Source.idleHandler.generator.idleMovementSpeedMultiplier = settings.visualizer_idlemovementspeed.value / 100;
        }
    }
    // Set idle state strength
    if (settings.visualizer_idlestrength) {
        if (settings.visualizer_idlestrength.value !== "") {
            ARTHESIAN.Audio.Source.idleHandler.generator.idleAnimationStrengthMultiplier = settings.visualizer_idlestrength.value / 100;
        }
    }
    // Set idle state ignores effects
    if (settings.visualizer_idleignoreeffects) {
        if (settings.visualizer_idleignoreeffects.value !== "") {
            WALLPAPER.visualizer.settings.idleAnimationIgnoresEffects = settings.visualizer_idleignoreeffects.value;
        }
    }
}