var foregroundSettingsObject = {};
var foreground_settings = function(settings) {
    // Select foreground type
    var setforeground = function() {
        
        WALLPAPER.foreground.setImage(foregroundSettingsObject.image);
    }

    // Enable/Disable foreground
    if (settings.foreground_enable) {
        if (!settings.foreground_enable.value) {
            WALLPAPER.foreground.Enable(false);
        } else {
            WALLPAPER.foreground.Enable(true);
        }
        setforeground();
    }

    // Select foreground image
    if (settings.foreground_image) {
        if (settings.foreground_image.value !== "") {
            foregroundSettingsObject.image = "file:///" + settings.foreground_image.value;
        } else {
            foregroundSettingsObject.image = null;
        }
        setforeground();
    }

    if(settings.foreground_image_size) {
        WALLPAPER.foreground.settings.image_max_height = settings.foreground_image_size.value || 0; // 0 = disabled
    }

    if(settings.foreground_offset_x) {
        WALLPAPER.foreground.settings.image_offset_x = settings.foreground_offset_x.value || 0;
    }
    
    if(settings.foreground_offset_y) {
        WALLPAPER.foreground.settings.image_offset_y = settings.foreground_offset_y.value || 0;
    }

    // Z-index
    if(settings.foreground_image_zindex) {
        WALLPAPER.foreground.settings.zIndex = settings.foreground_image_zindex.value;
    }


    // Set glow size
    if (settings.foreground_glowsize) {
        WALLPAPER.foreground_engine.settings.glowSize = settings.foreground_glowsize.value;
        WALLPAPER.foreground_engine.enableGlow(WALLPAPER.foreground_engine.settings.enableGlow);
    }
    // Set glow color
    if (settings.foreground_glowcolor) {
        if (settings.foreground_glowcolor.value !== "") {
            var c = settings.foreground_glowcolor.value;
            var colour = new Colour().FromRGBOneScaleString(c);
            WALLPAPER.foreground_engine.settings.glowColor = colour.RGBColourString();
            WALLPAPER.foreground_engine.enableGlow(WALLPAPER.foreground_engine.settings.enableGlow);
        }
    }
    // Enable glow
    if (settings.foreground_glow) {
        WALLPAPER.foreground_engine.enableGlow(!!settings.foreground_glow.value);
    }

    // Effects
    if (settings.foreground_effect) {
        WALLPAPER.foreground_engine.settings.effectsEnabled = settings.foreground_effect.value;
    }
    if (settings.foreground_effect_bluronbeat) {
        WALLPAPER.foreground_engine.settings.blurOnBeatEnabled = settings.foreground_effect_bluronbeat.value;
    }
    if (settings.foreground_effect_bluronbeatstrength) {
        WALLPAPER.foreground_engine.settings.blurOnBeatStrengthMultiplier = settings.foreground_effect_bluronbeatstrength.value / 100;
    }
    if (settings.foreground_effect_hilightonbeat) {
        WALLPAPER.foreground_engine.settings.hilightOnBeatEnabled = settings.foreground_effect_hilightonbeat.value;
    }
    if (settings.foreground_effect_hilightonbeatstrength) {
        WALLPAPER.foreground_engine.settings.hilightOnBeatStrengthMultiplier = settings.foreground_effect_hilightonbeatstrength.value / 100;
    }
    if (settings.foreground_effect_bounceonbeat) {
        WALLPAPER.foreground_engine.settings.bounceOnBeatEnabled = settings.foreground_effect_bounceonbeat.value;
    }
    if (settings.foreground_effect_bounceonbeatstrength) {
        WALLPAPER.foreground_engine.settings.bounceOnBeatStrengthMultiplier = settings.foreground_effect_bounceonbeatstrength.value / 100;
    }

    // Hue
    if (settings.foreground_effect_hue) {
        WALLPAPER.foreground_engine.settings.hueEnabled = settings.foreground_effect_hue.value;
    }
    if (settings.foreground_effect_huerotate) {
        WALLPAPER.foreground_engine.settings.hueOffset = settings.foreground_effect_huerotate.value;
    }
    if (settings.foreground_effect_huerotation) {
        if (settings.foreground_effect_huerotation.value !== "") {
            WALLPAPER.foreground_engine.startHueRotationTween(settings.foreground_effect_huerotation.value);
        }
    }
    if (settings.foreground_effect_huerotationspeed) {
        if (settings.foreground_effect_huerotationspeed.value !== "") {
            WALLPAPER.foreground_engine.settings.hueRotationDuration = settings.foreground_effect_huerotationspeed.value * 1000;
            WALLPAPER.foreground_engine.startHueRotationTween(WALLPAPER.foreground_engine.settings.hueRotationEnabled);
        }
    }
    if (settings.foreground_effect_hueshifttemp) {
        WALLPAPER.foreground_engine.settings.hueShiftTemporaryEnabled = settings.foreground_effect_hueshifttemp.value;
    }
    if (settings.foreground_effect_hueshifttempstrength) {
        WALLPAPER.foreground_engine.settings.hueShiftTemporaryStrengthMultiplier = settings.foreground_effect_hueshifttempstrength.value / 100;
    }
    if (settings.foreground_effect_hueshiftperm) {
        WALLPAPER.foreground_engine.settings.hueShiftPermanentEnabled = settings.foreground_effect_hueshiftperm.value;
    }
    if (settings.foreground_effect_hueshiftpermstrength) {
        WALLPAPER.foreground_engine.settings.hueShiftPermanentStrengthMultiplier = settings.foreground_effect_hueshiftpermstrength.value / 100;
    }
    if (settings.foreground_effect_hueshiftpermreset) {
        WALLPAPER.foreground_engine.settings.hueShiftPermanentReset = settings.foreground_effect_hueshiftpermreset.value;
    }
    if (settings.foreground_effect_hueshiftpermresettimeout) {
        WALLPAPER.foreground_engine.settings.hueShiftPermanentResetTimeout = settings.foreground_effect_hueshiftpermresettimeout.value * 1000;
    }
    if (settings.foreground_effect_hueshiftpermresetduration) {
        WALLPAPER.foreground_engine.settings.hueShiftPermanentResetDuration = settings.foreground_effect_hueshiftpermresetduration.value * 1000;
    }

    if(settings.foreground_effect_bassshake) {
        WALLPAPER.foreground_engine.settings.bassShakeEnabled = settings.foreground_effect_bassshake.value;
    }
 
    if(settings.foreground_effect_bassshake_invert) {
        WALLPAPER.foreground_engine.settings.bassShakeInvert = settings.foreground_effect_bassshake_invert.value;
    }
    
    if(settings.foreground_effect_bassshakestrength) {
        WALLPAPER.foreground_engine.settings.bassShakeStrengthMultiplier = settings.foreground_effect_bassshakestrength.value / 100;
    }

    // Opacity effecy
    if(settings.foreground_effect_transparency_onbeat) {
        WALLPAPER.foreground_engine.settings.transparency_onbeat = settings.foreground_effect_transparency_onbeat.value
    }
    if(settings.foreground_effect_transparency_onbeat_strength) {
        WALLPAPER.foreground_engine.settings.transparency_onbeat_strength = settings.foreground_effect_transparency_onbeat_strength.value / 100;
    }
    if(settings.foreground_effect_transparency_onbeat_invert) {
        WALLPAPER.foreground_engine.settings.transparency_onbeat_inverted = settings.foreground_effect_transparency_onbeat_invert.value;
    }

    if(settings.foreground_image_blendmode) {
        let foreground = document.getElementById("foreground");
        foreground.style.mixBlendMode = settings.foreground_image_blendmode.value;
    }
}