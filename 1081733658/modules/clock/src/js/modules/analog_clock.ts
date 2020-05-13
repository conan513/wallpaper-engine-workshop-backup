/// <reference path="clock_engine.ts" />

/**
 * Analog Clock module
 * 
 * @class Analog_Clock
 * @extends {Clock}
 */
class Analog_Clock extends Clock {

    private _Object: HTMLElement;
    private _Style: HTMLStyleElement;

    private _DateContainer: HTMLElement;

    private _ShowDateString: boolean;

    private _BaseSelector: string;

    private _ImagePath = 'img/faces/';

    /**
     * Creates an instance of Analog_Clock.
     * @param {string} selector 
     * @memberof Analog_Clock
     */
    constructor(selector: string) {
        super();

        this._BaseSelector = selector + " ";

        this._ShowDateString = true;

        this.Create(selector);

        this.Bind();
    }

    /**
     * Bind the OnTick event for the clock ( gets called every second )
     * 
     * @memberof Analog_Clock
     */
    public Bind() {
        this.OnTick = this.AnalogTick;
    }

    /**
     * Enable or Disable the clock
     * 
     * @param {any} enable 
     * @memberof Analog_Clock
     */
    public Enable(enable) {
        if (enable) {
            this.Start();
            this._Object.style.display = 'block';
        } else {
            this.Stop();
            this._Object.style.display = 'none';
        }
    }

    /**
     * Enable or disable the date showing
     * 
     * @param {any} enable 
     * @memberof Analog_Clock
     */
    public EnableDate(enable) {
        var clock = document.querySelector(this._BaseSelector + ".clock--analog") as HTMLElement;
        this._ShowDateString = enable;

        if (enable) {
            clock.classList.remove("no-date");
        } else {
            clock.classList.add("no-date");
        }
    }

    /**
     * Set a custom clock face for the analog clock
     * path can be a URL
     * 
     * @param {any} path 
     * @memberof Analog_Clock
     */
    public SetCustomFace(path) {
        this._SetFace(path);
    }

    /**
     * Set the folder for the default faces that are supplied with this module
     * 
     * @param {any} path 
     * @memberof Analog_Clock
     */
    public SetFacesFolderPath(path) {
        this._ImagePath = path;
    }

    /**
     * Set a build in clock face by number
     * 
     * @param {any} number 
     * @memberof Analog_Clock
     */
    public SetBuiltInFace(number) {
        // apply face
        if (number < 0 || number > 6) {
            number = 0;
            console.log("Face number out of bounds, defaulted to '0'");
        }

        this._SetFace(this._ImagePath + 'face-' + number + '.jpg');
    }

    /**
     * Private method to set the face of the analog clock ( backgroud image )
     * 
     * @private
     * @param {any} path 
     * @memberof Analog_Clock
     */
    private _SetFace(path) {
        this._Object.style.backgroundImage = 'url(' + path + ')';
    }

    /**
     * Create the analog clock
     * 
     * @param {string} selector 
     * @memberof Analog_Clock
     */
    public Create(selector: string) {

        // Create the clock container
        var clock = document.createElement("div");
        clock.className = "clock clock--analog";

        clock.setAttribute("color", "#000000");

        // Create the hours hand        
        var hoursContainer = document.createElement("div");
        hoursContainer.className = "hours-container";
        var hours = document.createElement("div");
        hours.className = "hours";

        hoursContainer.appendChild(hours);

        // Create the minutes hand        
        var minutesContainer = document.createElement("div");
        minutesContainer.className = "minutes-container";
        var minutes = document.createElement("div");
        minutes.className = "minutes";

        minutesContainer.appendChild(minutes);

        // Create the seconds hand        
        var secondsContainer = document.createElement("div");
        secondsContainer.className = "seconds-container";
        var seconds = document.createElement("div");
        seconds.className = "seconds";

        secondsContainer.appendChild(seconds);

        // Append the hour, minute and seconds hand
        clock.appendChild(hoursContainer);
        clock.appendChild(minutesContainer);
        clock.appendChild(secondsContainer);

        // Create the date container        
        var dateContainer = document.createElement("div");
        dateContainer.className = "date";

        this._DateContainer = dateContainer;

        clock.appendChild(dateContainer);

        var container = document.querySelector(selector);
        container.appendChild(clock);

        this._Object = clock;

        this.SetBuiltInFace(5);
    }

