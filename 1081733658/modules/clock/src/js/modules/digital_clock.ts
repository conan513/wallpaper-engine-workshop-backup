/// <reference path="helpers.ts" />
/// <reference path="clock_engine.ts" />

/**
 * Digital animated clock
 * 
 * @class Digital_Clock
 * @extends {Clock}
 */
class Digital_Clock extends Clock {

    private _Object: HTMLElement;
    private _Style: HTMLStyleElement;

    private _Use24Hours: boolean;
    private _ShowDateString: boolean;

    private _BaseSelector: string;

    /**
     * Creates an instance of Digital_Clock.
     * @param {string} selector 
     * @memberof Digital_Clock
     */
    constructor(selector: string) {
        super();

        this._BaseSelector = selector + " ";

        this._Use24Hours = true;
        this._ShowDateString = true;

        this.Create(selector);

        this.UpdateStyle();

        this.Bind();
    }

    /**
     * Enable or disable the clock
     * 
     * @param {any} enable 
     * @memberof Digital_Clock
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
     * Enable or disable 24H clock ( switch between 12H with AM/PM marking or 24H )
     * 
     * @param {any} enable 
     * @memberof Digital_Clock
     */
    public Enable24Hour(enable) {
        this._Use24Hours = enable;

        if (enable) {
            this._Object.classList.remove("AM");
            this._Object.classList.remove("PM");
        }
    }

    /**
     * Enable or disable 24H clock ( switch between 12H with AM/PM marking or 24H )
     * 
     * @param {any} enable 
     * @memberof Digital_Clock
     */
    public EnableSeconds(enable) {
        var clock = document.querySelector(this._BaseSelector + ".clock--digital") as HTMLElement;

        if (enable) {
            clock.classList.remove("no-seconds");
        } else {
            clock.classList.add("no-seconds");
        }
    }

    /**
     * Enable or disable the number seperator ( : )
     * 
     * @param {any} enable 
     * @memberof Digital_Clock
     */
    public EnableNumberSeprator(enable) {
        var clock = document.querySelector(this._BaseSelector + ".clock--digital") as HTMLElement;
        
        if (enable) {
            clock.classList.remove("no-separator");   
        } else {
            clock.classList.add("no-separator");   
        }
    }

    private _DateContainer: HTMLElement;
    /**
     * Enable or disable the date string shown at the clock
     * 
     * @param {any} enable 
     * @memberof Digital_Clock
     */
    public EnableDate(enable) {
        var clock = document.querySelector(this._BaseSelector + ".clock--digital") as HTMLElement;
        this._ShowDateString = enable;

        if (enable) {
            clock.classList.remove("no-date");
        } else {
            clock.classList.add("no-date");
        }
    }

    /**
     * Bind the digital tick event to fire every second
     * 
     * @memberof Digital_Clock
     */
    public Bind() {
        this.OnTick = this.DigitalTick;
    }

    /**
     * Create the digital clock
     * 
     * @param {string} selector 
     * @memberof Digital_Clock
     */
    public Create(selector: string) {
        // Create the clock container
        var clock = document.createElement("div");
        clock.className = "clock clock--digital";
        clock.setAttribute("color", "#000000");

        // Create the numbers & dots        
        for (var n = 0; n < 6; n++) {

            var number = document.createElement("div");
            number.className = "number number-" + n;

            // Create the lines for the number            
            for (var l = 0; l < 7; l++) {
                var line = document.createElement("div");
                line.className = "line line-" + l;

                if (l % 2 != 0) {
                    line.className += " horizontal";
                } else {
                    line.className += " vertical";
                }

                // Append the line to the number                
                number.appendChild(line);
            }

            // Create the dots after the 2nd and 4th number => 00:00:00            
            if (n == 2 || n == 4) {
                var dots = document.createElement("div");
                dots.className = "dots";

                // Append the dots to the clock                
                clock.appendChild(dots);
            }

            // Append the number to the clock            
            clock.appendChild(number);
        }

        // Create the date container        
        var dateContainer = document.createElement("div");
        dateContainer.className = "date";

        this._DateContainer = dateContainer;

        clock.appendChild(dateContainer);

        // Add the clock to the container        
        var container = document.querySelector(selector);
        container.appendChild(clock);

        // Assign the clock to a private variable        
        this._Object = clock;
    }

