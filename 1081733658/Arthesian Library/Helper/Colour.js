/**
 * Arthesian's Colour helper module
 * 
 * @returns {ColourHelper} Helper instance for Colours
 */
var ARTHESIAN = ARTHESIAN || {};
ARTHESIAN.Helper = ARTHESIAN.Helper || {}
ARTHESIAN.Helper.Colour = (function () {

    // Scope object
    var _ = {}

    /**
     * Convert hex to RGB array
     * 
     * @param {string} string Hex colour string
     * @return {Object} With R,G,B properties
     * 
     * @example '#FF0000' => {r: 255, g: 0, b: 0}
     */
    _.hexToRgb = function (string) {
        // Check for valid length
        if (string.charAt(0) != "#" || (string.length != 4 && string.length != 7)) {
            throw "Not a valid hex string! Expected format '#ABC' or '#AABBCC";
        }

        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        HEX = string.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });

        // Execute regular expression to get the R,G,B groups
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(HEX);
        var rgb = result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;

        // return rgb values as array
        return rgb;
    }

    /**
     * Convert hex colour string to RGB colour string
     * 
     * @param {string} string Hex colour string
     * @return {string} RGB colour string
     * 
     * @example '#FF0000' => 'rgb(255,0,0)'
     */
    _.hexToRgbString = function (string) {
        // create RGB from hex
        var rgb = _.hexToRgb(string);

        // Return rgb string
        return _.rgbToRgbString(rgb.r, rgb.g, rgb.b);
    }

    /**
     * Convert R,G,B values to CSS color string
     * 
     * @param {number} r Red value
     * @param {number} g Green value
     * @param {number} b Blue value
     * 
     * @returns {string} rgb(0,0,0) string
     */
    _.rgbToRgbString = function (r, g, b) {
        return `rgb(${r},${g},${b})`;
    }

    /**
     * Convert RGB values to hex colour string
     * 
     * @param {number} r Red value
     * @param {number} g Green value
     * @param {number} b Blue value
     * @return {string} hex string
     * 
     * @example '255, 0, 0' => '#FF0000'
     */
    _.rgbToHexString = function (r, g, b) {
        return "#" + toDoubleLength(r.toString(16).slice(-2)) + toDoubleLength(g.toString(16).slice(-2)) + toDoubleLength(b.toString(16).slice(-2));
    }

    var toDoubleLength = function(input) {
        return (input.length === 1) ? input+input : input;
    }

    /**
     * Convert 1 scale RGB to 255 scale RGB
     * 
     * @param {number} r Red value
     * @param {number} g Green value
     * @param {number} b Blue value
     * 
     * @returns {object} with R,G,B properties
     */
    _.rgb1ScaleToRgb = function (r, g, b) {
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    /**
     * Convert 1 scale RGB to 255 scale RGB string
     * 
     * @param {number} r Red value
     * @param {number} g Green value
     * @param {number} b Blue value
     * 
     * @returns {string} rgb(0,0,0) CSS string
     */
    _.rgb1ScaleToRGBString = function (r, g, b) {
        var rgb = _.rgb1ScaleToRgb(r, g, b);
        return _.rgbToRgbString(rgb.r, rgb.g, rgb.b);
    }

    /**
     * Convert 1 scale RGB to 255 scale RGB string
     * 
     * @param {number} r Red value
     * @param {number} g Green value
     * @param {number} b Blue value
     * 
     * @returns {string} rgb(0,0,0) CSS string
     */
    _.rgb1ScaleToHexString = function (r, g, b) {
        var rgb = _.rgb1ScaleToRgb(r, g, b);
        return _.rgbToHexString(rgb.r, rgb.g, rgb.b);
    }

    /**
     * Converts an RGB color value to HSL. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
     * Assumes r, g, and b are contained in the set [0, 255] and
     * returns h, s, and l in the set [0, 1].
     *
     * @param   {Number}  r       The red color value
     * @param   {Number}  g       The green color value
     * @param   {Number}  b       The blue color value
     * @return  {Array}           The HSL representation
     */
    _.rgbToHsl = function(r, g, b) {
        r /= 255, g /= 255, b /= 255;

        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }

        return [ h *= 360, s *= 100, l *= 100 ];
    }

    /**
     * Converts an HSL color value to RGB. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
     * Assumes h, s, and l are contained in the set [0, 1] and
     * returns r, g, and b in the set [0, 255].
     *
     * @param   {Number}  h       The hue
     * @param   {Number}  s       The saturation
     * @param   {Number}  l       The lightness
     * @return  {Array}           The RGB representation
     */
    _.hslToRgb = function(h, s, l) {
        var r, g, b;

        h /= 360;
        s /= 100;
        l /= 100;

        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;

            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return [ r * 255, g * 255, b * 255 ];
    }

    /**
     * Converts an RGB color value to HSV. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
     * Assumes r, g, and b are contained in the set [0, 255] and
     * returns h, s, and v in the set [0, 1].
     *
     * @param   {Number}  r       The red color value
     * @param   {Number}  g       The green color value
     * @param   {Number}  b       The blue color value
     * @return  {Array}           The HSV representation
     */
    _.rgbToHsv = function(r, g, b) {
        r /= 255, g /= 255, b /= 255;

        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, v = max;

        var d = max - min;
        s = max == 0 ? 0 : d / max;

        if (max == min) {
            h = 0; // achromatic
        } else {
            switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }

        return [ h, s, v ];
    }

    /**
     * Converts an HSV color value to RGB. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
     * Assumes h, s, and v are contained in the set [0, 1] and
     * returns r, g, and b in the set [0, 255].
     *
     * @param {Number} h The hue
     * @param {Number} s The saturation
     * @param {Number} v The value
     * @return {Array} The RGB representation
     */
    _.hsvToRgb = function(h, s, v) {
        var r, g, b;

        var i = Math.floor(h * 6);
        var f = h * 6 - i;
        var p = v * (1 - s);
        var q = v * (1 - f * s);
        var t = v * (1 - (1 - f) * s);

        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }

        return [ r * 255, g * 255, b * 255 ];
    }

    // return the scope
    return _;

})();

