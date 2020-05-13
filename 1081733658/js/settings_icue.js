var icue_settings = function (settings) {
    
    if(settings.icue_enable) {
        ARTHESIAN.Helper.iCUE.enabled = settings.icue_enable.value;
    }

    if(settings.icue_color) {

        let rgb1 = settings.icue_color.value.split(" ");

        var rgb = ARTHESIAN.Helper.Colour.rgb1ScaleToRgb(rgb1[0], rgb1[1], rgb1[2]);
        let hsl = ARTHESIAN.Helper.Colour.rgbToHsl(rgb.r, rgb.g, rgb.b);

        ARTHESIAN.Helper.iCUE.settings.hsl = hsl;
    }

    if(settings.icue_rotatehue) {
        ARTHESIAN.Helper.iCUE.hueRotationEnabled = settings.icue_rotatehue.value
    }

    if(settings.icue_rotatehueduration) {
        ARTHESIAN.Helper.iCUE.hueRotationDuration = settings.icue_rotatehueduration.value * 1000;
    }

    if(settings.icue_brightnessdecrease) {
        ARTHESIAN.Helper.iCUE.settings.brightnessDecrease = settings.icue_brightnessdecrease.value
    }
}