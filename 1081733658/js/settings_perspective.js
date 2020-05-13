var perspective_settings = function (settings) {
    // Enable or disable perspective
    if (settings.perspective_enabled) {
        if (settings.perspective_enabled.value !== "") {
            WALLPAPER.perspective.Enable(settings.perspective_enabled.value);
        }
    }
    // Set the perspective strength
    if (settings.perspective_strength) {
        if (settings.perspective_strength.value !== "") {
            WALLPAPER.perspective.SetPerspectiveStrength(settings.perspective_strength.value);
        }
    }
    // Set the perspective distance
    if (settings.perspective_distance) {
        if (settings.perspective_distance.value !== "") {
            WALLPAPER.perspective.SetPerspectiveDistance(settings.perspective_distance.value);
        }
    }
    // Set static tilt enabled/disabled
    if (settings.perpective_static) {
        if (settings.perpective_static.value !== "") {
            WALLPAPER.perspective.UseStaticPerspective(settings.perpective_static.value);
        }
    }
    // Set the static tilt Y
    if (settings.perspective_tilt_y) {
        if (settings.perspective_tilt_y.value !== "") {
            WALLPAPER.perspective.SetStaticTiltY(settings.perspective_tilt_y.value);
        }
    }
    // Set the static tilt X
    if (settings.perspective_tilt_x) {
        if (settings.perspective_tilt_x.value !== "") {
            WALLPAPER.perspective.SetStaticTiltX(settings.perspective_tilt_x.value);
        }
    }
    // Set the static shift Y
    if (settings.perspective_shift_y) {
        if (settings.perspective_shift_y.value !== "") {
            WALLPAPER.perspective.SetStaticShiftY(settings.perspective_shift_y.value);
        }
    }
    // Set the static shift X
    if (settings.perspective_shift_x) {
        if (settings.perspective_shift_x.value !== "") {
            WALLPAPER.perspective.SetStaticShiftX(settings.perspective_shift_x.value);
        }
    }
}