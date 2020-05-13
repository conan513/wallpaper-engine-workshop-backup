
var background_edits = '';
var handle_background_edits = function(settings) {
    
    // Get reference to Filter Helper
    let filter_helper = ARTHESIAN.Helper.Filter;

    // Get reference to background
    let background = document.getElementById('background');

    // If no effects, set to empty and return
    if(settings.background_edit) {
        if(!settings.background_edit.value) {
            background.style.filter = '';
            return;
        }
    }

    // Handle Contrast
    if(settings.background_edit_contrast) {
        if(settings.background_edit_contrast.value) {
            background_edits = filter_helper.replaceContrast(background_edits, settings.background_edit_contrast.value);
        } else {
            background_edits = filter_helper.removeContrast(background_edits);
        }
    }

    // Handle Brightness
    if(settings.background_edit_brightness) {
        if(settings.background_edit_brightness.value) {
            background_edits = filter_helper.replaceBrightness(background_edits, settings.background_edit_brightness.value);
        } else {
            background_edits = filter_helper.removeBrightness(background_edits);
        }
    }

    // Handle Saturation
    if(settings.background_edit_saturation) {
        if(settings.background_edit_saturation.value) {
            background_edits = filter_helper.replaceSaturation(background_edits, settings.background_edit_saturation.value);
        } else {
            background_edits = filter_helper.removeSaturation(background_edits);
        }
    }

    // Handle Grayscale
    if(settings.background_edit_grayscale) {
        if(settings.background_edit_grayscale.value) {
            background_edits = filter_helper.replaceGrayScale(background_edits, settings.background_edit_grayscale.value);
        } else {
            background_edits = filter_helper.removeGrayScale(background_edits);
        }
    }

    // Handle Invert colors
    if(settings.background_edit_invert) {
        if(settings.background_edit_invert.value) {
            background_edits = filter_helper.addInvert(background_edits);
        } else {
            background_edits = filter_helper.removeInvert(background_edits);
        }
    }

    // Apply filter
    background.style.filter = background_edits;
}

var foreground_edits = '';
var handle_foreground_edits = function(settings) {
    
    // Get reference to Filter Helper
    let filter_helper = ARTHESIAN.Helper.Filter;

    // Get reference to foreground
    let foreground = document.getElementById('foreground');

    // If no effects, set to empty and return
    if(settings.foreground_edit) {
        if(!settings.foreground_edit.value) {
            foreground.style.filter = '';
            return;
        }
    }

    // Handle Contrast
    if(settings.foreground_edit_contrast) {
        if(settings.foreground_edit_contrast.value) {
            foreground_edits = filter_helper.replaceContrast(foreground_edits, settings.foreground_edit_contrast.value);
        } else {
            foreground_edits = filter_helper.removeContrast(foreground_edits);
        }
    }

    // Handle Brightness
    if(settings.foreground_edit_brightness) {
        if(settings.foreground_edit_brightness.value) {
            foreground_edits = filter_helper.replaceBrightness(foreground_edits, settings.foreground_edit_brightness.value);
        } else {
            foreground_edits = filter_helper.removeBrightness(foreground_edits);
        }
    }

    // Handle Saturation
    if(settings.foreground_edit_saturation) {
        if(settings.foreground_edit_saturation.value) {
            foreground_edits = filter_helper.replaceSaturation(foreground_edits, settings.foreground_edit_saturation.value);
        } else {
            foreground_edits = filter_helper.removeSaturation(foreground_edits);
        }
    }

    // Handle Grayscale
    if(settings.foreground_edit_grayscale) {
        if(settings.foreground_edit_grayscale.value) {
            foreground_edits = filter_helper.replaceGrayScale(foreground_edits, settings.foreground_edit_grayscale.value);
        } else {
            foreground_edits = filter_helper.removeGrayScale(foreground_edits);
        }
    }

    // Handle Invert colors
    if(settings.foreground_edit_invert) {
        if(settings.foreground_edit_invert.value) {
            foreground_edits = filter_helper.addInvert(foreground_edits);
        } else {
            foreground_edits = filter_helper.removeInvert(foreground_edits);
        }
    }

    // Apply filter
    foreground.style.filter = foreground_edits;
}