/**
 * Arthesian's WE_Core
 *
 * Handles most of the basic functionalities of Wallpaper Engine's javascript
 * 
 * @returns {WE_Core} WE_Core singleton
 */
var ARTHESIAN = ARTHESIAN || {};
ARTHESIAN.WE_Core = ARTHESIAN.WE_Core || (function () {

    // Scope object
    var _ = {};

    _.audio;

    /**
     * @private
     *
     * Initializating method
     */
    var init = function () {
        _.audio = ARTHESIAN.Audio.WE_Handler;
    };

    // Call the init method
    init();

    // Return the scope
    return _;
})();