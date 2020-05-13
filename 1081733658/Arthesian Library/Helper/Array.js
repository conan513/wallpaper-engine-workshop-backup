/**
 * Arthesian's Array helper module
 * 
 * @returns {ArrayHelper} Helper instance for arrays
 */
var ARTHESIAN = ARTHESIAN || {};
ARTHESIAN.Helper = ARTHESIAN.Helper || {}
ARTHESIAN.Helper.Array = (function () {

    // Scope object
    var _ = {}

    // Private variables
    var moduleName = 'ARTHESIAN.Helper.Array';

    /**
     * @private
     * 
     * Initialization
     */
    var init = function() {
        // Check whether all dependencies are loaded
        checkDependencies();
    }

    /**
     * @private
     * 
     * Check if all dependencies are loaded
     * 
     * @returns {boolean} Whether all dependencies where available or not
     */
    var checkDependencies = function () {

        // Check if the Helper.Array module is loaded
        if (!ARTHESIAN.Helper.checkDependency(['Smooth', 'METHOD_CUBIC'])) {
            console.warn(`'${moduleName}' uses 'Smooth.js' library for enhanced Interpolation. Interpolation will still work, but only in 'lineair' mode.`);
        }

        // Return true if everything is available
        return true;
    }

    /**
     * This will do a sum of all the values in the array
     * 
     * @param {Array} array Array of numbers
     */
    _.sum = function(array) {
        return array.reduce(function(sum, a) {
            return sum + Number(a);
        }, 0);
    }

    /**
     * It will calculate the average value of the numbers in the array
     * 
     * @param {Array} array Array of numbers
     */
    _.average = function(array) {
        return _.sum(array) / (array.length || 1);
    }

    /**
     * Take a selection from the array
     * 
     * @param {Array} array Array of objects
     * @param {number} take Number of items to take
     * @param {number} from [Optional] Skip number of items
     */
    _.take = function (array, take, from) {
        from = from || 0;
        return array.slice(from, number);
    }

    /**
     * Interpolate an array of numbers to a new array with a different length
     * If Smooth.js is included and available, it will use the Smooth() method, which uses Cubic spline
     * function for the smoothing, which gives better results than averaging.
     * 
     * @example [1,2,3] => 5 [1,1.5,2,2.5,3];
     * 
     * @param {Array} array Interpolate the Array of numbers to a new length
     */
    _.interpolate = function(array, newLength) {
        var newData = [];
        var data = array;
    
        // If the Smooth library is available, use it instead for better results
        if (!!Smooth) {
            var s = Smooth(data, { method: Smooth.METHOD_CUBIC, scaleTo: newLength });
            for (var i = 0; i < newLength; i++) {
                newData[i] = s(i);
            }
        } else {
            var linearInterpolate = function(before, after, atPoint) {
                return before + (after - before) * atPoint;
            };
    
            var springFactor = Number((data.length - 1) / (newLength - 1));
            
            // assign first value
            newData[0] = data[0];
            for (var i = 1; i < newLength - 1; i++) {
                var tmp = i * springFactor;
                var before = Number(Math.floor(tmp)).toFixed();
                var after = Number(Math.ceil(tmp)).toFixed();
                var atPoint = tmp - before;
                newData[i] = linearInterpolate(data[before], data[after], atPoint);
            }
            // assign last value
            newData[newLength - 1] = data[data.length - 1];
        }
    
        // Return the new array
        return newData;
    }

    init();

    // return the scope
    return _;

})();