var backgroundSettingsObject = {};
var background_settings = function(settings) {
    // Select background type
    var setBackground = function() {

        var type = backgroundSettingsObject.type;

        if (!backgroundSettingsObject.enabled) {
            type = 99;
        }

        switch (type) {
            case 1:
            default:
                WALLPAPER.background.stopSlideShow(true);
                WALLPAPER.background.setImage(null, true);
                WALLPAPER.background.setVideo(null);
                document.body.style.backgroundColor = (type == 99) ? 'black' : backgroundSettingsObject.color;
                WALLPAPER.background.Enable(false);
                break;
            case 2:
                WALLPAPER.background.Enable(true);
                WALLPAPER.background.setVideo(null);
                WALLPAPER.background.stopSlideShow(true);
                WALLPAPER.background.setImage(backgroundSettingsObject.image, true);
                document.body.style.backgroundColor = 'black';
                break;
            case 3:
                WALLPAPER.background.Enable(true);
                WALLPAPER.background.setVideo(null);
                WALLPAPER.background.startSlideShow();
                document.body.style.backgroundColor = 'black';
                break;
            case 4:
                WALLPAPER.background.Enable(true);
                WALLPAPER.background.stopSlideShow(true);
                WALLPAPER.background.setImage(null, true);
                WALLPAPER.background.setVideo(backgroundSettingsObject.video);
                document.body.style.backgroundColor = 'black';
                break;
        }
    }

    // Enable/Disable background
    if (settings.background_enable) {
        if (settings.background_enable.value !== "") {
            if (!settings.background_enable.value) {
                backgroundSettingsObject.enabled = false;
            } else {
                backgroundSettingsObject.enabled = true;
            }
            setBackground();
        }
    }

    // set background fps
    if (settings.visualizer_backgroundFps) {
        if (settings.visualizer_backgroundFps.value !== "") {
            background_engine.setFPS(settings.visualizer_backgroundFps.value);
        }
    }
    
    // set background idle fps
    if (settings.visualizer_backgroundIdleFps) {
        background_engine.variables.fpsInactive = settings.visualizer_backgroundIdleFps.value;
    }

    if (settings.background_type) {
        if (settings.background_type.value !== "") {
            backgroundSettingsObject.type = settings.background_type.value;

            setBackground();
        }
    }
    // Select background color
    if (settings.background_color) {
        if (settings.background_color.value !== "") {
            var c = settings.background_color.value;
            var colour = new Colour().FromRGBOneScaleString(c);
            backgroundSettingsObject.color = colour.RGBColourString();

            setBackground();
        }
    }
    // Select background image
    if (settings.background_image) {
        if (settings.background_image.value !== "") {
            backgroundSettingsObject.image = "file:///" + settings.background_image.value;
        } else {
            backgroundSettingsObject.image = null;
        }
        setBackground();
    }
    // Set Slideshow image show duration
    if (settings.background_slideshowduration) {
        WALLPAPER.background.settings.slideShowShowTime = settings.background_slideshowduration.value * 1000;
    }
    // Set Slideshow fade duration
    if (settings.background_slideshowfadeduration) {
        WALLPAPER.background.settings.slideShowFadeDuration = settings.background_slideshowfadeduration.value * 1000;
    }
    // Select background video
    if (settings.background_videofile) {
        if (settings.background_videofile.value !== "") {
            backgroundSettingsObject.video = "file:///" + settings.background_videofile.value;
        } else {
            backgroundSettingsObject.video = null;
        }
        setBackground();
    }
    // Video playback speed 
    if (settings.background_videovolume) {
        var vid = document.getElementById("background-video");
        vid.volume = settings.background_videovolume.value / 100;
    }
    // Video volume
    if (settings.background_videospeed) {
        var vid = document.getElementById("background-video");
        vid.playbackRate = settings.background_videospeed.value / 100;
    }
    // Video pause when idle
    if (settings.background_idlepause) {
        WALLPAPER.background.settings.pauseVideoOnIdle = !!settings.background_idlepause.value;
    }

    // Scale background to fit
    if (settings.background_scaletofit) {
        WALLPAPER.background.settings.scaleBackgroundToFit = !!settings.background_scaletofit.value;
    }

    // EFFECTS





    // Enable effects
    if (settings.background_effect) {
        WALLPAPER.background_engine.settings.effectsEnabled = !!settings.background_effect.value;
    }
    
    // Enable Color effects
    if (settings.background_colorEffectsEnabled) {
        WALLPAPER.background_engine.settings.hueEnabled = !!settings.background_colorEffectsEnabled.value;
    }

    // Hue offset slider
    if (settings.background_huerotate) {
        WALLPAPER.background_engine.settings.hueOffset = settings.background_huerotate.value || 0;
    }

    // Hue perm bass shift
    if (settings.background_effect_hueshift) {
        WALLPAPER.background_engine.settings.hueShiftPermanentEnabled = !!settings.background_effect_hueshift.value;
    }
    if (settings.background_effect_hueshiftstrength) {
        WALLPAPER.background_engine.settings.hueShiftPermanentStrengthMultiplier = settings.background_effect_hueshiftstrength.value / 100;
    }

    // Hue Rotation (static rotation)
    if (settings.background_effect_huerotation) {
        if (settings.background_effect_huerotation.value !== "") {
            WALLPAPER.background_engine.startHueRotationTween(settings.background_effect_huerotation.value);
        }
    }

    if (settings.background_effect_huerotationduration) {
        if (settings.background_effect_huerotationduration.value !== "") {
            WALLPAPER.background_engine.settings.hueRotationDuration = settings.background_effect_huerotationduration.value * 1000;
            WALLPAPER.background_engine.startHueRotationTween(WALLPAPER.background_engine.settings.hueRotationEnabled);
        }
    }

    // TEmp Hue shift
    if (settings.background_effect_huerotateenabled) {
        WALLPAPER.background_engine.settings.hueShiftTemporaryEnabled = !!settings.background_effect_huerotateenabled.value;
    }

    if (settings.background_effect_huerotatestrength) {
        WALLPAPER.background_engine.settings.hueShiftTemporaryStrengthMultiplier = settings.background_effect_huerotatestrength.value / 100;
    }


    // Enable Blur
    if (settings.background_effect_blur) {
        WALLPAPER.background_engine.settings.blurOnBeatEnabled = !!settings.background_effect_blur.value;
    }
    // Set Blur Strength
    if (settings.background_effect_blurstrength) {
        WALLPAPER.background_engine.settings.blurOnBeatStrengthMultiplier = settings.background_effect_blurstrength.value / 100;
    }
    // Enable Bounce
    if (settings.background_effect_bounce) {
        WALLPAPER.background_engine.settings.bounceOnBeatEnabled = !!settings.background_effect_bounce.value;
    }
    // Set Bounce Strength
    if (settings.background_effect_bouncestrength) {
        WALLPAPER.background_engine.settings.bounceOnBeatStrengthMultiplier = settings.background_effect_bouncestrength.value / 100;
    }

    if(settings.background_effect_bassshake) {
        WALLPAPER.background_engine.settings.bassShakeEnabled = !!settings.background_effect_bassshake.value;
    }

    if(settings.background_effect_bassshakestrength) {
        WALLPAPER.background_engine.settings.bassShakeStrengthMultiplier = settings.background_effect_bassshakestrength.value / 100;
    }

    // Enable Hilight
    if (settings.background_effect_hilight) {
        WALLPAPER.background_engine.settings.hilightOnBeatEnabled = !!settings.background_effect_hilight.value;
    }
    // Set Hilight Strength
    if (settings.background_effect_hilightstrength) {
        WALLPAPER.background_engine.settings.hilightOnBeatStrengthMultiplier = settings.background_effect_hilightstrength.value / 100;
    }

    if (settings.background_effect_hueshiftpermreset) {
        WALLPAPER.background_engine.settings.hueShiftBassReset = settings.background_effect_hueshiftpermreset.value;
    }
    if (settings.background_effect_hueshiftpermresettimeout) {
        WALLPAPER.background_engine.settings.hueShiftBassResetTimeout = settings.background_effect_hueshiftpermresettimeout.value * 1000;
    }
    if (settings.background_effect_hueshiftpermresetduration) {
        WALLPAPER.background_engine.settings.hueShiftBassResetDuration = settings.background_effect_hueshiftpermresetduration.value * 1000;
    }

    // Rocking settings
    if (settings.background_effect_rocking) {
        WALLPAPER.background.settings.rotationEnabled = settings.background_effect_rocking.value;
    }

    if (settings.background_effect_rockingstrength) {
        WALLPAPER.background.settings.rotationStrengthMultiplier = settings.background_effect_rockingstrength.value / 100;
    }

    if (settings.background_effect_rockingspeed) {
        WALLPAPER.background.setRotationSpeed(settings.background_effect_rockingspeed.value / 100);
    }
    // Glitch settings
    if (settings.background_effect_glitch) {
        WALLPAPER.background.settings.enableDistort = settings.background_effect_glitch.value;
    }

    if (settings.background_effect_glitchstrength) {
        WALLPAPER.background.settings.distortStrength = settings.background_effect_glitchstrength.value / 100;
    }
    if (settings.background_effect_glitcherrors) {
        WALLPAPER.background.settings.distortErrors = settings.background_effect_glitcherrors.value / 100;
    }
    if (settings.background_effect_glitchbasslevel) {
        WALLPAPER.background.settings.distortBassLevel = settings.background_effect_glitchbasslevel.value / 100;
    }
    if (settings.background_effect_glitchopacity) {
        WALLPAPER.background.settings.distortOpacity = settings.background_effect_glitchopacity.value / 100;
    }
}