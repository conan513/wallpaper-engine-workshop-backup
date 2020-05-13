# Visuals
This is a Module project, made to work specifically with the following project:
* Visualizer

Each visual can be instantiated as a new object like this:

`var visual_bar = new visualisation.bar.simple("bar1");`

NOTE: Your'll first need to create a Visualizer object, which is created as an jQuery plugin. The Visualizer needs an canvas to be present, where it can draw onto. You can create a new Visualizer ( if you include that module ) like so:

`var visualizer = $("#canvas").visualizer();`

After you have created a Visualizer object, you can add visuals like this:

`visualizer.addVisual(visual_bar);`

NOTE: The Visualizer supports unlimited amount of Visuals, as long as they have unique ID's ( when you create a new Visual, the ID is the supplied parameter ). Each Visual requires calculations to be draw, and thus will cost performance. So try to limit the amount of Visuals for the Visualizer to an reasonable number.

Please read the readme.md of the Visualizer for more information