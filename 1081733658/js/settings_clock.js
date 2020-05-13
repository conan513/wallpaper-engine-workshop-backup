var clockSettingsObject = {};
var clock_settings = function(settings) {
    // Type of clock
    if (settings.clock_type) {
        if (settings.clock_type !== "") {
            clockSettingsObject.type = settings.clock_type.value;

            WALLPAPER.clock_digital.Enable(clockSettingsObject.type == 1);
            WALLPAPER.clock_digital2.Enable(clockSettingsObject.type == 2);
            WALLPAPER.clock_analog.Enable(clockSettingsObject.type === 0);
        }
    }
    // If clocks enabled
    if (settings.clock_enable) {
        if (settings.clock_enable.value !== "") {
            if (settings.clock_enable.value) {
                WALLPAPER.clock_digital.Enable(clockSettingsObject.type == 1);
                WALLPAPER.clock_digital2.Enable(clockSettingsObject.type == 2);
                WALLPAPER.clock_analog.Enable(clockSettingsObject.type === 0);
            } else {
                WALLPAPER.clock_digital.Enable(false);
                WALLPAPER.clock_digital2.Enable(false);
                WALLPAPER.clock_analog.Enable(false);
            }
        }
    }
    // Use 24 Hour clock
    if (settings.clock_digital_enable24h) {
        if (settings.clock_digital_enable24h.value !== "") {
            WALLPAPER.clock_digital.Enable24Hour(settings.clock_digital_enable24h.value);
            WALLPAPER.clock_digital2.Enable24Hour(settings.clock_digital_enable24h.value);
        }
    }
    // Use Seconds timer
    if (settings.clock_digital_enableseconds) {
        if (settings.clock_digital_enableseconds.value !== "") {
            WALLPAPER.clock_digital.EnableSeconds(settings.clock_digital_enableseconds.value);
            WALLPAPER.clock_digital2.EnableSeconds(settings.clock_digital_enableseconds.value);
        }
    }
    // Use Date string
    if (settings.clock_enabledate) {
        if (settings.clock_enabledate.value !== "") {
            WALLPAPER.clock_digital.EnableDate(settings.clock_enabledate.value);
            WALLPAPER.clock_digital2.EnableDate(settings.clock_enabledate.value);
            WALLPAPER.clock_analog.EnableDate(settings.clock_enabledate.value);
        }
    }
    // Use Custom Face
    if (settings.clock_analog_customface) {
        if (settings.clock_analog_customface.value !== "") {
            clockSettingsObject.customFace = settings.clock_analog_customface.value;
            WALLPAPER.clock_analog.SetCustomFace(clockSettingsObject.customFace);
        }
    }
    // Use built-in face or custom based on selected value
    if (settings.clock_analog_faces) {
        if (settings.clock_analog_faces.value !== "") {
            var face = settings.clock_analog_faces.value;
            if (face == 99) {
                WALLPAPER.clock_analog.SetCustomFace(clockSettingsObject.customFace);
            } else {
                WALLPAPER.clock_analog.SetBuiltInFace(face);
            }
        }
    }
    // Set Clocks color
    if (settings.clock_color) {
        if (settings.clock_color.value !== "") {
            var c = new Colour().FromRGBOneScaleString(settings.clock_color.value);
            WALLPAPER.clock_digital.UpdateStyle(c.HEXString);
            WALLPAPER.clock_digital2.UpdateStyle(c.HEXString);
            WALLPAPER.clock_analog.UpdateStyle(c.HEXString);
        }
    }
    // Set Analog Scale
    if (settings.clock_analog_scale) {
        if (settings.clock_analog_scale.value !== "") {
            WALLPAPER.clock_analog.SetScale(settings.clock_analog_scale.value / 100);
        }
    }
    // Set Analog X position offset
    if (settings.clock_analog_offsetx) {
        if (settings.clock_analog_offsetx.value !== "") {
            WALLPAPER.clock_analog.SetHorizontalPosition(settings.clock_analog_offsetx.value);
        }
    }
    // Set Analog Y position offset
    if (settings.clock_analog_offsety) {
        if (settings.clock_analog_offsety.value !== "") {
            WALLPAPER.clock_analog.SetVerticalPosition(settings.clock_analog_offsety.value);
        }
    }
    // Set Digital clock Scale
    if (settings.clock_digital_scale) {
        if (settings.clock_digital_scale.value !== "") {
            WALLPAPER.clock_digital.SetScale(settings.clock_digital_scale.value / 100);
            WALLPAPER.clock_digital2.SetScale(settings.clock_digital_scale.value / 100);
        }
    }
    // Set Digital clock X position offset
    if (settings.clock_digital_offsetx) {
        if (settings.clock_digital_offsetx.value !== "") {
            WALLPAPER.clock_digital.SetHorizontalPosition(settings.clock_digital_offsetx.value);
            WALLPAPER.clock_digital2.SetHorizontalPosition(settings.clock_digital_offsetx.value);
        }
    }
    // Set Digital clock Y position offset
    if (settings.clock_digital_offsety) {
        if (settings.clock_digital_offsety.value !== "") {
            WALLPAPER.clock_digital.SetVerticalPosition(settings.clock_digital_offsety.value);
            WALLPAPER.clock_digital2.SetVerticalPosition(settings.clock_digital_offsety.value);
        }
    }
    // Enable separator symbol
    if (settings.clock_digital_enableseparator) {
        if (settings.clock_digital_enableseparator.value !== "") {
            WALLPAPER.clock_digital.EnableNumberSeprator(settings.clock_digital_enableseparator.value);
            WALLPAPER.clock_digital2.EnableNumberSeprator(settings.clock_digital_enableseparator.value);
        }
    }
    // Set Date Locale
    if (settings.clock_datelocale) {
        if (settings.clock_datelocale.value !== "") {
            WALLPAPER.clock_digital.SetLocale(settings.clock_datelocale.value);
            WALLPAPER.clock_digital2.SetLocale(settings.clock_datelocale.value);
            WALLPAPER.clock_analog.SetLocale(settings.clock_datelocale.value);
        }
    }
    // Set Date Year
    if (settings.clock_dateyear) {
        if (settings.clock_dateyear.value !== "") {
            WALLPAPER.clock_digital.EnableYear(settings.clock_dateyear.value);
            WALLPAPER.clock_digital2.EnableYear(settings.clock_dateyear.value);
            WALLPAPER.clock_analog.EnableYear(settings.clock_dateyear.value);
        }
    }
    // Set Date Month
    if (settings.clock_datemonth) {
        if (settings.clock_datemonth.value !== "") {
            WALLPAPER.clock_digital.EnableMonth(settings.clock_datemonth.value);
            WALLPAPER.clock_digital2.EnableMonth(settings.clock_datemonth.value);
            WALLPAPER.clock_analog.EnableMonth(settings.clock_datemonth.value);
        }
    }
    // Set Date Day
    if (settings.clock_dateday) {
        if (settings.clock_dateday.value !== "") {
            WALLPAPER.clock_digital.EnableDay(settings.clock_dateday.value);
            WALLPAPER.clock_digital2.EnableDay(settings.clock_dateday.value);
            WALLPAPER.clock_analog.EnableDay(settings.clock_dateday.value);
        }
    }
    // Set Date Weekday
    if (settings.clock_dateweekday) {
        if (settings.clock_dateweekday.value !== "") {
            WALLPAPER.clock_digital.EnableWeekDay(settings.clock_dateweekday.value);
            WALLPAPER.clock_digital2.EnableWeekDay(settings.clock_dateweekday.value);
            WALLPAPER.clock_analog.EnableWeekDay(settings.clock_dateweekday.value);
        }
    }

    if (settings.clock_font) {
        if (settings.clock_font.value !== "") {
            $(".clock").css({ "font-family": settings.clock_font.value });
        }
    }

    // refresh date string
    WALLPAPER.clock_digital.SetDateString();
    WALLPAPER.clock_digital2.SetDateString();
    WALLPAPER.clock_analog.SetDateString();
}