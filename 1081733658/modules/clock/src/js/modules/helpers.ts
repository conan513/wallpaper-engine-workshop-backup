// Helper methods
interface Array<T> {
    sum: () => number;
    take: (number: number) => Array<T>;
    average: () => number;
    interpolate: (newlength: number) => Array<T>;
}

Array.prototype.sum = Array.prototype.sum || function () {
    return this.reduce(function (sum: number, a: any) { return sum + Number(a) }, 0);
}

Array.prototype.take = Array.prototype.take || function (num: number) {
    return this.slice(0, num);
}

Array.prototype.average = Array.prototype.average || function () {
    return this.sum() / (this.length || 1);
}

Array.prototype.interpolate = Array.prototype.interpolate || function (newLength: number) {

    var newData = [];
    var data = this;

    if (!!Smooth) {
        var s = Smooth(data, { method: Smooth.METHOD_CUBIC, scaleTo: newLength });
        for (var i = 0; i < newLength; i++) {
            newData[i] = s(i);
        }
    } else {
        var linearInterpolate = function (before, after, atPoint) {
            return before + (after - before) * atPoint;
        };

        var springFactor = Number((data.length - 1) / (newLength - 1));
        newData[0] = data[0]; // for new allocation
        for (var i = 1; i < newLength - 1; i++) {
            var tmp = i * springFactor;
            var before = Number(Math.floor(tmp)).toFixed();
            var after = Number(Math.ceil(tmp)).toFixed();
            var atPoint = tmp - before;
            newData[i] = linearInterpolate(data[before], data[after], atPoint);
        }
        newData[newLength - 1] = data[data.length - 1]; // for new allocation
    }

    return newData;
};

/**
 * Colour Helper for conversion of color codes
 * 
 * @class Colour
 */
class Colour {

    public IsSet: boolean;
    public RGBString = (() => { return this.R + "," + this.G + "," + this.B });
    public RGBAString = (() => { return this.RGBString() + "," + this.Alpha });
    public HEXString: string;
    public HEXNumber: number;

    public RGBAColourString = (() => { return "rgba(" + this.RGBString() + "," + this.Alpha + ")"; });
    public RGBColourString = (() => { return "rgb(" + this.RGBString() + ")"; });

    public R: number;
    public G: number;
    public B: number;
    public Alpha: number;

    /**
     * Creates an instance of Colour.
     * @memberof Colour
     */
    constructor() {
        this.Alpha = 1;
    }

    /**
     * Generate colour object from 1 based RGB color string ( "1 0 0" = "red" )
     * 
     * @param {string} rgb 
     * @returns 
     * @memberof Colour
     */
    public FromRGBOneScaleString(rgb: string) {
        var split = rgb.split(" ");
        return this.FromRGBOneScale(+split[0], +split[1], +split[2]);
    }

    /**
     * Generate colour object from 1 based digits ( 1, 0, 0 (, 1) = "red" )
     * 
     * @param {number} R 
     * @param {number} G 
     * @param {number} B 
     * @param {number} [A] 
     * @returns 
     * @memberof Colour
     */
    public FromRGBOneScale(R: number, G: number, B: number, A?: number) {
        return this.FromRGB(R * 255, G * 255, B * 255, A);
    }

    /**
     * Create colour object from RGB digits ( 255, 0, 0 (,1) = "red" )
     * 
     * @param {number} R 
     * @param {number} G 
     * @param {number} B 
     * @param {number} [A] 
     * @returns 
     * @memberof Colour
     */
    public FromRGB(R: number, G: number, B: number, A?: number) {

        this.R = R;
        this.G = G;
        this.B = B;

        var hex = ("0" + R.toString(16)).slice(-2) + ("0" + G.toString(16)).slice(-2) + ("0" + B.toString(16)).slice(-2);

        this.HEXString = "#" + hex;

        var hexNumber = "0x" + hex;
        this.HEXNumber = +hexNumber;

        this.IsSet = true;

        return this;
    }

    /**
     * Create colour object from Hexadecimal colour string ( #FF0000 / #F00 = "red" )
     * 
     * @param {string} HEX 
     * @returns 
     * @memberof Colour
     */
    public FromHEX(HEX: string) {
        if (HEX.charAt(0) != "#" || (HEX.length != 4 && HEX.length != 7)) { throw "Not a valid hex string! Expected format '#ABC' or '#AABBCC"; }

        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        HEX = HEX.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });

        this.HEXString = "#" + HEX.replace("#", "");

        var hexNumber = "0x" + HEX;
        this.HEXNumber = +hexNumber;

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(HEX);
        var rgb = result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;

        if (!!rgb) {
            this.R = rgb.r;
            this.G = rgb.g;
            this.B = rgb.b;
        }

        this.IsSet = true;

        return this;
    }
}
