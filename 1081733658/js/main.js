'use strict';

// Set the width and height of the canvas to match screen
$("#main-canvas, #background-canvas, #background-video, #grid-canvas, #foreground-canvas").attr({
    "width": window.innerWidth,
    "height": window.innerHeight
});

var WALLPAPER = {};

// Create the digital clock widget
WALLPAPER.clock_digital = new Digital_Clock("#digital-clock");

WALLPAPER.clock_digital2 = new Digital_Clock_Simple("#digital-clock-simple");

// Create the analog clock widget
WALLPAPER.clock_analog = new Analog_Clock("#analog-clock");
WALLPAPER.clock_analog.SetFacesFolderPath('modules/clock/release/img/faces/');

// Visual 1
WALLPAPER.visual_bar = new visualisations.bar.rainbow("bar_1");

// Visual 2
WALLPAPER.visual_bar2 = new visualisations.bar.rainbow("bar_2");

// Confetti visual
WALLPAPER.confetti = new visualisations.background.confetti("confetti_1");

// Create the background module ( it's a visual )
WALLPAPER.background = new visualisations.background.image("background_1");
WALLPAPER.background.settings.slideshowFolderProperty = "background_slideshowfolder";

// Foreground image
WALLPAPER.foreground = new visualisations.image.simple("simple_image");

// Perspective module
WALLPAPER.perspective = new Perspective("main, foreground, clocks");

// Grid
WALLPAPER.grid = new modules.animatedGrid({selector : "#grid-canvas"});

// Add the visuals to the Background
WALLPAPER.background_engine = $("#background-canvas").visualizer();
WALLPAPER.background_engine.addVisual(WALLPAPER.background);
WALLPAPER.background_engine.addVisual(WALLPAPER.grid);

// Add Visuals to the main canvas
WALLPAPER.visualizer = $("#main-canvas").visualizer();
WALLPAPER.visualizer.addVisual(WALLPAPER.confetti);
WALLPAPER.visualizer.addVisual(WALLPAPER.visual_bar);
WALLPAPER.visualizer.addVisual(WALLPAPER.visual_bar2);

WALLPAPER.foreground_engine = $("#foreground-canvas").visualizer();
WALLPAPER.foreground_engine.addVisual(WALLPAPER.foreground);

// Performance Tracker
WALLPAPER.performanceHelper = new PerformanceHelper();
WALLPAPER.performanceHelper.addVisualizer(WALLPAPER.visualizer);
WALLPAPER.performanceHelper.addVisualizer(WALLPAPER.background_engine);
WALLPAPER.performanceHelper.addVisualizer(WALLPAPER.foreground_engine);

// Disable all modules by default
WALLPAPER.confetti.Enable(false);
WALLPAPER.background.Enable(false);
WALLPAPER.foreground.Enable(false);
WALLPAPER.perspective.Enable(false);
WALLPAPER.grid.Enable(false);
WALLPAPER.visual_bar2.Enable(false);
WALLPAPER.visual_bar.Enable(false);
WALLPAPER.clock_analog.Enable(false);
WALLPAPER.clock_digital2.Enable(false);
WALLPAPER.clock_digital.Enable(false);
WALLPAPER.performanceHelper.Enable(false);

//createjs.Ticker.timingMode = createjs.Ticker.RAF;