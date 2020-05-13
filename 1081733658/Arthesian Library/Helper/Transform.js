/**
 * Arthesian's CSS Transform helper module
 * 
 * @param {String} Transform CSS Transform of Element to edit
 * @returns {TransformHelper} Helper instance for the specified transform
 */
var ARTHESIAN = ARTHESIAN || {};
ARTHESIAN.Helper = ARTHESIAN.Helper || {}
ARTHESIAN.Helper.Transform = (function () {

    // Scope object
    var _ = {}

    /**
     * @private
     * 
     * Removes parts of the input string that match the regular expression provided
     * 
     * @param {String} string Input string to remove parts from
     * @param {String} regex Regular expression to remove from the input string
     * @returns {String} Ouput transform string
     */
    var remove = function (string, regex) {
        var matches = string.match(regex);
        if (matches && matches.length != -1) {
            string = string.replace(regex, "");
        }
        return string;
    };

    /**
     * Remove translate from the transform
     * 
     * @param {String} string Input transform string
     * @returns {String} Ouput transform string
     */
    _.removeTranslate = function (string) {
        var translate = /(translate\(.+?\))/g;
        return remove(_.transform, translate);
    };

    /**
     * @deprecated Please use addTranslate() method with optional 'replace' boolean
     * 
     * Add translate to the transform - replaces previous instances
     * 
     * @param {string} string Input transform string
     * @param {number} x Percentage horizontal translate
     * @param {number} y Percentage vertical translate
     * @returns {String} Ouput transform string
     */
    _.replaceTranslate = function (string, x, y) {
        string = _.removeTranslate(string);
        return _.addTranslate(string, x, y);
    };

    /**
     * @deprecated Please use addTranslate() method with optional 'replace' boolean
     * 
     * Add translate to the transform - replaces previous instances
     * 
     * @param {string} string Input transform string
     * @param {number} x Percentage horizontal translate
     * @param {number} y Percentage vertical translate
     * @param {boolean} replace Boolean to replace previous instances
     * @returns {String} Ouput transform string
     */
    _.addTranslate = function (string, x, y, replace) {
        return string += " translate(" + x + "%, " + y + "%)";
    };

    /**
     * Remove the scale 
     * 
     * @param {string} string Input transform string
     * @returns {String} Ouput transform string
     */
    _.removeScale = function (string) {
        var scale = /(scale\(.+?\))/g;
        return remove(string, scale);
    };

    /**
     * @deprecated Please use addScale() with the optional 'replace' boolean
     * 
     * @param {String} string Input transform string
     * @param {number} number Scale ( ex. 2 = double size )
     * @returns {String} Ouput transform string
     */
    _.replaceScale = function (string, number) {
        _.removeScale();
        return _.addScale(string, number);
    };

    /**
     * Add scale transform
     * 
     * @param {string} string Input transform string
     * @param {number} number Scale ( ex. 2 = double size )
     * @param {boolean} replace Whether to replace existing scale transforms
     * @returns {String} Ouput transform string
     */
    _.addScale = function(string, number, replace) {
        if(replace) {
            return _.replaceScale(string, number);
        }
        return string += " scale(" + number + ")";
    }

    // return the scope
    return _;

})();