/**
 * Arthesian's Visualizer Engine
 * 
 * @returns {Visualizer} Performance Tracker
 */
var ARTHESIAN = ARTHESIAN || {};
ARTHESIAN.Visualizer = ARTHESIAN.Visualizer || {};

/**
 * 
 * @param {string} canvasId Canvas element ID
 * @param {object} settings Override default settings
 */
ARTHESIAN.Visualizer.Engine = function (canvasId, settings) {

    // Declare a scope for Visualizer
    var _ = {};

    // The default values
    var _DEFAULTS = {
        enabled: true
    };

    // Public properties
    _.canvas = null;
    _.stage = null;
    _.visuals = [];
    _.settings = Object.assign({}, _DEFAULTS, settings);

    /**
     * Init function. The constructor for the Visualizer. Will run some general checks, and setup the stages.
     * Creates the stage and is owner of all objects that should be added to draw onto the canvas.
     * 
     */
    var init = function () {

        if (!canvasId) {
            console.error("The targeted canvas needs to have an id specified");
        }

        if (!createjs) {
            console.error("This plugin requires CreateJS to operate!");
        }

        // The main stage for visuals            
        var stage = new createjs.Stage(canvasId);
        stage.snapToPixel = true;
        stage.snapToPixelEnabled = true;
        stage.enableMouseOver(0);

        // Assign the public variables
        _.stage = stage;
        _.canvas = stage.canvas;

        // Bind to the createjs ticker
        createjs.Ticker.addEventListener("tick", update);
    }

    /**
     * Add a new visual to the Visualizer
     * 
     * @param {any} visual 
     * @returns 
     */
    _.addVisual = function (id, visual) {
        if (_.visuals[id]) {
            console.error("This visual ID is already in use, please use an other one, or remove the existing one!");
            return;
        }

        _.visuals[id] = visual;
        _.visuals.push(visual);

        visual.setVisualizer(_);
    }

    /**
     * Remove a visual from the Visualizer by ID
     * 
     * @param {any} id 
     */
    _.removeVisual = function (id) {
        delete _.visuals[id];

        _.visuals.forEach((v, i) => {
            if(v.id === id) {
                _.visuals.splice(i, 1);
            }
        });
    }

    /**
     * Private method to remove a GameObject from the hierarchy.
     * 
     * @param {any} obj 
     */
    var removeGameObject = function (obj) {
        obj.parent.removeChild(obj);
    }

    /**
     * Update all visual states of the Visuals that have been added to this Visualizer
     * 
     * @param {any} data 
     */
    _.updateVisuals = function () {
        // Magic starts here :D
        _.visuals.forEach(function (visual) {
            visual.update();

            if (visual.container) {
                _.stage.addChild(visual.container);
            }
        });
    }

    /**
     * Checks for any active visuals
     * 
     * @returns {boolean} Whether any visual is active or not
     */
    var checkVisualsActive = function () {

        // If there are no visuals attached, return false;
        if (_.visuals.length < 1) {
            return false;
        }

        // Filter all active visuals from total list of visuals
        var activeVisuals = _.visuals.filter(function (visual) {
            return visual.enabled;
        });

        // If there is at least one active visual, return true
        if (activeVisuals.length > 0) {
            return true;
        }

        // Default : return false
        return false;
    }

    /**
     * The update method fired by the Createjs.Ticker object.
     * The stage get cleared of any object, and is reconstructed by updating the Visuals.
     * 
     * @param {any} event 
     */
    var update = function (event) {

        // If Visualizer is disabled, don't update
        if (!_.settings.enabled) {
            return;
        }

        // If no active visuals, don't update
        if (!checkVisualsActive()) {
            return;
        }

        // Clear the stage            
        _.stage.removeAllChildren();

        // Update visuals
        _.updateVisuals();

        // Update the stage
        _.stage.update();
    }

    /**
     * Enable or disable the visualizer
     * 
     * @param {any} enabled 
     */
    _.Enable = function (enabled) {
        _.settings.enabled = enabled;
    }

    // Call init
    init();

    // Return the current scope
    return _;
};