/**
 * Arthesian's CSS Filter helper module
 * 
 * @param {String} filter CSS Filter of Element to edit
 * @returns {FilterHelper} Helper instance for the specified filter
 */
var ARTHESIAN = ARTHESIAN || {};
ARTHESIAN.Helper = ARTHESIAN.Helper || {}
ARTHESIAN.Helper.Filter = (function() {

    // Scope object
    var _ = {}

    /**
     * @private
     * 
     * Removes parts of the input string that match the regular expression provided
     * 
     * @param {String} string Input string to remove parts from
     * @param {String} regex Regular expression to remove from the input string
     * @returns {String} Ouput filter string
     */
    var remove = function(string, regex) {
        var matches = string.match(regex);
        if (matches && matches.length != -1) {
            string = string.replace(regex, "");
        }
        return string;
    };

    /**
     * Remove Shadow from the filter
     * 
     * @param {String} string Input filter string
     * @returns {String} Ouput filter string
     */
    _.removeShadow = function(string) {
        var shadow = /(drop-shadow\(.+\))/g;
        return remove(string, shadow);
    };

    /**
     * Add shadow to the filter - this will remove existing shadows from the element
     * 
     * @param {String} string Input filter string
     * @param {number} offsetx Horizontal offset of the shadow
     * @param {number} offsety Vertical offset of the shadow
     * @param {number} size Size of the shadow
     * @param {string} color Color of the shadow
     * @returns {String} Ouput filter string
     */
    _.replaceShadow = function(string, offsetx, offsety, size, color) {
        string = _.removeShadow(string);
        return _.addShadow(string, offsetx, offsety, size, color);
    };

    /**
     * Add shadow to the filter
     * 
     * @param {String} string Input filter string
     * @param {number} offsetx Horizontal offset of the shadow
     * @param {number} offsety Vertical offset of the shadow
     * @param {number} size Size of the shadow
     * @param {string} color Color of the shadow
     * @returns {String} Ouput filter string
     */
    _.addShadow = function(string, offsetx, offsety, size, color) {
        return string += " drop-shadow(" + offsetx + "px " + offsety + "px " + size + "px " + color + ")";
    };

    /**
     * Remove blur from the filter
     * 
     * @param {String} string Input filter string
     * @returns {String} Ouput filter string
     */
    _.removeBlur = function(string) {
        var blur = /(blur\(.+?\))/g;
        return remove(string, blur);
    };

    /**
     * Add blur to the filter - this will remove existing blur(s) to the element
     * 
     * @param {String} string Input filter string
     * @param {number} size Size of the 'blur' effect
     * @returns {String} Ouput filter string
     */
    _.replaceBlur = function(string, size) {
        string = _.removeBlur(string);
        return _.addBlur(size);
    };

    /**
     * Add blur to the filter
     * 
     * @param {String} string Input filter string
     * @param {number} size Size of the 'blur' effect
     * @returns {String} Ouput filter string
     */
    _.addBlur = function(string, size) {
        return string += " blur(" + size + "px)";
    };

    /**
     * Remove brightness from the filter
     * 
     * @param {String} string Input filter string
     * @returns {String} Ouput filter string
     */
    _.removeBrightness = function(string) {
        var brightness = /(brightness\(.+?\))/g;
        return remove(string, brightness);
    };

    /**
     * Add brightness to the filter -- replace the exisiting brightness
     * 
     * @param {String} string Input filter string
     * @param {number} percentage Brightness strength ( 100 = normal )
     * @returns {String} Ouput filter string
     */
    _.replaceBrightness = function(string, percentage) {
        string = _.removeBrightness(string);
        return _.addBrightness(string, percentage);
    };

    /**
     * Add brightness to the filter -- replace the exisiting brightness
     * 
     * @param {String} string Input filter string
     * @param {number} percentage Brightness strength ( 100 = normal )
     * @returns {String} Ouput filter string
     */
    _.addBrightness = function(string, percentage) {
        return string += " brightness(" + percentage / 100 + ")";
    };

    /**
     * Remove Contrast from the filter
     * 
     * @param {String} string Input filter string
     * @returns {String} Ouput filter string
     */
    _.removeContrast = function(string) {
        var Contrast = /(contrast\(.+?\))/g;
        return remove(string, Contrast);
    };

    /**
     * Add Contrast to the filter -- replace the exisiting Contrast
     * 
     * @param {String} string Input filter string
     * @param {number} percentage Contrast strength ( 100 = normal )
     * @returns {String} Ouput filter string
     */
    _.replaceContrast = function(string, percentage) {
        string = _.removeContrast(string);
        return _.addContrast(string, percentage);
    };

    /**
     * Add Contrast to the filter -- replace the exisiting Contrast
     * 
     * @param {String} string Input filter string
     * @param {number} percentage Contrast strength ( 100 = normal )
     * @returns {String} Ouput filter string
     */
    _.addContrast = function(string, percentage) {
        return string += " contrast(" + percentage / 100 + ")";
    };

    /**
     * Remove GrayScale from the filter
     * 
     * @param {String} string Input filter string
     * @returns {String} Ouput filter string
     */
    _.removeGrayScale = function(string) {
        var GrayScale = /(grayscale\(.+?\))/g;
        return remove(string, GrayScale);
    };

    /**
     * Add GrayScale to the filter -- replace the exisiting GrayScale
     * 
     * @param {String} string Input filter string
     * @param {number} percentage GrayScale strength ( 100 = normal )
     * @returns {String} Ouput filter string
     */
    _.replaceGrayScale = function(string, percentage) {
        string = _.removeGrayScale(string);
        return _.addGrayScale(string, percentage);
    };

    /**
     * Add GrayScale to the filter -- replace the exisiting GrayScale
     * 
     * @param {String} string Input filter string
     * @param {number} percentage GrayScale strength ( 100 = normal )
     * @returns {String} Ouput filter string
     */
    _.addGrayScale = function(string, percentage) {
        return string += " grayscale(" + percentage / 100 + ")";
    };

    /**
     * Remove Opacity from the filter
     * 
     * @param {String} string Input filter string
     * @returns {String} Ouput filter string
     */
    _.removeOpacity = function(string) {
        var Opacity = /(opacity\(.+?\))/g;
        return remove(string, Opacity);
    };

    /**
     * Add Opacity to the filter -- replace the exisiting Opacity
     * 
     * @param {String} string Input filter string
     * @param {number} percentage Opacity strength ( 100 = normal )
     * @returns {String} Ouput filter string
     */
    _.replaceOpacity = function(string, percentage) {
        string = _.removeOpacity(string);
        return _.addOpacity(string, percentage);
    };

    /**
     * Add Opacity to the filter -- replace the exisiting Opacity
     * 
     * @param {String} string Input filter string
     * @param {number} percentage Opacity strength ( 100 = normal )
     * @returns {String} Ouput filter string
     */
    _.addOpacity = function(string, percentage) {
        return string += " opacity(" + percentage / 100 + ")";
    };

    /**
     * Remove Saturation from the filter
     * 
     * @param {String} string Input filter string
     * @returns {String} Ouput filter string
     */
    _.removeSaturation = function(string) {
        var Saturation = /(saturate\(.+?\))/g;
        return remove(string, Saturation);
    };

    /**
     * Add Saturation to the filter -- replace the exisiting Saturation
     * 
     * @param {String} string Input filter string
     * @param {number} percentage Saturation strength ( 100 = normal )
     * @returns {String} Ouput filter string
     */
    _.replaceSaturation = function(string, percentage) {
        string = _.removeSaturation(string);
        return _.addSaturation(string, percentage);
    };

    /**
     * Add Saturation to the filter -- replace the exisiting Saturation
     * 
     * @param {String} string Input filter string
     * @param {number} percentage Saturation strength ( 100 = normal )
     * @returns {String} Ouput filter string
     */
    _.addSaturation = function(string, percentage) {
        return string += " saturate(" + percentage / 100 + ")";
    };

    /**
     * Remove hue-rotation from the filter
     * 
     * @param {String} string Input filter string
     * @returns {String} Ouput filter string
     */
    _.removeHueRotate = function(string) {
        var hue = /(hue-rotate\(.+?\))/g;
        return remove(string, hue);
    };

    /**
     * Add hue-rotation to the filter - replaces existing hue-rotate
     * 
     * @param {String} string Input filter string
     * @param {number} offset Degrees hue-offset to apply to the filter
     * @returns {String} Ouput filter string
     */
    _.replaceHueRotate = function(string, offset) {
        string = _.removeHueRotate(string);
        return _.addHueRotate(string, offset);
    };

    /**
     * Add hue-rotation to the filter - replaces existing hue-rotate
     * 
     * @param {String} string Input filter string
     * @param {number} offset Degrees hue-offset to apply to the filter
     * @returns {String} Ouput filter string
     */
    _.addHueRotate = function(string, offset) {
        return string += " hue-rotate(" + offset + "deg)";
    };

    /**
     * Remove invert from the filter
     * 
     * @param {String} string Input filter string
     * @returns {String} Ouput filter string
     */
    _.removeInvert = function(string) {
        var hue = /(invert\(.+?\))/g;
        return remove(string, hue);
    };

    /**
     * Add invert to the filter - replaces existing hue-rotate
     * 
     * @param {String} string Input filter string
     * @returns {String} Ouput filter string
     */
    _.addInvert = function(string) {
        string = _.removeInvert(string);
        return string += " invert(1)";
    };

    // return the scope
    return _;

})();