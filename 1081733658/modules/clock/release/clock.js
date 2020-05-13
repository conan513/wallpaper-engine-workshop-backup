var __extends = (this && this.__extends) || (function() {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] }
            instanceof Array && function(d, b) { d.__proto__ = b; }) ||
        function(d, b) {
            for (var p in b)
                if (b.hasOwnProperty(p)) d[p] = b[p];
        };
    return function(d, b) {
        extendStatics(d, b);

        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Clock = (function() {
    function Clock() {
        this.settings = {
            locale: "en-US",
            format: {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long"
            }
        };
        this.Start();
    }
    Clock.prototype.Start = function() {
        var _this = this;
        this._OnTick();
        this.interval = setInterval(function() { return _this._OnTick(); }, 1000);
    };
    Clock.prototype.Pause = function() {
        clearInterval(this.interval);
    };
    Clock.prototype.Stop = function() {
        this.Pause();
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
        this.dateString = "";
    };
    Clock.prototype._IsNewDay = function() {
        // If 00:00:00, return true ( is called every second )
        return this.hours % 12 == 0 && this.minutes % 60 == 0 && this.seconds % 60 == 0;
    };
    Clock.prototype.EnableYear = function(enable) {
        this.settings.format.year = enable ? "numeric" : null;
        this._OnTick();
    };
    Clock.prototype.EnableMonth = function(enable) {
        this.settings.format.month = enable ? "long" : null;
        this._OnTick();
    };
    Clock.prototype.EnableDay = function(enable) {
        this.settings.format.day = enable ? "numeric" : null;
        this._OnTick();
    };
    Clock.prototype.EnableWeekDay = function(enable) {
        this.settings.format.weekday = enable ? "long" : null;
        this._OnTick();
    };
    Clock.prototype.SetLocale = function(locale) {
        this.settings.locale = locale;
        this._OnTick();
    };
    Clock.prototype._OnTick = function() {
        var date = new Date();
        // Change format options:
        var options = { year: "numeric", month: "long", day: "numeric", weekday: "long" };
        if (this.settings.format.year) {
            options.year = this.settings.format.year;
        } else {
            delete options.year;
        }
        if (this.settings.format.month) {
            options.month = this.settings.format.month;
        } else {
            delete options.month;
        }
        if (this.settings.format.day) {
            options.day = this.settings.format.day;
        } else {
            delete options.day;
        }
        if (this.settings.format.weekday) {
            options.weekday = this.settings.format.weekday;
        } else {
            delete options.weekday;
        }
        try {
            this.dateString = date.toLocaleDateString(this.settings.locale, options);
        } catch (e) {
            this.dateString = "Invalid Locale or Options ( try : en-US )";
        }
        this.day = date.getDate();
        this.month = date.getMonth() + 1;
        this.year = date.getFullYear();
        this.hours = date.getHours();
        this.minutes = date.getMinutes();
        this.seconds = date.getSeconds();
        if (this.OnTick) {
            this.OnTick();
        }
    };
    return Clock;
}());
/// <reference path="clock_engine.ts" />
var Analog_Clock = (function(_super) {
    __extends(Analog_Clock, _super);

    function Analog_Clock(selector) {
        var _this = _super.call(this) || this;
        _this._ImagePath = 'img/faces/';
        _this._transformScale = 1;
        // Range -100 <-> 100 ( 0 = center )
        _this._transformOffsetX = 0;
        _this._transformOffsetY = 0;
        _this._BaseSelector = selector + " ";
        _this._ShowDateString = true;
        _this.Create(selector);
        _this.Bind();
        return _this;
    }
    Analog_Clock.prototype.Bind = function() {
        this.OnTick = this.AnalogTick;
    };
    Analog_Clock.prototype.Enable = function(enable) {
        if (enable) {
            this.Start();
            this._Object.style.display = 'block';
        } else {
            this.Stop();
            this._Object.style.display = 'none';
        }
    };
    Analog_Clock.prototype.EnableDate = function(enable) {
        var clock = document.querySelector(this._BaseSelector + ".clock--analog");
        this._ShowDateString = enable;
        if (enable) {
            clock.classList.remove("no-date");
        } else {
            clock.classList.add("no-date");
        }
    };
    Analog_Clock.prototype.SetCustomFace = function(path) {
        this._SetFace(path);
    };
    Analog_Clock.prototype.SetFacesFolderPath = function(path) {
        this._ImagePath = path;
    };
    Analog_Clock.prototype.SetBuiltInFace = function(number) {
        // apply face
        if (number < 0 || number > 6) {
            number = 0;
            console.log("Face number out of bounds, defaulted to '0'");
        }
        this._SetFace(this._ImagePath + 'face-' + number + '.jpg');
    };
    Analog_Clock.prototype._SetFace = function(path) {
        this._Object.style.backgroundImage = 'url(' + path + ')';
    };
    Analog_Clock.prototype.Create = function(selector) {
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
    };
    Analog_Clock.prototype.SetScale = function(number) {
        this._transformScale = number / 2;
        this._SetTransform();
    };
    Analog_Clock.prototype.SetHorizontalPosition = function(number) {
        this._transformOffsetX = number / 2;
        this._SetTransform();
    };
    Analog_Clock.prototype.SetVerticalPosition = function(number) {
        this._transformOffsetY = number / 2;
        this._SetTransform();
    };
    Analog_Clock.prototype.SetDateString = function() {
        // Update the datestring
        this._DateContainer.innerHTML = this.dateString;
    };
    Analog_Clock.prototype._SetTransform = function() {
        var translate = /(translate\(.+?\))/g;
        var matches = this._Object.parentElement.style.transform.match(translate);
        if (matches && matches.length != -1) {
            this._Object.parentElement.style.transform = this._Object.parentElement.style.transform.replace(translate, "translate(" + this._transformOffsetX + "%, " + this._transformOffsetY + "%)");
        } else {
            this._Object.parentElement.style.transform += " translate(" + this._transformOffsetX + "%, " + this._transformOffsetY + "%)";
        }
        this._Object.style.transform = "scale(" + this._transformScale + ")";
    };
    Analog_Clock.prototype.UpdateStyle = function(HEXColorString) {
        if (!this._Style) {
            this._Style = document.createElement("style");
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
        sheet.addRule(this._BaseSelector + ".clock--analog .date", "color: " + alphaColor.RGBColourString() + " !important; filter: drop-shadow(0 0 3px " + color.RGBColourString() + ") !important;");
    };
    Analog_Clock.prototype.AnalogTick = function() {
        // Refresh the datestring if it's a new day        
        if (this._ShowDateString) {
            if (this._IsNewDay()) {
                this.SetDateString();
            }
            if (!this._DateContainer.innerHTML) {
                this.SetDateString();
            }
        }
        var hands = [{
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
                elements[k].style.transform = 'rotateZ(' + hands[j].angle + 'deg)';
            }
            if (hands[j].hand === 'seconds' && hands[j].angle === 0) {
                break;
            }
        }
    };
    Analog_Clock.prototype.Destroy = function() {
        this._Object.remove();
    };
    return Analog_Clock;
}(Clock));
Array.prototype.sum = Array.prototype.sum || function() {
    return this.reduce(function(sum, a) { return sum + Number(a); }, 0);
};
Array.prototype.take = Array.prototype.take || function(num) {
    return this.slice(0, num);
};
Array.prototype.average = Array.prototype.average || function() {
    return this.sum() / (this.length || 1);
};
Array.prototype.interpolate = Array.prototype.interpolate || function(newLength) {
    var data = this;
    var linearInterpolate = function(before, after, atPoint) {
        return before + (after - before) * atPoint;
    };
    var newData = new Array();
    var springFactor = new Number((data.length - 1) / (newLength - 1));
    newData[0] = data[0]; // for new allocation
    for (var i = 1; i < newLength - 1; i++) {
        var tmp = +springFactor * i;
        var before = new Number(Math.floor(tmp)).toFixed();
        var after = new Number(Math.ceil(tmp)).toFixed();
        var atPoint = tmp - +before;
        newData[i] = linearInterpolate(data[before], data[after], atPoint);
    }
    newData[newLength - 1] = data[data.length - 1]; // for new allocation
    return newData;
};
var Colour = (function() {
    function Colour() {
        var _this = this;
        this.RGBString = (function() { return _this.R + "," + _this.G + "," + _this.B; });
        this.RGBAString = (function() { return _this.RGBString() + "," + _this.Alpha; });
        this.RGBAColourString = (function() { return "rgba(" + _this.RGBString() + "," + _this.Alpha + ")"; });
        this.RGBColourString = (function() { return "rgb(" + _this.RGBString() + ")"; });
        this.Alpha = 1;
    }
    Colour.prototype.FromRGBOneScaleString = function(rgb) {
        var split = rgb.split(" ");
        return this.FromRGBOneScale(+split[0], +split[1], +split[2]);
    };
    Colour.prototype.FromRGBOneScale = function(R, G, B, A) {
        return this.FromRGB(R * 255, G * 255, B * 255, A);
    };
    Colour.prototype.FromRGB = function(R, G, B, A) {
        this.R = R;
        this.G = G;
        this.B = B;
        var hex = ("0" + R.toString(16)).slice(-2) + ("0" + G.toString(16)).slice(-2) + ("0" + B.toString(16)).slice(-2);
        this.HEXString = "#" + hex;
        var hexNumber = "0x" + hex;
        this.HEXNumber = +hexNumber;
        this.IsSet = true;
        return this;
    };
    Colour.prototype.FromHEX = function(HEX) {
        if (HEX.charAt(0) != "#" || (HEX.length != 4 && HEX.length != 7)) {
            throw "Not a valid hex string! Expected format '#ABC' or '#AABBCC";
        }
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        HEX = HEX.replace(shorthandRegex, function(m, r, g, b) {
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
    };
    return Colour;
}());
/// <reference path="helpers.ts" />
/// <reference path="clock_engine.ts" />
var Digital_Clock = (function(_super) {
    __extends(Digital_Clock, _super);

    function Digital_Clock(selector) {
        var _this = _super.call(this) || this;
        _this._transformScale = 1;
        // Range -100 <-> 100 ( 0 = center )
        _this._transformOffsetX = 0;
        _this._transformOffsetY = 0;
        _this._BaseSelector = selector + " ";
        _this._Use24Hours = true;
        _this._ShowDateString = true;
        _this.Create(selector);
        _this.UpdateStyle();
        _this.Bind();
        return _this;
    }
    Digital_Clock.prototype.Enable = function(enable) {
        if (enable) {
            this.Start();
            this._Object.style.display = 'block';
        } else {
            this.Stop();
            this._Object.style.display = 'none';
        }
    };
    Digital_Clock.prototype.Enable24Hour = function(enable) {
        this._Use24Hours = enable;
        if (enable) {
            this._Object.classList.remove("AM");
            this._Object.classList.remove("PM");
        }
    };
    Digital_Clock.prototype.EnableSeconds = function(enable) {
        var clock = document.querySelector(this._BaseSelector + ".clock--digital");
        if (enable) {
            clock.classList.remove("no-seconds");
        } else {
            clock.classList.add("no-seconds");
        }
    };
    Digital_Clock.prototype.EnableNumberSeprator = function(enable) {
        var clock = document.querySelector(this._BaseSelector + ".clock--digital");
        if (enable) {
            clock.classList.remove("no-separator");
        } else {
            clock.classList.add("no-separator");
        }
    };
    Digital_Clock.prototype.EnableDate = function(enable) {
        var clock = document.querySelector(this._BaseSelector + ".clock--digital");
        this._ShowDateString = enable;
        if (enable) {
            clock.classList.remove("no-date");
        } else {
            clock.classList.add("no-date");
        }
    };
    Digital_Clock.prototype.Bind = function() {
        this.OnTick = this.DigitalTick;
    };
    Digital_Clock.prototype.Create = function(selector) {
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
    };
    Digital_Clock.prototype.SetDateString = function() {
        // Update the datestring
        this._DateContainer.innerHTML = this.dateString;
    };
    Digital_Clock.prototype.SetScale = function(number) {
        this._transformScale = number;
        this._SetTransform();
    };
    Digital_Clock.prototype.SetHorizontalPosition = function(number) {
        this._transformOffsetX = number / 2;
        this._SetTransform();
    };
    Digital_Clock.prototype.SetVerticalPosition = function(number) {
        this._transformOffsetY = number / 2;
        this._SetTransform();
    };
    Digital_Clock.prototype._SetTransform = function() {
        var translate = /(translate\(.+?\))/g;
        var matches = this._Object.parentElement.style.transform.match(translate);
        if (matches && matches.length != -1) {
            this._Object.parentElement.style.transform = this._Object.parentElement.style.transform.replace(translate, "translate(" + this._transformOffsetX + "%, " + this._transformOffsetY + "%)");
        } else {
            this._Object.parentElement.style.transform += " translate(" + this._transformOffsetX + "%, " + this._transformOffsetY + "%)";
        }
        this._Object.style.transform = "scale(" + this._transformScale + ")";
    };
    Digital_Clock.prototype.UpdateStyle = function(HEXColorString) {
        // Create new stylesheet, if there is none yet
        if (!this._Style) {
            this._Style = document.createElement("style");
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
        sheet.addRule(this._BaseSelector + ".clock--digital :before, " + this._BaseSelector + " .clock--digital :after", "background: " + alphaColor.RGBAColourString() + ";");
        sheet.addRule(this._BaseSelector + ".clock--digital .active:before, " + this._BaseSelector + " .clock--digital .active:after", "background: " + color.RGBColourString() + " !important; filter: drop-shadow(0 0 3px " + color.RGBColourString() + ") !important;");
        sheet.addRule(this._BaseSelector + ".clock--digital.AM:before, " + this._BaseSelector + " .clock--digital.PM:after", "color: " + color.RGBColourString() + " !important; filter: drop-shadow(0 0 3px " + color.RGBColourString() + ") !important;");
        sheet.addRule(this._BaseSelector + ".clock--digital.PM:before, " + this._BaseSelector + " .clock--digital.AM:after", "color: " + alphaColor.RGBAColourString() + " !important;");
        sheet.addRule(this._BaseSelector + ".clock--digital .date", "color: " + alphaColor.RGBColourString() + " !important; filter: drop-shadow(0 0 3px " + color.RGBColourString() + ") !important;");
    };
    Digital_Clock.prototype.DigitalTick = function() {
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
            if (this.hours == 0) {
                this.hours = 12;
            }
        }
        // Flicker Dots every second
        var dots = this._Object.querySelectorAll(this._BaseSelector + ".dots");
        if (this.seconds % 2 == 0) {
            dots.forEach(function(el) {
                el.classList.add("active");
            });
        } else {
            dots.forEach(function(el) {
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
        numbers.forEach(function(number) {
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
    };
    Digital_Clock.prototype.Destroy = function() {
        this._Object.remove();
    };
    return Digital_Clock;
}(Clock));
/// <reference path="helpers.ts" />
/// <reference path="clock_engine.ts" />
var Digital_Clock_Simple = (function(_super) {
    __extends(Digital_Clock_Simple, _super);

    function Digital_Clock_Simple(selector) {
        var _this = _super.call(this) || this;
        _this._transformScale = 1;
        // Range -100 <-> 100 ( 0 = center )
        _this._transformOffsetX = 0;
        _this._transformOffsetY = 0;
        _this._BaseSelector = selector + " ";
        _this._Use24Hours = true;
        _this._ShowDateString = true;
        _this.Create(selector);
        _this.UpdateStyle();
        _this.Bind();
        return _this;
    }
    Digital_Clock_Simple.prototype.Enable = function(enable) {
        if (enable) {
            this.Start();
            this._Object.style.display = 'block';
        } else {
            this.Stop();
            this._Object.style.display = 'none';
        }
    };
    Digital_Clock_Simple.prototype.Enable24Hour = function(enable) {
        this._Use24Hours = enable;
        if (enable) {
            this._Object.classList.remove("AM");
            this._Object.classList.remove("PM");
        }
    };
    Digital_Clock_Simple.prototype.EnableSeconds = function(enable) {
        var clock = document.querySelector(this._BaseSelector + ".clock--digital");
        if (enable) {
            clock.classList.remove("no-seconds");
        } else {
            clock.classList.add("no-seconds");
        }
    };
    Digital_Clock_Simple.prototype.EnableNumberSeprator = function(enable) {
        var clock = document.querySelector(this._BaseSelector + ".clock--digital");
        if (enable) {
            clock.classList.remove("no-separator");
        } else {
            clock.classList.add("no-separator");
        }
    };
    Digital_Clock_Simple.prototype.EnableDate = function(enable) {
        var clock = document.querySelector(this._BaseSelector + ".clock--digital");
        this._ShowDateString = enable;
        if (enable) {
            clock.classList.remove("no-date");
        } else {
            clock.classList.add("no-date");
        }
    };
    Digital_Clock_Simple.prototype.Bind = function() {
        this.OnTick = this.DigitalTick;
    };
    Digital_Clock_Simple.prototype.Create = function(selector) {
        // Create the clock container
        var clock = document.createElement("div");
        clock.className = "clock clock--digital simple";
        clock.setAttribute("color", "#000000");
        // Create the numbers & dots        
        for (var n = 0; n < 6; n++) {
            var number = document.createElement("div");
            number.className = "number number-" + n + " active";
            // Create the dots after the 2nd and 4th number => 00:00:00            
            if (n == 2 || n == 4) {
                var dots = document.createElement("div");
                dots.className = "dots";
                dots.innerHTML = ":";
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
    };
    Digital_Clock_Simple.prototype.SetDateString = function() {
        // Update the datestring
        this._DateContainer.innerHTML = this.dateString;
    };
    Digital_Clock_Simple.prototype.SetScale = function(number) {
        this._transformScale = number;
        this._SetTransform();
    };
    Digital_Clock_Simple.prototype.SetHorizontalPosition = function(number) {
        this._transformOffsetX = number / 2;
        this._SetTransform();
    };
    Digital_Clock_Simple.prototype.SetVerticalPosition = function(number) {
        this._transformOffsetY = number / 2;
        this._SetTransform();
    };
    Digital_Clock_Simple.prototype._SetTransform = function() {
        var translate = /(translate\(.+?\))/g;
        var matches = this._Object.parentElement.style.transform.match(translate);
        if (matches && matches.length != -1) {
            this._Object.parentElement.style.transform = this._Object.parentElement.style.transform.replace(translate, "translate(" + this._transformOffsetX + "%, " + this._transformOffsetY + "%)");
        } else {
            this._Object.parentElement.style.transform += " translate(" + this._transformOffsetX + "%, " + this._transformOffsetY + "%)";
        }
        this._Object.style.transform = "scale(" + this._transformScale + ")";
    };
    Digital_Clock_Simple.prototype.UpdateStyle = function(HEXColorString) {
        // Create new stylesheet, if there is none yet
        if (!this._Style) {
            this._Style = document.createElement("style");
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
        sheet.addRule(this._BaseSelector + ".clock--digital :before, " + this._BaseSelector + " .clock--digital :after", "background: " + alphaColor.RGBAColourString() + ";");
        sheet.addRule(this._BaseSelector + ".clock--digital .dots", "color: " + alphaColor.RGBAColourString() + ";");
        sheet.addRule(this._BaseSelector + ".clock--digital .active:before, " + this._BaseSelector + " .clock--digital .active:after", "background: " + color.RGBColourString() + " !important; filter: drop-shadow(0 0 3px " + color.RGBColourString() + ") !important;");
        sheet.addRule(this._BaseSelector + ".clock--digital.AM:before, " + this._BaseSelector + " .clock--digital.PM:after", "color: " + color.RGBColourString() + " !important; filter: drop-shadow(0 0 3px " + color.RGBColourString() + ") !important;");
        sheet.addRule(this._BaseSelector + ".clock--digital.PM:before, " + this._BaseSelector + " .clock--digital.AM:after", "color: " + alphaColor.RGBAColourString() + " !important;");
        sheet.addRule(this._BaseSelector + ".clock--digital .date, " + this._BaseSelector + ".clock--digital .number, " + this._BaseSelector + ".clock--digital .dots.active", "color: " + alphaColor.RGBColourString() + " !important; filter: drop-shadow(0 0 3px " + color.RGBColourString() + ") !important;");
    };
    Digital_Clock_Simple.prototype.DigitalTick = function() {
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
            if (this.hours == 0) {
                this.hours = 12;
            }
        }
        // Flicker Dots every second
        var dots = this._Object.querySelectorAll(this._BaseSelector + ".dots");
        if (this.seconds % 2 == 0) {
            dots.forEach(function(el) {
                el.classList.add("active");
            });
        } else {
            dots.forEach(function(el) {
                el.classList.remove("active");
            });
        }
        // Set Number Attributes
        var hoursNumbers = ("0" + this.hours).slice(-2);
        var number1 = this._Object.querySelector(this._BaseSelector + ".number-0");
        number1.setAttribute("number", hoursNumbers[0]);
        number1.innerHTML = hoursNumbers[0];
        var number2 = this._Object.querySelector(this._BaseSelector + ".number-1");
        number2.setAttribute("number", hoursNumbers[1]);
        number2.innerHTML = hoursNumbers[1];
        var minuteNumbers = ("0" + this.minutes).slice(-2);
        var number3 = this._Object.querySelector(this._BaseSelector + ".number-2");
        number3.setAttribute("number", minuteNumbers[0]);
        number3.innerHTML = minuteNumbers[0];
        var number4 = this._Object.querySelector(this._BaseSelector + ".number-3");
        number4.setAttribute("number", minuteNumbers[1]);
        number4.innerHTML = minuteNumbers[1];
        var secondNumbers = ("0" + this.seconds).slice(-2);
        var number5 = this._Object.querySelector(this._BaseSelector + ".number-4");
        number5.setAttribute("number", secondNumbers[0]);
        number5.innerHTML = secondNumbers[0];
        var number6 = this._Object.querySelector(this._BaseSelector + ".number-5");
        number6.setAttribute("number", secondNumbers[1]);
        number6.innerHTML = secondNumbers[1];
    };
    Digital_Clock_Simple.prototype.Destroy = function() {
        this._Object.remove();
    };
    return Digital_Clock_Simple;
}(Clock));