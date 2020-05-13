/**
 * Arthesian's Image helper module
 * 
 * @returns {ImageHelper} Helper instance for Images
 */
var ARTHESIAN = ARTHESIAN || {};
ARTHESIAN.Helper = ARTHESIAN.Helper || {}
ARTHESIAN.Helper.Image = (function () {

    // Scope object
    var _ = {}

    // Private variables
    var moduleName = 'ARTHESIAN.Helper.Image';

    /**
     * @private
     * 
     * Initialization
     */
    var init = function() {
        // Check whether all dependencies are loaded
        var dependenciesLoaded = checkDependencies();
    }

    /**
     * @private
     * 
     * Check if all dependencies are loaded
     * 
     * @returns {boolean} Whether all dependencies where available or not
     */
    var checkDependencies = function () {
        // Return true if everything is available
        return true;
    }

    _.scaleImageToCanvas = function(img, canvas, scaleToFit) {
        var w = canvas.width;
        var h = canvas.height;

        var rh = h / (img.image.videoHeight || img.image.height || 1);
        var rw = w / (img.image.videoWidth || img.image.width || 1);

        var scale = 1;

        if (rw > rh && !scaleToFit) {
            scale = rw;
        } else {
            scale = rh;
        }

        img.regX = (img.image.videoWidth || img.image.width) / 2;
        img.regY = (img.image.videoHeight || img.image.height) / 2;

        img.x = w / 2;
        img.y = h / 2;

        img.scaleX = img.scaleY = scale;
    }

    _.centerImage = function() {

    }

    _.imageToUrl = function() {

    }

    _.imageToBase64 = function() {

    }

    _.distortImage = function() {

    }

    init();

    // return the scope
    return _;

})();