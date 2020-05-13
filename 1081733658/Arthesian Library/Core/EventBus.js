/**
 * Arthesian's Eventbus
 *
 * Listen and fire events to trigger calls over multiple objects, without hard linking them
 * for example: 'Paused : true/false', 'Idle : true/false'
 * 
 * @returns {EventBus} Eventbus singleton
 */
var ARTHESIAN = ARTHESIAN || {};
ARTHESIAN.EventBus = ARTHESIAN.EventBus || (function() {

    // Singleton instance object
    var instance;

    // If the instance already exists, return that one
    if(instance) { return instance; }

    // Create the singleton instance
    instance = (function() {

        // Scope object
        var _ = {};

        // Scope variables
        _.obj;
        _.listeners = [];

        /**
         * @private
         *
         * Initializating method
         */
        var init = function(){
            _.obj = document.createElement('div');
        };

        /**
         * @public
         * 
         * Trigger any event name, this will send a message to all listeners
         *
         * @param {String} name Event name
         * @param {Object} data Data sent with the event
         */
        _.trigger = function(name, data) {
            // Create the event
            var event = new CustomEvent(name, data);

            // Dispatch/Trigger/Fire the event
            _.obj.dispatchEvent(event);
        };

        /**
         * @public
         * 
         * Remove the current object from listening to a certain event
         *
         * @param {String} name Event name
         */
        _.removeEventListener = function(name) {

            // Find all matches for the event name and object combination
            var matches = _.listeners.filter(l => { return l.object == this && l.name == name; });

            // Loop over all matches
            matches.forEach(m => {

                // Get the index of the match
                var i = _.listeners.indexOf(m);

                // If the match was found, remove it from the listeners
                if(i > -1){
                    _.listeners = _.listeners.splice(i, 1);
                }
            });

            // If no matches where found, log it to the console
            if(!matches.length) {
                console.loq(`The event: '${name}' was not attached to :`, this);
            }
        };

        /**
         * @public
         * 
         * Add an event listener for a certain event
         *
         * @param {String} name Event name
         * @param {Function} cb Callback function
         */
        _.addEventListener = function(name, cb) {

            // Add the object to the internal list of listeners
            addListener(this, name, cb);

            // Bind event listener
            _.obj.addEventListener(name, cb);
        };

        /**
         * @private
         *
         * Method to add an object to the listener array of objects
         *
         * @param {Object} listener The object that is listening to the event
         * @param {String} name Event name
         * @param {Function} cb Callback function
         */
        var addListener = function(listener, name, cb) {

            // Create listener object
            var l = {
                object : listener,
                event : name,
                callback : cb
            };

            // Add the object as new listener
            _.listeners.push(l);
        };

        // Call the init method
        init();

        // Return the scope
        return _;

    })();

    // Return the newly created instance
    return instance;
})();