    /**
     * Set the date string in the HTML container
     * 
     * @memberof Digital_Clock
     */
    public SetDateString() {
        // Update the datestring
        this._DateContainer.innerHTML = this.dateString;
    }

    private _transformScale = 1;
    /**
     * Set the scale of the clock
     * 
     * @param {any} number 
     * @memberof Digital_Clock
     */
    public SetScale(number) {
        this._transformScale = number;

        this._SetTransform();
    }

    private _transformOffsetX = 0;
    /**
     * Set the horizontal position offset of the clock ( -100 <-> 100 )
     * 0 = center
     * 
     * @param {any} number 
     * @memberof Digital_Clock
     */
    public SetHorizontalPosition(number) {
        this._transformOffsetX = number / 2;

        this._SetTransform();
    }

    private _transformOffsetY = 0;
    /**
     * Set the vertical position offset of the clock ( -100 <-> 100 )
     * 0 = center
     * 
     * @param {any} number 
     * @memberof Digital_Clock
     */
    public SetVerticalPosition(number) {
        this._transformOffsetY = number / 2;

        this._SetTransform();
    }

    /**
     * Set the transform for the clock ( position + scale )
     * 
     * @private
     * @memberof Digital_Clock
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
     * Update the style for this clock ( color )
     * 
     * @param {any} [HEXColorString] 
     * @memberof Digital_Clock
     */
    public UpdateStyle(HEXColorString?) {

        // Create new stylesheet, if there is none yet
        if (!this._Style) {
            this._Style = document.createElement("style") as HTMLStyleElement;
            document.head.appendChild(this._Style);
        }

        // Clear the stylesheet
        var sheet = this._Style.sheet;
        var numberRules = sheet.rules.length;

        for (var x = 0; x < numberRules; x++) {
            sheet.deleteRule(0);
        }

        // Set Color        
        var colorHex = HEXColorString || this._Object.getAttribute("color") || "#FF0000";

        // Get Color from Hex color + alpha        
        var color = new Colour().FromHEX(colorHex);
        var alphaColor = new Colour().FromHEX(colorHex);
        alphaColor.Alpha = 0.2;

        // Add rules to stylesheet
        sheet.addRule(this._BaseSelector + ".clock--digital :before, " + this._BaseSelector + " .clock--digital :after", "background: " + alphaColor.RGBAColourString() + ";")
        sheet.addRule(this._BaseSelector + ".clock--digital .active:before, " + this._BaseSelector + " .clock--digital .active:after", "background: " + color.RGBColourString() + " !important; filter: drop-shadow(0 0 3px " + color.RGBColourString() + ") !important;");
        sheet.addRule(this._BaseSelector + ".clock--digital.AM:before, " + this._BaseSelector + " .clock--digital.PM:after", "color: " + color.RGBColourString() + " !important; filter: drop-shadow(0 0 3px " + color.RGBColourString() + ") !important;");
        sheet.addRule(this._BaseSelector + ".clock--digital.PM:before, " + this._BaseSelector + " .clock--digital.AM:after", "color: " + alphaColor.RGBAColourString() + " !important;");
        sheet.addRule(this._BaseSelector + ".clock--digital .date", "color: " + alphaColor.RGBColourString() + " !important; filter: drop-shadow(0 0 3px " + color.RGBColourString() + ") !important;")
    }

