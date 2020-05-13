window.wallpaperPropertyListener = {

    setPaused: function(isPaused) {

        var video = $("#background-video");
        video.paused = isPaused;

        WALLPAPER.background_engine.Enable(!isPaused);
        WALLPAPER.visualizer.Enable(!isPaused);
    },

    applyGeneralProperties: function (properties) {
        
        // Set visualizer settings
        visualizer_settings(properties);
    },

    applyUserProperties: function(properties) {

        // Log Window
        if(properties.visualizer_showlog) {
            ARTHESIAN.Helper.Logger.showLogWindow(properties.visualizer_showlog.value);
        }

        // Set visualizer settings
        visualizer_settings(properties);

        // Set the rainbowbars settings
        visual_bar_settings(properties);
        visual_bar2_settings(properties);

        // Set perspective settings
        perspective_settings(properties);

        // Set clock settings
        clock_settings(properties);

        // Set background settings
        background_settings(properties);
        handle_background_edits(properties);

        // Set foreground settings
        foreground_settings(properties);
        handle_foreground_edits(properties);

        // Set confetti settings
        confetti_settings(properties);

        // Background Grid settings
        grid_settings(properties);

        // icue settings
        icue_settings(properties);
    }
}

window.wallpaperPluginListener = {
    onPluginLoaded: function (name, version) {
        if (name === 'cue') {
            ARTHESIAN.Helper.iCUE.init();
        }
    }
};