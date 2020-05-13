var confetti_settings = function(settings) {
   
    // Enable confetti
    if (settings.confetti_enable) {
        if (settings.confetti_enable.value !== "") {
            WALLPAPER.confetti.Enable(settings.confetti_enable.value)
        }
    }
    // Minimum sound to spawn confetti
    if (settings.confetti_minsound) {
        if (settings.confetti_minsound.value !== "") {
            WALLPAPER.confetti.settings.minimumSound = settings.confetti_minsound.value;
        }
    }
    // Set confetti flake size
    if (settings.confetti_size) {
        if (settings.confetti_size.value !== "") {
            WALLPAPER.confetti.settings.size = settings.confetti_size.value;
        }
    }
    // Set confetti spawn radius size
    if (settings.confetti_spawnradius) {
        if (settings.confetti_spawnradius.value !== "") {
            WALLPAPER.confetti.settings.spawnCircleSize = settings.confetti_spawnradius.value;
        }
    }
    // Set confetti burst spawn delay
    if (settings.confetti_spawndelay) {
        if (settings.confetti_spawndelay.value !== "") {
            WALLPAPER.confetti.settings.spawnDelay = settings.confetti_spawndelay.value;
        }
    }
    // Set confetti burst size
    if (settings.confetti_burstsize) {
        if (settings.confetti_burstsize.value !== "") {
            WALLPAPER.confetti.settings.burstSize = settings.confetti_burstsize.value;
        }
    }
    // Set confetti speed
    if (settings.confetti_animationspeed) {
        if (settings.confetti_animationspeed.value !== "") {
            WALLPAPER.confetti.settings.animationSpeed = settings.confetti_animationspeed.value / 10;
        }
    }
    // Set confetti color
    if (settings.confetti_customcolor) {
        if (settings.confetti_customcolor.value !== "") {
            var c = settings.confetti_customcolor.value;
            var colour = new Colour().FromRGBOneScaleString(c);
            WALLPAPER.confetti.settings.color = colour.RGBColourString();
        }
    }
    // Enable custom color
    if (settings.confetti_usecustomcolor) {
        if (settings.confetti_usecustomcolor.value !== "") {
            if (!settings.confetti_usecustomcolor.value) {
                WALLPAPER.confetti.settings.color = null;
            }
        }
    }
    // Offset X
    if (settings.confetti_offsetx) {
        if (settings.confetti_offsetx.value !== "") {
            WALLPAPER.confetti.settings.offsetX = settings.confetti_offsetx.value;
        }
    }
    // Offset Y
    if (settings.confetti_offsety) {
        if (settings.confetti_offsety.value !== "") {
            WALLPAPER.confetti.settings.offsetY = settings.confetti_offsety.value;
        }
    }
    // Enable confetti in visualizer idle mode
    if (settings.confetti_enablewhenidle) {
        if (settings.confetti_enablewhenidle.value !== "") {
            WALLPAPER.confetti.settings.enabledIdle = settings.confetti_enablewhenidle.value;
        }
    }
    // Enable confetti rotation
    if (settings.confetti_rotate) {
        if (settings.confetti_rotate.value !== "") {
            WALLPAPER.confetti.EnableRotation(settings.confetti_rotate.value)
        }
    }
    // Enable confetti rotation
    if (settings.confetti_rotate_ccw) {
        if (settings.confetti_rotate_ccw.value !== "") {
            WALLPAPER.confetti.settings.rotationCCW = settings.confetti_rotate_ccw.value;
            WALLPAPER.confetti.EnableRotation(WALLPAPER.confetti.settings.rotate, settings.confetti_rotate_ccw.value);
        }
    }
    // Set confetti rotation speed
    if (settings.confetti_rotateduration) {
        if (settings.confetti_rotateduration.value !== "") {
            WALLPAPER.confetti.setRotationDuration(settings.confetti_rotateduration.value * 1000)
        }
    }

    // Z-index
    if(settings.confetti_zindex) {
        WALLPAPER.confetti.settings.zIndex = settings.confetti_zindex.value;
    }


    if(settings.confetti_circle_mode) {
        WALLPAPER.confetti.settings.circleMode = settings.confetti_circle_mode.value;
    }

    if(settings.confetti_direction) {
        WALLPAPER.confetti.settings.movementDirection = settings.confetti_direction.value;
    }

    if(settings.confetti_movement_ease) {
        WALLPAPER.confetti.settings.movementEase = settings.confetti_movement_ease.value;
    }
    
    if(settings.confetti_fade) {
        WALLPAPER.confetti.settings.useFade = settings.confetti_fade.value;
    }
    
    if(settings.confetti_distance_mutliplier) {
        WALLPAPER.confetti.settings.travelDistanceMultiplier = settings.confetti_distance_mutliplier.value / 100;
    }
}