    private _transformScale = 1;
    /**
     * Set the scale of the clock
     * 
     * @param {any} number 
     * @memberof Analog_Clock
     */
    public SetScale(number) {
        this._transformScale = number / 2;

        this._SetTransform();
    }

    private _transformOffsetX = 0;
    /**
     * Set the horizontal position of the clock ( range -100 <-> 100% offset )
     * 0 = center
     * 
     * @param {any} number 
     * @memberof Analog_Clock
     */
    public SetHorizontalPosition(number) {
        this._transformOffsetX = number / 2;

        this._SetTransform();
    }

    private _transformOffsetY = 0;
    /**
     * Set the vertical position of the clock ( range -100 <-> 100% offset )
     * 0 = center
     * 
     * @param {any} number 
     * @memberof Analog_Clock
     */
    public SetVerticalPosition(number) {
        this._transformOffsetY = number / 2;

        this._SetTransform();
    }

    /**
     * Set the date string available in the clock to the HTML container
     * 
     * @memberof Analog_Clock
     */
    public SetDateString() {
        // Update the datestring
        this._DateContainer.innerHTML = this.dateString;
    }

    /**
     * Set the transform ( position & scale ) othe clock
     * 
     * @private
     * @memberof Analog_Clock
     */
    private _SetTransform() {

        var translate = /(translate\(.*\))/g; 
        var matches = this._Object.parentElement.style.transform.match(translate);
        if (matches && matches.length != -1) {
            this._Object.parentElement.style.transform = this._Object.parentElement.style.transform.replace(translate, "translate(" + this._transformOffsetX + "%, " + this._transformOffsetY + "%)");
        } else {
            this._Object.parentElement.style.transform += " translate(" + this._transformOffsetX + "%, " + this._transformOffsetY + "%)";
        }

        this._Object.style.transform = "scale(" + this._transformScale + ")";
    }

    /**
     * Update the style of the clock ( color )
     * 
     * @param {any} [HEXColorString] 
     * @memberof Analog_Clock
     */
    public UpdateStyle(HEXColorString?) {
        if (!this._Style) {
            this._Style = document.createElement("style") as HTMLStyleElement;
            document.head.appendChild(this._Style);
        }

        var sheet = this._Style.sheet;
        var numberRules = sheet.rules.length;

        for (var x = 0; x < numberRules; x++) {
            sheet.deleteRule(0);
        }

        // Set Color        
        var colorHex = HEXColorString || this._Object.getAttribute("color") || "#FF0000";

        var color = new Colour().FromHEX(colorHex);
        var alphaColor = new Colour().FromHEX(colorHex);
        alphaColor.Alpha = 0.2;

        sheet.addRule(this._BaseSelector + ".clock--analog .hours, .clock--analog .minutes, .clock--analog .seconds", "background: " + alphaColor.RGBColourString() + ";");
        sheet.addRule(this._BaseSelector + ".clock--analog", "filter: drop-shadow(0 0 5px " + alphaColor.RGBColourString() + ")");
        sheet.addRule(this._BaseSelector + ".clock--analog .date", "color: " + alphaColor.RGBColourString() + " !important; filter: drop-shadow(0 0 3px " + color.RGBColourString() + ") !important;")
    }

    /**
     * Method that gets called every second and updates the clock
     * 
     * @memberof Analog_Clock
     */
    public AnalogTick() {

        // Refresh the datestring if it's a new day        
        if (this._ShowDateString) {
            if (this._IsNewDay()) {
                this.SetDateString();
            }
            if (!this._DateContainer.innerHTML) {
                this.SetDateString();
            }
        }

        var hands = [
            {
                hand: 'seconds',
                angle: (this.seconds * 6)
            },
            {
                hand: 'minutes',
                angle: (this.minutes * 6)
            },
            {
                hand: 'hours',
                angle: (this.hours * 30) + (this.minutes / 2)
            }
        ];
        // Loop through each of these hands to set their angle
        for (var j = 0; j < hands.length; j++) {
            var elements = document.querySelectorAll('.' + hands[j].hand);
            for (var k = 0; k < elements.length; k++) {
                (<any>elements[k]).style.transform = 'rotateZ(' + hands[j].angle + 'deg)';
            }

            if (hands[j].hand === 'seconds' && hands[j].angle === 0) {
                break;
            }
        }
    }

    /**
     * Remove this object
     * 
     * @memberof Analog_Clock
     */
    public Destroy() {
        this._Object.remove();
    }
}