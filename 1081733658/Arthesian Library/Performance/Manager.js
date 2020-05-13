/**
 * Arthesian's Performance Manager
 * 
 * @uses ARTHESIAN.EventBus EventBus
 * 
 * @returns {PerformanceManager} Performance Manager singleton
 */
var ARTHESIAN = ARTHESIAN || {};
ARTHESIAN.Performance = ARTHESIAN.Performance || {}
ARTHESIAN.Performance.Manager = (function () {

    // Private variables
    var trackers = [];
    var updatesPerSecond;
    var canvas;
    var ctx;

    // Interval reference
    var updateInterval;

    // Scope object with getters and setters
    var _ = {}

    /**
     * @private
     * 
     * Initialization
     */
    var init = function() {

        // Set initial amount of updates per second
        _.setUpdatesPerSecond(10);

        // Set up the canvas
        setCanvas();

        // Trigger complete
        triggerEvent('performanceManager:initCompleted');
    }

    /**
     * @private 
     * 
     * Set up the canvas on which the performance is drawn
     */
    var setCanvas = function() {
        canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d');

        // Set some generic styling
        ctx.font = '15px Arial';
        ctx.fillStyle = 'white';
    }

    /**
     * Add a performance tracker to the performance manager
     * 
     * @param {PerformanceTracker} tracker Instance of a Performance tracker to add
     */
    _.addTracker = function(tracker) {
        trackers.push(tracker);
    }

    /**
     * Remove a performance tracker from registering it's performance to the manager
     * 
     * @param {PerformanceTracker} tracker Instance of a Performance tracker to remove
     */
    _.removeTracker = function(tracker) {
        
        // Get the index of the instance
        var index = trackers.indexOf(tracker);

        // If it is found, remove it
        if(index > -1) {
            trackers = trackers.splice(index, 1);
        }
    }

    /**
     * Get all the registered trackers
     * 
     * @returns {Array} Array of trackers
     */
    _.getTrackers = function(){
        return trackers;
    }

    /**
     * Set the refresh rate for the performance canvas
     * 
     * @param {number} number Number of updates per second
     */
    _.setUpdatesPerSecond = function(number) {
        updatesPerSecond = +(number || 1);

        startInterval();
    }

    /**
     * @private 
     * 
     * Start the update interval for the performance monitor
     */
    var startInterval = function(){
        if(updateInterval) { clearInterval(updateInterval); }

        updateInterval = setInterval(() => { update(); }, 1000 / updatesPerSecond);
    }


    var _spacing = 20;
    var y_offset, x_offset, tracker;
    /**
     * @private 
     * 
     * Update method to update the canvas
     */
    var update = function(){
        _spacing = 20;

        // Clear the canvas
        ctx.clearRect(0,0,canvas.width, canvas.height);

        // Loop over all the trackers
        for(var x = 0; x < trackers.length; x++){
            tracker = trackers[x];

            // Calculate coordinates
            y_offset = x * _spacing;
            x_offset = _spacing;

            // Draw text
            ctx.fillText(`${tracker.name} - updates : ${tracker.getUpdatesPerSecond()}`, x_offset, y_offset);
        }

        // Trigger performance manager update event
        triggerEvent('performanceManager:update');
    }

    /**
     * @private
     * 
     * Trigger events on the EventBus for other objects to listen to
     * 
     * @param {String} name Name of the event to trigger
     * @param {Object} data [Optional] Additional data to send
     */
    var triggerEvent = function(name, data) {
        if(ARTHESIAN.EventBus) {
            ARTHESIAN.EventBus.trigger(name, { sender: _, data : data });
        }
    }
    
    // Call initialization
    init();

    // return the scope
    return _;

})();