# Visualizer
This is a jQuery plugin styled Visualizer that supports Visuals to be rendered to an HTML Canvas element. These Visuals are a seperate Module you will have to include.

Each visual can be instantiated as a new object like this:

`var visual_bar = new visualisation.bar.simple("bar1");`

NOTE: Your'll first need to create a Visualizer object, which is created as an jQuery plugin. The Visualizer needs an canvas to be present, where it can draw onto. You can create a new Visualizer ( if you include that module ) like so:

`var visualizer = $("#canvas").visualizer();`

After you have created a Visualizer object, you can add visuals like this:

`visualizer.addVisual(visual_bar);`

NOTE: The Visualizer is now specifically made to work with Wallpaper Engine. Wallpaper Engine supplies an Array of numbers representing sound to the Visualizer.

To do this, use the following code in your Index.html file:
```
#!javascript

// Listen to the sound Wallpaper Engine provides, or fallback to randomly generated data
if (window.wallpaperRegisterAudioListener) {
    window.wallpaperRegisterAudioListener(function (data) {
        visualizer.setAudioData(data);
    });
} else {
    // When opened in a browser ( or if wallpaperRegisterAudioListener is not available, generate stub data )
    visualizer.generateFakeAudioData(true);
}
```