/**
 * Colour morpher object. Add colours to it and get morphed colours back
 * 
 * @returns {ColourMorpher} Object
 */
ARTHESIAN.Helper.Colour.Morpher = function () {

    // Scope object
    var _ = {}

    var colourArray = [];

    _.colours = colourArray;

    /**
     * Set HEX colour string array as the source colours
     * 
     * @param {Array} colours Array of HEX colour strings
     */
    _.setHEXColours = function (colours) {

        var rgbColours = [];

        colours.forEach(c => {
            rgbColours.push(ARTHESIAN.Helper.Colour.hexToRgb(c));
        });

        _.setRGBColours(rgbColours);
    }

    /**
     * Set RGB colour object array as the source colours
     * 
     * @param {Array} colours Array of RGB colour objects
     * 
     * @throws Error when an invalid array is supplied
     */
    _.setRGBColours = function (colours) {
        if (!colours || !colours.length) {
            throw 'colours needs to ba an array of colours!';
        }

        var positionFactor = 100 / colours.length;

        for (var x = 0; x < colours.length; x++) {

            var position = x * positionFactor;

            if (x === (colours.length - 1)) { position = 100; }

            _.setRGBColour(colours[x], position);
        }

        colourArray = colours;

        sortColourArray();
    }

    /**
     * Add HEX colour string to the colour array
     * 
     * @param {any} colour 
     * @param {any} position 
     */
    _.setHEXColour = function (colour, position) {
        _.setRGBColour(ARTHESIAN.Helper.Colour.hexToRgb(colour), position);
    }

    /**
     * Add an RGB colour to the colour array
     * 
     * @param {object} colour An RGB colour object
     * @param {number} position Position from 0-100
     */
    _.setRGBColour = function (colour, position) {

        _.removeColour(position);

        var colourObject = {
            pct: position / 100,
            colour: colour
        };

        colourArray.push(colourObject);

        sortColourArray();
    }

    /**
     * @private
     * 
     * Sort the colour array based on the position of the colours
     */
    var sortColourArray = function () {
        if(colourArray.length < 2) { return;}

        // Sort the array
        colourArray.sort(function(a,b) {
            return a.pct > b.pct;
        });
    }

    /**
     * Remove a colour from the array to generate colours for by position
     * 
     * @param {number} position Position of the colour you want to remove
     * 
     * NOTE: 2 colours can not be at the same position
     */
    _.removeColour = function (position) {
        var pct = position / 100;
        var element = colourArray.filter(c => c.pct === pct);

        if (element && element.length > 0) {
            var index = colourArray.indexOf(element);
            colourArray.splice(index, 1);
        }
    }

    /**
     * Get RGB colour object
     * 
     * @param {any} position Position from 0-100
     * @returns {object} Returns RGB object with properties for r,g,b ( 0-255 )
     */
    _.getRGBColour = function (position) {

        if(!colourArray || colourArray.length < 2) { 
            throw 'You need to supply at least 2 colours for position 0 and 100';
        }

        var pct = position / 100;

        for (var i = 1; i < colourArray.length - 1; i++) {
            if (pct < colourArray[i].pct) {
                break;
            }
        }

        var lower = colourArray[i - 1];
        var upper = colourArray[i];
        var range = upper.pct - lower.pct;
        var rangePct = (pct - lower.pct) / range;
        var pctLower = 1 - rangePct;
        var pctUpper = rangePct;

        var colour = {
            r: Math.floor(lower.colour.r * pctLower + upper.colour.r * pctUpper),
            g: Math.floor(lower.colour.g * pctLower + upper.colour.g * pctUpper),
            b: Math.floor(lower.colour.b * pctLower + upper.colour.b * pctUpper)
        };

        return colour;
    }

    /**
     * Get RGB colour string ( ex. rgb(0,0,0) )
     * 
     * @param {number} position Position from 0-100
     * @returns {string} RGB colour string
     */
    _.getRGBColourString = function (position) {
        var rgb = _.getRGBColour(position);
        return ARTHESIAN.Helper.Colour.rgbToRgbString(rgb.r, rgb.g, rgb.b);
    }

    /**
     * Get hexadecimal colour string
     * 
     * @param {number} position Position from 0-100
     * @returns {string} HEX colour string
     */
    _.getHEXColourString = function (position) {
        var rgb = _.getRGBColour(position);
        return ARTHESIAN.Helper.Colour.rgbToHexString(rgb.r, rgb.g, rgb.b);
    }

    // return the scope
    return _;

};