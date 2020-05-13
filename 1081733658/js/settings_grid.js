var gridSettingsObject = {};
var grid_settings = function (settings) {
    var reload = false;

    // Enable Grid
    if (settings.grid_enabled) {
        if (settings.grid_enabled.value !== "") {
            WALLPAPER.grid.Enable(settings.grid_enabled.value);
        }
    }
    // Set grid color
    if (settings.grid_color) {
        if (settings.grid_color.value !== "") {
            var c = settings.grid_color.value;
            var colour = new Colour().FromRGBOneScaleString(c);
            WALLPAPER.grid.settings.color = colour.RGBString();

            reload = true;
        }
    }
    // Number of dots on X-axis
    if (settings.grid_amountX) {
        if (settings.grid_amountX.value !== "") {
            WALLPAPER.grid.settings.gridAmountX = settings.grid_amountX.value;

            reload = true;
        }
    }
    // Number of dots on Y-axis
    if (settings.grid_amountY) {
        if (settings.grid_amountY.value !== "") {
            WALLPAPER.grid.settings.gridAmountY = settings.grid_amountY.value;

            reload = true;
        }
    }
    // Number of dots on Y-axis
    if (settings.grid_type) {
        if (settings.grid_type.value !== "") {
            WALLPAPER.grid.settings.type = settings.grid_type.value;

            reload = true;
        }
    }
    // Grid hi-light visibility
    if (settings.grid_visibility) {
        if (settings.grid_visibility.value !== "") {
            WALLPAPER.grid.settings.maxActive = settings.grid_visibility.value / 100;
        }
    }

    // Reload grid is some 'breaking' properties changed
    if (reload) {
        WALLPAPER.grid.reload();
    }
}