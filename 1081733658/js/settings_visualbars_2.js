var visual_bar2_colorObject = {};
var visual_bar2_settings = function(settings) {
    // Set enabled or disabled
    if (settings.visual_bar2_enabled) {
        WALLPAPER.visual_bar2.Enable(settings.visual_bar2_enabled.value);
    }
    // Set number of bars
    if (settings.visual_bar2_numberbars) {
        if (settings.visual_bar2_numberbars.value !== "") {
            WALLPAPER.visual_bar2.setPrecision(settings.visual_bar2_numberbars.value);
            WALLPAPER.visual_bar2.enableRotateColours(WALLPAPER.visual_bar2.settings.enableRotateColours);
        }
    }
    // Set Channel
    if (settings.visual_bar2_channel) {
        if (settings.visual_bar2_channel.value !== "") {
            WALLPAPER.visual_bar2.settings.channel = settings.visual_bar2_channel.value;
        }
    }
    // Channel Render
    if (settings.visual_bar2_channel_option) {
        if (settings.visual_bar2_channel_option.value !== "") {
            WALLPAPER.visual_bar2.settings.channel_render = settings.visual_bar2_channel_option.value;
        }
    }
    // Channel Reverse
    if (settings.visual_bar2_channel_mirror) {
        if (settings.visual_bar2_channel_mirror.value !== "") {
            WALLPAPER.visual_bar2.settings.channel_reverse = settings.visual_bar2_channel_mirror.value;
        }
    }
    // Set the strength multiplier
    if (settings.visual_bar2_strength) {
        if (settings.visual_bar2_strength.value !== "") {
            WALLPAPER.visual_bar2.settings.strengthMultiplier = settings.visual_bar2_strength.value;
        }
    }
    // Set the bar width
    if (settings.visual_bar2_barwidth) {
        if (settings.visual_bar2_barwidth.value !== "") {
            WALLPAPER.visual_bar2.settings.barWidth = settings.visual_bar2_barwidth.value;
        }
    }
    // Set the bar gap
    if (settings.visual_bar2_bargap) {
        if (settings.visual_bar2_bargap.value !== "") {
            WALLPAPER.visual_bar2.settings.barGap = settings.visual_bar2_bargap.value;
        }
    }
    // Set custom color
    if (settings.visual_bar2_color) {
        if (settings.visual_bar2_color.value !== "") {
            var c = settings.visual_bar2_color.value;
            var colour = new Colour().FromRGBOneScaleString(c);
            WALLPAPER.visual_bar2.settings.color = colour.RGBColourString();
        }
    }
    // Use custom color
    if (settings.visual_bar2_enablecolor) {
        if (settings.visual_bar2_enablecolor.value !== "") {
            if (!settings.visual_bar2_enablecolor.value) {
                WALLPAPER.visual_bar2.settings.color = null;
            }
        }
    }
    // Set visual alpha
    if (settings.visual_bar2_alpha) {
        if (settings.visual_bar2_alpha.value !== "") {
            WALLPAPER.visual_bar2.settings.alpha = settings.visual_bar2_alpha.value / 100;
        }
    }
    // Set the bar vertical position offset
    if (settings.visual_bar2_verticalposition) {
        if (settings.visual_bar2_verticalposition.value !== "") {
            WALLPAPER.visual_bar2.settings.barsVerticalPosition = settings.visual_bar2_verticalposition.value;
        }
    }
    // Set the bar horizontal position offset
    if (settings.visual_bar2_horizontalposition) {
        if (settings.visual_bar2_horizontalposition.value !== "") {
            WALLPAPER.visual_bar2.settings.barsHorizontalPosition = settings.visual_bar2_horizontalposition.value;
        }
    }
    // Set the bar rotation
    if (settings.visual_bar2_rotation) {
        if (settings.visual_bar2_rotation.value !== "") {
            WALLPAPER.visual_bar2.settings.rotation = settings.visual_bar2_rotation.value;
        }
    }
    // Set the bar height limit
    if (settings.visual_bar2_heightlimit) {
        if (settings.visual_bar2_heightlimit.value !== "") {
            WALLPAPER.visual_bar2.settings.heightLimit = settings.visual_bar2_heightlimit.value;
        }
    }
    // Set the bar vertical growth offset
    if (settings.visual_bar2_verticalgrowthoffset) {
        if (settings.visual_bar2_verticalgrowthoffset.value !== "") {
            WALLPAPER.visual_bar2.settings.verticalGrowthOffset = settings.visual_bar2_verticalgrowthoffset.value;
        }
    }
    // Set the bar horitontal split
    if (settings.visual_bar2_horizontalsplit) {
        if (settings.visual_bar2_horizontalsplit.value !== "") {
            WALLPAPER.visual_bar2.settings.enableSplit = settings.visual_bar2_horizontalsplit.value;
        }
    }
    // Set the bar horizontal split alpha
    if (settings.visual_bar2_horizontalsplitalpha) {
        if (settings.visual_bar2_horizontalsplitalpha.value !== "") {
            WALLPAPER.visual_bar2.settings.splitAlpha = settings.visual_bar2_horizontalsplitalpha.value / 100;
        }
    }
    // Set the bar rotate colors
    if (settings.visual_bar2_rotatecolor) {
        if (settings.visual_bar2_rotatecolor.value !== "") {
            WALLPAPER.visual_bar2.enableRotateColours(settings.visual_bar2_rotatecolor.value);
        }
    }
    // Set the bar rotate color duration
    if (settings.visual_bar2_rotatecolorspeed) {
        if (settings.visual_bar2_rotatecolorspeed.value !== "") {
            WALLPAPER.visual_bar2.settings.rotateColoursDuration = settings.visual_bar2_rotatecolorspeed.value * 1000;
            WALLPAPER.visual_bar2.enableRotateColours(WALLPAPER.visual_bar2.settings.enableRotateColours);
        }
    }
    // Set the bar rotate colors left to right
    if (settings.visual_bar2_rotatecolorl2r) {
        if (settings.visual_bar2_rotatecolorl2r.value !== "") {
            WALLPAPER.visual_bar2.settings.rotateColoursL2R = settings.visual_bar2_rotatecolorl2r.value;
        }
    }
    // Enable circle mode
    if (settings.visual_bar2_circlemode) {
        if (settings.visual_bar2_circlemode.value !== "") {
            WALLPAPER.visual_bar2.settings.circleMode = settings.visual_bar2_circlemode.value;
        }
    }
    // Set the circle mode size
    if (settings.visual_bar2_circlesize) {
        if (settings.visual_bar2_circlesize.value !== "") {
            WALLPAPER.visual_bar2.settings.circleSize = settings.visual_bar2_circlesize.value;
        }
    }
    // Set the circle mode size
    if (settings.visual_bar2_circle_arc) {
        if (settings.visual_bar2_circle_arc.value !== "") {
            WALLPAPER.visual_bar2.settings.arc_degrees = settings.visual_bar2_circle_arc.value;
        }
    }
    // Enable rotation
    if (settings.visual_bar2_enablerotation) {
        if (settings.visual_bar2_enablerotation.value !== "") {
            WALLPAPER.visual_bar2.enableRotation(settings.visual_bar2_enablerotation.value, WALLPAPER.visual_bar2.settings.rotationCCW);
        }
    }
    // Enable rotation CCW
    if (settings.visual_bar2_rotationccw) {
        if (settings.visual_bar2_rotationccw.value !== "") {
            WALLPAPER.visual_bar2.enableRotation(WALLPAPER.visual_bar2.settings.enableRotation, settings.visual_bar2_rotationccw.value);
        }
    }
    // Set rotation speed
    if (settings.visual_bar2_rotationspeed) {
        if (settings.visual_bar2_rotationspeed.value !== "") {
            WALLPAPER.visual_bar2.settings.rotationDuration = settings.visual_bar2_rotationspeed.value * 1000;
            WALLPAPER.visual_bar2.enableRotation(WALLPAPER.visual_bar2.settings.enableRotation, WALLPAPER.visual_bar2.settings.rotationCCW);
        }
    }
    // Enable the border
    if (settings.visual_bar2_enableborder) {
        if (settings.visual_bar2_enableborder.value !== "") {
            WALLPAPER.visual_bar2.settings.enableBorder = settings.visual_bar2_enableborder.value;
        }
    }
    // Set the border width
    if (settings.visual_bar2_borderwidth) {
        if (settings.visual_bar2_borderwidth.value !== "") {
            WALLPAPER.visual_bar2.settings.borderWidth = settings.visual_bar2_borderwidth.value;
        }
    }
    // Set the border alpha
    if (settings.visual_bar2_borderalpha) {
        if (settings.visual_bar2_borderalpha.value !== "") {
            WALLPAPER.visual_bar2.settings.borderAlpha = settings.visual_bar2_borderalpha.value / 100;
        }
    }
    // Set the border color
    if (settings.visual_bar2_bordercolor) {
        if (settings.visual_bar2_bordercolor.value !== "") {
            var c = settings.visual_bar2_bordercolor.value;
            var color = new Colour().FromRGBOneScaleString(c);
            WALLPAPER.visual_bar2.settings.borderColor = color.RGBColourString();
        }
    }
    // Set the cap type of the lines
    if (settings.visual_bar2_capstype) {
        if (settings.visual_bar2_capstype.value !== "") {
            WALLPAPER.visual_bar2.settings.lineCapsType = settings.visual_bar2_capstype.value;
        }
    }
    // reverse rainbow colors
    if (settings.visual_bar2_reverserainbow) {
        if (settings.visual_bar2_reverserainbow.value !== "") {
            WALLPAPER.visual_bar2.settings.reverseRainbow = settings.visual_bar2_reverserainbow.value;
        }
    }
    // Hide inactive
    if (settings.visual_bar2_hideinactive) {
        if (settings.visual_bar2_hideinactive.value !== "") {
            WALLPAPER.visual_bar2.settings.hideNoSound = settings.visual_bar2_hideinactive.value;
        }
    }
    // Inactive wait time
    if (settings.visual_bar2_hideinactivetimeout) {
        if (settings.visual_bar2_hideinactivetimeout.value !== "") {
            WALLPAPER.visual_bar2.settings.hideNoSoundDelay = settings.visual_bar2_hideinactivetimeout.value * 1000;
        }
    }
    // Inactive fade duration
    if (settings.visual_bar2_hideinactivefadeduration) {
        if (settings.visual_bar2_hideinactivefadeduration.value !== "") {
            WALLPAPER.visual_bar2.settings.hideNoSoundFadeDuration = settings.visual_bar2_hideinactivefadeduration.value * 1000;
        }
    }


    if(settings.visual2_gradient){
        WALLPAPER.visual_bar2.settings.enableCustomGradient = settings.visual2_gradient.value;
    }

    if(settings.visual2_gradient_number) {
       visual_bar2_colorObject.count = settings.visual2_gradient_number.value;
    }
    if(settings.visual2_gradient_color_1) {
        var rgb = settings.visual2_gradient_color_1.value.split(" ");
        visual_bar2_colorObject.color1 = ARTHESIAN.Helper.Colour.rgb1ScaleToHexString(rgb[0],rgb[1],rgb[2]);
    }
    if(settings.visual2_gradient_color_1_position){
        visual_bar2_colorObject.color1position = settings.visual2_gradient_color_1_position.value;
    }
    if(settings.visual2_gradient_color_2) {
        var rgb = settings.visual2_gradient_color_2.value.split(" ");
        visual_bar2_colorObject.color2 = ARTHESIAN.Helper.Colour.rgb1ScaleToHexString(rgb[0],rgb[1],rgb[2]);
    }
    if(settings.visual2_gradient_color_2_position){
        visual_bar2_colorObject.color2position = settings.visual2_gradient_color_2_position.value;
    }
    if(settings.visual2_gradient_color_3) {
        var rgb = settings.visual2_gradient_color_3.value.split(" ");
        visual_bar2_colorObject.color3 = ARTHESIAN.Helper.Colour.rgb1ScaleToHexString(rgb[0],rgb[1],rgb[2]);
    }
    if(settings.visual2_gradient_color_3_position){
        visual_bar2_colorObject.color3position = settings.visual2_gradient_color_3_position.value;
    }
    if(settings.visual2_gradient_color_4) {
        var rgb = settings.visual2_gradient_color_4.value.split(" ");
        visual_bar2_colorObject.color4 = ARTHESIAN.Helper.Colour.rgb1ScaleToHexString(rgb[0],rgb[1],rgb[2]);
    }
    if(settings.visual2_gradient_color_4_position){
        visual_bar2_colorObject.color4position = settings.visual2_gradient_color_4_position.value;
    }
    if(settings.visual2_gradient_color_5) {
        var rgb = settings.visual2_gradient_color_5.value.split(" ");
        visual_bar2_colorObject.color5 = ARTHESIAN.Helper.Colour.rgb1ScaleToHexString(rgb[0],rgb[1],rgb[2]);
    }
    if(settings.visual2_gradient_color_5_position){
        visual_bar2_colorObject.color5position = settings.visual2_gradient_color_5_position.value;
    }
    if(settings.visual2_gradient_color_6) {
        var rgb = settings.visual2_gradient_color_6.value.split(" ");
        visual_bar2_colorObject.color6 = ARTHESIAN.Helper.Colour.rgb1ScaleToHexString(rgb[0],rgb[1],rgb[2]);
    }
    if(settings.visual2_gradient_color_6_position){
        visual_bar2_colorObject.color6position = settings.visual2_gradient_color_6_position.value;
    }
    if(settings.visual2_gradient_color_7) {
        var rgb = settings.visual2_gradient_color_7.value.split(" ");
        visual_bar2_colorObject.color7 = ARTHESIAN.Helper.Colour.rgb1ScaleToHexString(rgb[0],rgb[1],rgb[2]);
    }
    if(settings.visual2_gradient_color_7_position){
        visual_bar2_colorObject.color7position = settings.visual2_gradient_color_7_position.value;
    }
    if(settings.visual2_gradient_color_8) {
        var rgb = settings.visual2_gradient_color_8.value.split(" ");
        visual_bar2_colorObject.color8 = ARTHESIAN.Helper.Colour.rgb1ScaleToHexString(rgb[0],rgb[1],rgb[2]);
    }
    if(settings.visual2_gradient_color_8_position){
        visual_bar2_colorObject.color8position = settings.visual2_gradient_color_8_position.value;
    }
    if(settings.visual2_gradient_color_9) {
        var rgb = settings.visual2_gradient_color_9.value.split(" ");
        visual_bar2_colorObject.color9 = ARTHESIAN.Helper.Colour.rgb1ScaleToHexString(rgb[0],rgb[1],rgb[2]);
    }
    if(settings.visual2_gradient_color_9_position){
        visual_bar2_colorObject.color9position = settings.visual2_gradient_color_9_position.value;
    }
    if(settings.visual2_gradient_color_10) {
        var rgb = settings.visual2_gradient_color_10.value.split(" ");
        visual_bar2_colorObject.color10 = ARTHESIAN.Helper.Colour.rgb1ScaleToHexString(rgb[0],rgb[1],rgb[2]);
    }
    if(settings.visual2_gradient_color_10_position){
        visual_bar2_colorObject.color10position = settings.visual2_gradient_color_10_position.value;
    }

    var setVisualCustomGradientColors = function(){
        WALLPAPER.visual_bar2.setCustomGradient(visual_bar2_colorObject);
    }

    setVisualCustomGradientColors();

    // Z-index
    if(settings.visual_bar2_zindex) {
        WALLPAPER.visual_bar2.settings.zIndex = settings.visual_bar2_zindex.value;
    }

    // Spline - Draw Type
    if(settings.visual_bar2_type) {
        WALLPAPER.visual_bar2.settings.drawMode = settings.visual_bar2_type.value == 1 ? 'spline' : 'bar';
    }
    if(settings.visual_bar2_spline_layers) {
        WALLPAPER.visual_bar2.settings.spline_layers = settings.visual_bar2_spline_layers.value;
    }
    if(settings.visual_bar2_spline_empty_endpoints) {
        WALLPAPER.visual_bar2.settings.spline_empty_endpoints = settings.visual_bar2_spline_empty_endpoints.value;
    }
    if(settings.visual_bar2_spline_fill_alpha) {
        WALLPAPER.visual_bar2.settings.spline_fill_alpha = settings.visual_bar2_spline_fill_alpha.value;
    }
}