    /**
     * The tick for this clocks that gets called every second to update the clock state
     * 
     * @memberof Digital_Clock
     */
    public DigitalTick() {

        // Refresh the datestring if it's a new day        
        if (this._ShowDateString) {
            if (this._IsNewDay()) {
                this.SetDateString();
            }
            if (!this._DateContainer.innerHTML) {
                this.SetDateString();
            }
        }

        // Set the AM/PM indicators if 12H clock is used        
        if (!this._Use24Hours) {

            if (this.hours > 11 && this.hours < 24) {
                this._Object.classList.add("PM");
                this._Object.classList.remove("AM");
            } else {
                this._Object.classList.add("AM");
                this._Object.classList.remove("PM");
            }

            this.hours %= 12;
            if (this.hours == 0) { this.hours = 12; }
        }

        // Flicker Dots every second
        var dots = this._Object.querySelectorAll(this._BaseSelector + ".dots");
        if (this.seconds % 2 == 0) {
            dots.forEach(el => {
                el.classList.add("active");
            });
        } else {
            dots.forEach(el => {
                el.classList.remove("active");
            });
        }

        // Set Number Attributes
        var hoursNumbers = ("0" + this.hours).slice(-2);
        var number1 = this._Object.querySelector(this._BaseSelector + ".number-0");
        number1.setAttribute("number", hoursNumbers[0]);
        var number2 = this._Object.querySelector(this._BaseSelector + ".number-1");
        number2.setAttribute("number", hoursNumbers[1]);

        var minuteNumbers = ("0" + this.minutes).slice(-2);
        var number3 = this._Object.querySelector(this._BaseSelector + ".number-2");
        number3.setAttribute("number", minuteNumbers[0]);
        var number4 = this._Object.querySelector(this._BaseSelector + ".number-3");
        number4.setAttribute("number", minuteNumbers[1]);

        var secondNumbers = ("0" + this.seconds).slice(-2);
        var number5 = this._Object.querySelector(this._BaseSelector + ".number-4");
        number5.setAttribute("number", secondNumbers[0]);
        var number6 = this._Object.querySelector(this._BaseSelector + ".number-5");
        number6.setAttribute("number", secondNumbers[1]);

        // Set Lines Active States
        var numbers = this._Object.querySelectorAll(this._BaseSelector + ".number");
        numbers.forEach(number => {
            var value = number.getAttribute("number");

            // get individual lines
            var line0 = number.querySelector(".line-0");
            var line1 = number.querySelector(".line-1");
            var line2 = number.querySelector(".line-2");
            var line3 = number.querySelector(".line-3");
            var line4 = number.querySelector(".line-4");
            var line5 = number.querySelector(".line-5");
            var line6 = number.querySelector(".line-6");

            // Massive switch LETSGO! -- set active lines per number
            switch (+value) {
                case 0:
                    line0.classList.add("active");
                    line1.classList.add("active");
                    line2.classList.add("active");
                    line3.classList.remove("active");
                    line4.classList.add("active");
                    line5.classList.add("active");
                    line6.classList.add("active");
                    break;
                case 1:
                    line0.classList.remove("active");
                    line1.classList.remove("active");
                    line2.classList.add("active");
                    line3.classList.remove("active");
                    line4.classList.remove("active");
                    line5.classList.remove("active");
                    line6.classList.add("active");
                    break;
                case 2:
                    line0.classList.remove("active");
                    line1.classList.add("active");
                    line2.classList.add("active");
                    line3.classList.add("active");
                    line4.classList.add("active");
                    line5.classList.add("active");
                    line6.classList.remove("active");
                    break;
                case 3:
                    line0.classList.remove("active");
                    line1.classList.add("active");
                    line2.classList.add("active");
                    line3.classList.add("active");
                    line4.classList.remove("active");
                    line5.classList.add("active");
                    line6.classList.add("active");
                    break;
                case 4:
                    line0.classList.add("active");
                    line1.classList.remove("active");
                    line2.classList.add("active");
                    line3.classList.add("active");
                    line4.classList.remove("active");
                    line5.classList.remove("active");
                    line6.classList.add("active");
                    break;
                case 5:
                    line0.classList.add("active");
                    line1.classList.add("active");
                    line2.classList.remove("active");
                    line3.classList.add("active");
                    line4.classList.remove("active");
                    line5.classList.add("active");
                    line6.classList.add("active");
                    break;
                case 6:
                    line0.classList.add("active");
                    line1.classList.add("active");
                    line2.classList.remove("active");
                    line3.classList.add("active");
                    line4.classList.add("active");
                    line5.classList.add("active");
                    line6.classList.add("active");
                    break;
                case 7:
                    line0.classList.remove("active");
                    line1.classList.add("active");
                    line2.classList.add("active");
                    line3.classList.remove("active");
                    line4.classList.remove("active");
                    line5.classList.remove("active");
                    line6.classList.add("active");
                    break;
                case 8:
                    line0.classList.add("active");
                    line1.classList.add("active");
                    line2.classList.add("active");
                    line3.classList.add("active");
                    line4.classList.add("active");
                    line5.classList.add("active");
                    line6.classList.add("active");
                    break;
                case 9:
                    line0.classList.add("active");
                    line1.classList.add("active");
                    line2.classList.add("active");
                    line3.classList.add("active");
                    line4.classList.remove("active");
                    line5.classList.add("active");
                    line6.classList.add("active");
                    break;

            }
        });
    }

    /**
     * Destroy this object
     * 
     * @memberof Digital_Clock
     */
    public Destroy() {
        this._Object.remove();
    }
}