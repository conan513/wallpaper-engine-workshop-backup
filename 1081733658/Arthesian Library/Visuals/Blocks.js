/**
 * Arthesian's Visual Engine
 * 
 * @returns {Visual} Performance Tracker
 */
var ARTHESIAN = ARTHESIAN || {};
ARTHESIAN.Visualizer = ARTHESIAN.Visualizer || {};
ARTHESIAN.Visualizer.Visuals = ARTHESIAN.Visualizer.Visuals || {}

/**
 * 
 * @param {string} canvasId Canvas element ID
 * @param {object} settings Override default settings
 */
ARTHESIAN.Visualizer.Visuals.Blocks = function (name, settings) {

    // Declare a scope for Visual
    var _ = {
        set enabled(value) {
            enabled = value;
        },
        get enabled(){
            return enabled;
        }
    };

    var enabled = false;

    // Public properties
    _.canvas = null;
    _.stage = null;

    _.name;
    _.container;

    _.grid;

    // Variables for drawing
    _.rows = 20;
    _.collumns = 30;
    _.strengthMultiplier = 1;

    /**
     * Init function. The constructor for the Visual. Will run some general checks, and setup the stages.
     * Creates the stage and is owner of all objects that should be added to draw onto the canvas.
     * 
     */
    var init = function () {
        _.name = name;

        _.container = new createjs.Container();
        _.container.name = _.name;
    }

    _.resetGrid = function() {
        createGrid();
    }

    _.setVisualizer = function(visualizer) {
        _.canvas = visualizer.canvas;
        _.stage = visualizer.stage;

        _.resetGrid();
    }

    var createGrid = function () {
        _.grid = [];

        var horizontalSpacing = 5;
        var totalHorizontalSpacing = (_.collumns + 1) * horizontalSpacing;

        var verticalSpacing = 5;
        var totalVerticalSpacing = (_.rows + 1) * verticalSpacing;

        var width = (_.canvas.width - totalHorizontalSpacing) / _.collumns;
        var height = (_.canvas.height - totalVerticalSpacing) / _.rows;

        for (var x = 0; x < _.collumns; x++) {

            _.grid[x] = [];

            var xOffset = (x + 1) * horizontalSpacing + x * width;

            for (var y = 0; y < _.rows; y++) {

                var yOffset = (y + 1) * verticalSpacing + y * height;

                var block = createBlock(xOffset, yOffset, width, height);

                _.grid[x][y] = block;
            }
        }
    }

    var createBlock = function (x, y, width, height) {
        var block = new createjs.Shape();
        var drawCommand = block.graphics.beginFill("gray").drawRect(0, 0, width, height).command;

        block.regX = width / 2;
        block.regY = height / 2;

        block.y = y + block.regY;
        block.x = x + block.regX;

        block.drawCommand = drawCommand;

        return block;
    }

    /**
     * The update method fired by the Createjs.Ticker object.
     * The stage get cleared of any object, and is reconstructed by updating the Visuals.
     * 
     */
    _.update = function () {

        // If Visual is disabled, don't update
        if (!enabled) {
            return;
        }

        // Clear the container
        _.container.removeAllChildren();

        // Call the new draw method
        draw();
    }

    /**
     * @todo Color should be generated from rainbow colors/selected color
     */
    var draw = function () {
        var audioData = retrieveAudioData();

        var delta = 1.2 / _.rows;

        for (var x = 0; x < _.collumns; x++) {

            var color = 'red';
            var columnAudio = audioData[x];

            for (var y = 0; y < _.rows; y++) {

                yDelta = delta * y;

                var block = _.grid[x][y];

                var drawCommand = block.drawCommand;

                if (yDelta < columnAudio) {
                    block.graphics._fill.style = "red";
                } else {
                    block.graphics._fill.style = "gray";
                }

                _.container.addChild(block);
            }
        }
    }

    var retrieveAudioData = function () {
        var data = ARTHESIAN.Audio.Source.getWallpaperEngineAudioData(_.collumns) 
        return ARTHESIAN.Audio.ChannelMixer.processAudioData(data, true, 'BOTH');
    }

    /**
     * Enable or disable the Visual
     * 
     * @param {any} enabled 
     */
    _.Enable = function (enabled) {
        enabled = enabled;
    }

    // Call init
    init();

    // Return the current scope
    return _;
};