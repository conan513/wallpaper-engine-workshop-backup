var visual_bar_colorObject = {};
var visual_bar_settings = function(settings) {
    // Set enabled or disabled
    if (settings.visual_bar_enabled) {
        WALLPAPER.visual_bar.Enable(settings.visual_bar_enabled.value);
    }
    // Set number of bars
    if (settings.visual_bar_numberbars) {
        if (settings.visual_bar_numberbars.value !== "") {
            WALLPAPER.visual_bar.setPrecision(settings.visual_bar_numberbars.value);
            WALLPAPER.visual_bar.enableRotateColours(WALLPAPER.visual_bar.settings.enableRotateColours);
        }
    }
    // Set Channel
    if (settings.visual_bar_channel) {
        if (settings.visual_bar_channel.value !== "") {
            WALLPAPER.visual_bar.settings.channel = settings.visual_bar_channel.value;
        }
    }
    // Channel Render
    if (settings.visual_bar_channel_option) {
        if (settings.visual_bar_channel_option.value !== "") {
            WALLPAPER.visual_bar.settings.channel_render = settings.visual_bar_channel_option.value;
        }
    }
    // Channel Reverse
    if (settings.visual_bar_channel_mirror) {
        if (settings.visual_bar_channel_mirror.value !== "") {
            WALLPAPER.visual_bar.settings.channel_reverse = settings.visual_bar_channel_mirror.value;
        }
    }
    // Set the strength multiplier
    if (settings.visual_bar_strength) {
        if (settings.visual_bar_strength.value !== "") {
            WALLPAPER.visual_bar.settings.strengthMultiplier = settings.visual_bar_strength.value;
        }
    }
    // Set the bar width
    if (settings.visual_bar_barwidth) {
        if (settings.visual_bar_barwidth.value !== "") {
            WALLPAPER.visual_bar.settings.barWidth = settings.visual_bar_barwidth.value;
        }
    }
    // Set the bar gap
    if (settings.visual_bar_bargap) {
        if (settings.visual_bar_bargap.value !== "") {
            WALLPAPER.visual_bar.settings.barGap = settings.visual_bar_bargap.value;
        }
    }
    // Set custom color
    if (settings.visual_bar_color) {
        if (settings.visual_bar_color.value !== "") {
            var c = settings.visual_bar_color.value;
            var colour = new Colour().FromRGBOneScaleString(c);
            WALLPAPER.visual_bar.settings.color = colour.RGBColourString();
        }
    }
    // Use custom color
    if (settings.visual_bar_enablecolor) {
        if (settings.visual_bar_enablecolor.value !== "") {
            if (!settings.visual_bar_enablecolor.value) {
                WALLPAPER.visual_bar.settings.color = null;
            }
        }
    }
    // Set visual alpha
    if (settings.visual_bar_alpha) {
        if (settings.visual_bar_alpha.value !== "") {
            WALLPAPER.visual_bar.settings.alpha = settings.visual_bar_alpha.value / 100;
        }
    }
    // Set the bar vertical position offset
    if (settings.visual_bar_verticalposition) {
        if (settings.visual_bar_verticalposition.value !== "") {
            WALLPAPER.visual_bar.settings.barsVerticalPosition = settings.visual_bar_verticalposition.value;
        }
    }
    // Set the bar horizontal position offset
    if (settings.visual_bar_horizontalposition) {
        if (settings.visual_bar_horizontalposition.value !== "") {
            WALLPAPER.visual_bar.settings.barsHorizontalPosition = settings.visual_bar_horizontalposition.value;
        }
    }
    // Set the bar rotation
    if (settings.visual_bar_rotation) {
        if (settings.visual_bar_rotation.value !== "") {
            WALLPAPER.visual_bar.settings.rotation = settings.visual_bar_rotation.value;
        }
    }
    // Set the bar height limit
    if (settings.visual_bar_heightlimit) {
        if (settings.visual_bar_heightlimit.value !== "") {
            WALLPAPER.visual_bar.settings.heightLimit = settings.visual_bar_heightlimit.value;
        }
    }
    // Set the bar vertical growth offset
    if (settings.visual_bar_verticalgrowthoffset) {
        if (settings.visual_bar_verticalgrowthoffset.value !== "") {
            WALLPAPER.visual_bar.settings.verticalGrowthOffset = settings.visual_bar_verticalgrowthoffset.value;
        }
    }
    // Set the bar horitontal split
    if (settings.visual_bar_horizontalsplit) {
        if (settings.visual_bar_horizontalsplit.value !== "") {
            WALLPAPER.visual_bar.settings.enableSplit = settings.visual_bar_horizontalsplit.value;
        }
    }
    // Set the bar horizontal split alpha
    if (settings.visual_bar_horizontalsplitalpha) {
        if (settings.visual_bar_horizontalsplitalpha.value !== "") {
            WALLPAPER.visual_bar.settings.splitAlpha = settings.visual_bar_horizontalsplitalpha.value / 100;
        }
    }
    // Set the bar rotate colors
    if (settings.visual_bar_rotatecolor) {
        if (settings.visual_bar_rotatecolor.value !== "") {
            WALLPAPER.visual_bar.enableRotateColours(settings.visual_bar_rotatecolor.value);
        }
    }
    // Set the bar rotate color duration
    if (settings.visual_bar_rotatecolorspeed) {
        if (settings.visual_bar_rotatecolorspeed.value !== "") {
            WALLPAPER.visual_bar.settings.rotateColoursDuration = settings.visual_bar_rotatecolorspeed.value * 1000;
            WALLPAPER.visual_bar.enableRotateColours(WALLPAPER.visual_bar.settings.enableRotateColours);
        }
    }
    // Set the bar rotate colors left to right
    if (settings.visual_bar_rotatecolorl2r) {
        if (settings.visual_bar_rotatecolorl2r.value !== "") {
            WALLPAPER.visual_bar.settings.rotateColoursL2R = settings.visual_bar_rotatecolorl2r.value;
        }
    }
    // Enable circle mode
    if (settings.visual_bar_circlemode) {
        if (settings.visual_bar_circlemode.value !== "") {
            WALLPAPER.visual_bar.settings.circleMode = settings.visual_bar_circlemode.value;
        }
    }
    // Set the circle mode size
    if (settings.visual_bar_circlesize) {
        if (settings.visual_bar_circlesize.value !== "") {
            WALLPAPER.visual_bar.settings.circleSize = settings.visual_bar_circlesize.value;
        }
    }
    // Set the circle mode size
    if (settings.visual_bar_circle_arc) {
        if (settings.visual_bar_circle_arc.value !== "") {
            WALLPAPER.visual_bar.settings.arc_degrees = settings.visual_bar_circle_arc.value;
        }
    }
    // Enable rotation
    if (settings.visual_bar_enablerotation) {
        if (settings.visual_bar_enablerotation.value !== "") {
            WALLPAPER.visual_bar.enableRotation(settings.visual_bar_enablerotation.value, WALLPAPER.visual_bar.settings.rotationCCW);
        }
    }
    // Enable rotation CCW
    if (settings.visual_bar_rotationccw) {
        if (settings.visual_bar_rotationccw.value !== "") {
            WALLPAPER.visual_bar.enableRotation(WALLPAPER.visual_bar.settings.enableRotation, settings.visual_bar_rotationccw.value);
        }
    }
    // Set rotation speed
    if (settings.visual_bar_rotationspeed) {
        if (settings.visual_bar_rotationspeed.value !== "") {
            WALLPAPER.visual_bar.settings.rotationDuration = settings.visual_bar_rotationspeed.value * 1000;
            WALLPAPER.visual_bar.enableRotation(WALLPAPER.visual_bar.settings.enableRotation, WALLPAPER.visual_bar.settings.rotationCCW);
        }
    }
    // Enable the border
    if (settings.visual_bar_enableborder) {
        if (settings.visual_bar_enableborder.value !== "") {
            WALLPAPER.visual_bar.settings.enableBorder = settings.visual_bar_enableborder.value;
        }
    }
    // Set the border width
    if (settings.visual_bar_borderwidth) {
        if (settings.visual_bar_borderwidth.value !== "") {
            WALLPAPER.visual_bar.settings.borderWidth = settings.visual_bar_borderwidth.value;
        }
    }
    // Set the border alpha
    if (settings.visual_bar_borderalpha) {
        if (settings.visual_bar_borderalpha.value !== "") {
            WALLPAPER.visual_bar.settings.borderAlpha = settings.visual_bar_borderalpha.value / 100;
        }
    }
    // Set the border color
    if (settings.visual_bar_bordercolor) {
        if (settings.visual_bar_bordercolor.value !== "") {
            var c = settings.visual_bar_bordercolor.value;
            var color = new Colour().FromRGBOneScaleString(c);
            WALLPAPER.visual_bar.settings.borderColor = color.RGBColourString();
        }
    }
    // Set the cap type of the lines
    if (settings.visual_bar_capstype) {
        if (settings.visual_bar_capstype.value !== "") {
            WALLPAPER.visual_bar.settings.lineCapsType = settings.visual_bar_capstype.value;
        }
    }
    // reverse rainbow colors
    if (settings.visual_bar_reverserainbow) {
        if (settings.visual_bar_reverserainbow.value !== "") {
            WALLPAPER.visual_bar.settings.reverseRainbow = settings.visual_bar_reverserainbow.value;
        }
    }
    // Hide inactive
    if (settings.visual_bar_hideinactive) {
        if (settings.visual_bar_hideinactive.value !== "") {
            WALLPAPER.visual_bar.settings.hideNoSound = settings.visual_bar_hideinactive.value;
        }
    }
    // Inactive wait time
    if (settings.visual_bar_hideinactivetimeout) {
        if (settings.visual_bar_hideinactivetimeout.value !== "") {
            WALLPAPER.visual_bar.settings.hideNoSoundDelay = settings.visual_bar_hideinactivetimeout.value * 1000;
        }
    }
    // Inactive fade duration
    if (settings.visual_bar_hideinactivefadeduration) {
        if (settings.visual_bar_hideinactivefadeduration.value !== "") {
            WALLPAPER.visual_bar.settings.hideNoSoundFadeDuration = settings.visual_bar_hideinactivefadeduration.value * 1000;
        }
    }


    if(settings.visual_gradient){
        WALLPAPER.visual_bar.settings.enableCustomGradient = settings.visual_gradient.value;
    }

    if(settings.visual_gradient_number) {
       visual_bar_colorObject.count = settings.visual_gradient_number.value;
    }
    if(settings.visual_gradient_color_1) {
        var rgb = settings.visual_gradient_color_1.value.split(" ");
        visual_bar_colorObject.color1 = ARTHESIAN.Helper.Colour.rgb1ScaleToHexString(rgb[0],rgb[1],rgb[2]);
    }
    if(settings.visual_gradient_color_1_position){
        visual_bar_colorObject.color1position = settings.visual_gradient_color_1_position.value;
    }
    if(settings.visual_gradient_color_2) {
        var rgb = settings.visual_gradient_color_2.value.split(" ");
        visual_bar_colorObject.color2 = ARTHESIAN.Helper.Colour.rgb1ScaleToHexString(rgb[0],rgb[1],rgb[2]);
    }
    if(settings.visual_gradient_color_2_position){
        visual_bar_colorObject.color2position = settings.visual_gradient_color_2_position.value;
    }
    if(settings.visual_gradient_color_3) {
        var rgb = settings.visual_gradient_color_3.value.split(" ");
        visual_bar_colorObject.color3 = ARTHESIAN.Helper.Colour.rgb1ScaleToHexString(rgb[0],rgb[1],rgb[2]);
    }
    if(settings.visual_gradient_color_3_position){
        visual_bar_colorObject.color3position = settings.visual_gradient_color_3_position.value;
    }
    if(settings.visual_gradient_color_4) {
        var rgb = settings.visual_gradient_color_4.value.split(" ");
        visual_bar_colorObject.color4 = ARTHESIAN.Helper.Colour.rgb1ScaleToHexString(rgb[0],rgb[1],rgb[2]);
    }
    if(settings.visual_gradient_color_4_position){
        visual_bar_colorObject.color4position = settings.visual_gradient_color_4_position.value;
    }
    if(settings.visual_gradient_color_5) {
        var rgb = settings.visual_gradient_color_5.value.split(" ");
        visual_bar_colorObject.color5 = ARTHESIAN.Helper.Colour.rgb1ScaleToHexString(rgb[0],rgb[1],rgb[2]);
    }
    if(settings.visual_gradient_color_5_position){
        visual_bar_colorObject.color5position = settings.visual_gradient_color_5_position.value;
    }
    if(settings.visual_gradient_color_6) {
        var rgb = settings.visual_gradient_color_6.value.split(" ");
        visual_bar_colorObject.color6 = ARTHESIAN.Helper.Colour.rgb1ScaleToHexString(rgb[0],rgb[1],rgb[2]);
    }
    if(settings.visual_gradient_color_6_position){
        visual_bar_colorObject.color6position = settings.visual_gradient_color_6_position.value;
    }
    if(settings.visual_gradient_color_7) {
        var rgb = settings.visual_gradient_color_7.value.split(" ");
        visual_bar_colorObject.color7 = ARTHESIAN.Helper.Colour.rgb1ScaleToHexString(rgb[0],rgb[1],rgb[2]);
    }
    if(settings.visual_gradient_color_7_position){
        visual_bar_colorObject.color7position = settings.visual_gradient_color_7_position.value;
    }
    if(settings.visual_gradient_color_8) {
        var rgb = settings.visual_gradient_color_8.value.split(" ");
        visual_bar_colorObject.color8 = ARTHESIAN.Helper.Colour.rgb1ScaleToHexString(rgb[0],rgb[1],rgb[2]);
    }
    if(settings.visual_gradient_color_8_position){
        visual_bar_colorObject.color8position = settings.visual_gradient_color_8_position.value;
    }
    if(settings.visual_gradient_color_9) {
        var rgb = settings.visual_gradient_color_9.value.split(" ");
        visual_bar_colorObject.color9 = ARTHESIAN.Helper.Colour.rgb1ScaleToHexString(rgb[0],rgb[1],rgb[2]);
    }
    if(settings.visual_gradient_color_9_position){
        visual_bar_colorObject.color9position = settings.visual_gradient_color_9_position.value;
    }
    if(settings.visual_gradient_color_10) {
        var rgb = settings.visual_gradient_color_10.value.split(" ");
        visual_bar_colorObject.color10 = ARTHESIAN.Helper.Colour.rgb1ScaleToHexString(rgb[0],rgb[1],rgb[2]);
    }
    if(settings.visual_gradient_color_10_position){
        visual_bar_colorObject.color10position = settings.visual_gradient_color_10_position.value;
    }

    var setVisualCustomGradientColors = function(){
        WALLPAPER.visual_bar.setCustomGradient(visual_bar_colorObject);
    }

    setVisualCustomGradientColors();


    // Z-index
    if(settings.visual_bar_zindex) {
        WALLPAPER.visual_bar.settings.zIndex = settings.visual_bar_zindex.value;
    }

    // Spline - Draw Type
    if(settings.visual_bar_type) {
        WALLPAPER.visual_bar.settings.drawMode = settings.visual_bar_type.value == 1 ? 'spline' : 'bar';
    }
    if(settings.visual_bar_spline_layers) {
        WALLPAPER.visual_bar.settings.spline_layers = settings.visual_bar_spline_layers.value;
    }
    if(settings.visual_bar_spline_empty_endpoints) {
        WALLPAPER.visual_bar.settings.spline_empty_endpoints = settings.visual_bar_spline_empty_endpoints.value;
    }
    if(settings.visual_bar_spline_fill_alpha) {
        WALLPAPER.visual_bar.settings.spline_fill_alpha = settings.visual_bar_spline_fill_alpha.value;
    }
}