/**
 * Arthesian's Performance Tracker
 * 
 * @uses ARTHESIAN.EventBus EventBus
 * 
 * @returns {PerformanceTracker} Performance Tracker
 */
var ARTHESIAN = ARTHESIAN || {};
ARTHESIAN.Performance = ARTHESIAN.Performance || {}
ARTHESIAN.Performance.Tracker = function () {

    // Private variables
    var ticks = [];

    // Current event tracking
    var trackingEvent;

    // Scope object with getters and setters
    var _ = {
        get event() { 
            return trackingEvent
        },
        set event(eventName) {
            trackingEvent = eventName;
            handleTrackEvent(eventName);
        }
    }

    /**
     * @private
     * 
     * Initialization
     */
    var init = function() {

    }

    /**
     * @private
     * 
     * When a new event is set to be tracked, handle that.
     * 
     * @param {String} eventName Name of the event to listen to
     */
    var handleTrackEvent = function(eventName) {
        
        // If there is already an event listener, remove it first
        if(trackingEvent) {
            ARTHESIAN.EventBus.removeEventListener(trackingEvent);
        }

        // Add the new event to listen to
        ARTHESIAN.EventBus.addEventListener(_, eventName, () => { onEventTriggered(); })
    }

    /**
     * @private
     * 
     * Fire this handler every time the event it listens to is fired
     */
    var onEventTriggered = function(){
        
        // Push the new tick to the private list of ticks
        ticks.push(performance.now());

        // Remove the older ticks
        removeOldTicks();
    }

    /**
     * @private
     * 
     * Remove old ticks from the list
     */
    var removeOldTicks = function() {

        // Filter all ticks older than 1 second from the list
        ticks = ticks.filter(t => t < (performance.now() - 1000));
    }

    /**
     * Public method to get the calculated amount of updates per second based on the current tick list
     */
    _.getUpdatesPerSecond = function() {
        // If there are no ticks, return 0
        if(!ticks.length) return 0;

        // If there is only one update, return 1
        if(ticks.length === 1) return 1;

        // Get the delta time between first and last tick;
        var delta = ticks[ticks.length - 1] - ticks[0];

        // If the delta is 0, return 1 update per second
        if(!delta) return 1;

        // Divide 1 second by the time delta * the number of ticks to get actual amount of frames per second
        return (1000 / delta) * ticks.length;
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

};