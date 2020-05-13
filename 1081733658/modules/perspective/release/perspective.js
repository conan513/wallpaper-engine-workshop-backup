/**
 * Perspective module. Will add cursor controlled perspective effect to HTMLElements ( based on selector )
 *
 * Usage:
 *
 * var perspective = new Perspective(".block");
 *
 * All elements with the classname 'block' will now 'move' based on the cursor position
 *
 * @class Perspective
 */
var Perspective = /** @class */ (function () {
    /**
     * Creates an instance of Perspective.
     *
     * @param {any} selector
     * @memberof Perspective
     */
    function Perspective(selector) {
        /**
         * Private variables stored in the module used for calculation of the perspective effect. NOTE: these are not 'settings'
         *
         * @private
         * @memberof Perspective
         */
        this.Variables = {
            CursorX: window.innerWidth / 2,
            CursorY: window.innerHeight / 2,
            Objects: null,
            OnMouseMove: null
        };
        /**
         * Public settings that can be changed during use to change the behaviour of the module
         *
         * @memberof Perspective
         */
        this.Settings = {
            Enabled: true,
            PerspectiveDistance: 1000,
            PerspectiveStrength: 25,
            StaticTiltEnabled: false,
            StaticTiltY: 0,
            StaticTiltX: 0,
            StaticShiftY: 0,
            StaticShiftX: 0
        };
        this.Variables.Objects = document.querySelectorAll(selector);
        this.Init();
        this.Bind();
    }
    /**
     * Initialize the module
     *
     * @memberof Perspective
     */
    Perspective.prototype.Init = function () {
        this.Settings.Enabled = true;
        this.SetPerspectiveDistance(1000);
    };
    /**
     * Use static perspective instead of cursor movement
     *
     * @param bool True of false
     */
    Perspective.prototype.UseStaticPerspective = function (bool) {
        this.Settings.StaticTiltEnabled = bool;
        this.ApplyPerspective();
    };
    /**
     * Set the tilt Y
     *
     * @param number Tilt Y (-100 - 100)
     */
    Perspective.prototype.SetStaticTiltY = function (number) {
        this.Settings.StaticTiltY = number;
        this.ApplyPerspective();
    };
    /**
     * Set the tilt X
     *
     * @param number Tilt X (-100 - 100)
     */
    Perspective.prototype.SetStaticTiltX = function (number) {
        this.Settings.StaticTiltX = number;
        this.ApplyPerspective();
    };
    /**
     * Set the Shift Y
     *
     * @param number Shift Y (-100 - 100)
     */
    Perspective.prototype.SetStaticShiftY = function (number) {
        this.Settings.StaticShiftY = number;
        this.ApplyPerspective();
    };
    /**
     * Set the Shift X
     *
     * @param number Shift X (-100 - 100)
     */
    Perspective.prototype.SetStaticShiftX = function (number) {
        this.Settings.StaticShiftX = number;
        this.ApplyPerspective();
    };
    /**
     * Bind all event handlers
     *
     * @memberof Perspective
     */
    Perspective.prototype.Bind = function () {
        var _this = this;
        this.Variables.OnMouseMove = function (event) {
            if (!_this.Settings.StaticTiltEnabled) {
                _this._OnMouseMove(event);
            }
        };
        document.addEventListener("mousemove", this.Variables.OnMouseMove);
    };
    /**
     * Event handler for mouse move event. Calls the 'ApplyPerpspective' method for each object
     *
     * @private
     * @param {MouseEvent} event
     * @returns
     * @memberof Perspective
     */
    Perspective.prototype._OnMouseMove = function (event) {
        if (!this.Settings.Enabled) {
            return;
        }
        this.Variables.CursorX = event.pageX || 1;
        this.Variables.CursorY = event.pageY || 1;
        this.ApplyPerspective();
    };
    /**
     * Apply the perspective on all HTMLElements
     */
    Perspective.prototype.ApplyPerspective = function () {
        var _this = this;
        if (!this.Settings.Enabled) {
            return;
        }
        this.Variables.Objects.forEach(function (element) {
            _this._ApplyPerspective(element);
        });
    };
    /**
     * Method that is called for each object to apply the perspective effect ( the magic is here )
     *
     * @private
     * @param {HTMLElement} element
     * @memberof Perspective
     */
    Perspective.prototype._ApplyPerspective = function (element) {
        // get center of element
        var cursorX, cursorY = 0;
        if (this.Settings.StaticTiltEnabled) {
            cursorX = (window.innerWidth) * 0.5 + ((window.innerWidth * 0.5) * (this.Settings.StaticTiltX / 100));
            cursorY = (window.innerHeight) * 0.5 + ((window.innerHeight * 0.5) * (this.Settings.StaticTiltY / 100));
        }
        else {
            cursorX = this.Variables.CursorX;
            cursorY = this.Variables.CursorY;
        }
        var width = element.offsetWidth;
        var height = element.offsetHeight;
        var centerX = element.offsetLeft + width / 2;
        var centerY = element.offsetTop + height / 2;
        var perspX = 0, perspY = 0;
        if (cursorX < centerX) {
            perspX = -1 * (1 - cursorX / centerX);
        }
        else {
            perspX = 1 * ((cursorX - centerX) / (window.innerWidth - centerX));
        }
        if (cursorY < centerY) {
            perspY = -1 * (1 - cursorY / centerY);
        }
        else {
            perspY = 1 * ((cursorY - centerY) / (window.innerHeight - centerY));
        }
        var strength = 1;
        var absY = Math.abs(perspY);
        var absX = Math.abs(perspX);
        if (absX > absY) {
            strength = (absX + absY * absY) / 2;
        }
        else {
            strength = (absY + absX * absX) / 2;
        }
        strength *= this.Settings.PerspectiveStrength;
        var rotate3d = /(rotate3d\(.+?\))/g;
        var matches = element.style.transform.match(rotate3d);
        if (matches && matches.length != -1) {
            element.style.transform = element.style.transform.replace(rotate3d, "");
        }
        element.style.transform += " rotate3d(" + -perspY + "," + perspX + "," + 0 + "," + strength + "deg)";
        var skewY = /(skewY\(.+?\))/g;
        var matches = element.style.transform.match(skewY);
        if (matches && matches.length != -1) {
            element.style.transform = element.style.transform.replace(skewY, "");
        }
        element.style.transform += " skewY(" + this.Settings.StaticShiftY + "deg)";
        var skewX = /(skewX\(.+?\))/g;
        var matches = element.style.transform.match(skewX);
        if (matches && matches.length != -1) {
            element.style.transform = element.style.transform.replace(skewX, "");
        }
        element.style.transform += " skewX(" + this.Settings.StaticShiftX + "deg)";
    };
    /**
     * Set the strength of the perspective effect ( defaults to 1000 ). The lower the value, the closer the 'camera' is to the object.
     * Thus, the lower the value, the stronger the perspective effect is.
     *
     * @param {number} pixels
     * @memberof Perspective
     */
    Perspective.prototype.SetPerspectiveDistance = function (pixels) {
        pixels = pixels;
        this.Settings.PerspectiveDistance = pixels;
        this.Variables.Objects.forEach(function (element) {
            var parent = element.parentElement;
            parent.style.perspective = pixels + "px"; // TODO:: make strength setting
        });
    };
    /**
     * Set the maximum amount of degrees to turn the object
     *
     * @param {number} degrees
     * @memberof Perspective
     */
    Perspective.prototype.SetPerspectiveStrength = function (degrees) {
        degrees = degrees;
        this.Settings.PerspectiveStrength = degrees;
        this.ApplyPerspective();
    };
    /**
     * Enable perspective or disable the effect (temporarely - else use Remove)
     *
     * @param {boolean} enabled
     * @memberof Perspective
     */
    Perspective.prototype.Enable = function (enabled) {
        this.Settings.Enabled = enabled;
        if (!enabled) {
            this.Variables.Objects.forEach(function (element) {
                var rotate3d = /(rotate3d\(.*\))/g;
                var matches = element.style.transform.match(rotate3d);
                if (matches && matches.length != -1) {
                    element.style.transform = element.style.transform.replace(rotate3d, "");
                }
            });
        }
    };
    /**
     * Removes the current instance
     *
     * @memberof Perspective
     */
    Perspective.prototype.Remove = function () {
        document.removeEventListener("mousemove", this.Variables.OnMouseMove);
        this.Variables.Objects = null;
        this.Variables.OnMouseMove = null;
    };
    return Perspective;
}());
