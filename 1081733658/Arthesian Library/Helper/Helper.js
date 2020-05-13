/**
 * Arthesian's helper module
 *
 * @returns {ArrayHelper} Helper instance
 */
var ARTHESIAN = ARTHESIAN || {};
ARTHESIAN.Helper = (function () {
    // Scope object
    var _ = {};

    /**
     * Simple test to detect whether localStorage is enabled
     *
     * @returns {boolean} Whether localStorage is enabled or not
     */
    _.isLocalStorageEnabled = function () {
        try {
            var test = localStorage.length;
        } catch (err) {
            return false;
        }

        return true;
    };

    /**
     * Simple method to check if an url returns an Success (200) status code
     *
     * @param {any} path Path to check ( file:/// or http(s):// )
     * @returns {Promise} which will return a boolean whether the url gave a success or not
     */
    _.imagePathExists = function (path) {
        return new Promise((resolve, reject) => {
            var request = new XMLHttpRequest();
            request.open("HEAD", path, true);
            request.onreadystatechange = function () {
                if (request.status === 200) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            };
            request.send();
        });
    };

    /**
     * Check if a certain function or object is loaded in the framework
     *
     * @param {Array} ModuleParts The array based level of the function/object ( ex. ['ARTHESIAN', 'Helper', 'checkDependency'] => 'function' )
     * @returns {boolean} Whether the function/object exists or not
     */
    _.checkDependency = function (ModuleParts) {
        // Safe loop to check if name exists
        const idx = (parts, object) => {
            return parts.reduce((sub, property) => {
                if(sub && sub[property]) { 
                    return sub[property];
                } else {
                    return null;
                }
            }
            ,
            object
            );
        };

        // Get the result ( null || object || string || function )
        var result = idx(ModuleParts, window);

        // Merge the name for display purposes
        var ModuleName = ModuleParts.join(".");

        // If there is a result, check if it's an function/object -- else log error
        if (result) {
            if (typeof result === "function") {
                log(`The dependency '${ModuleName}' was found as a function`, "log");
                return true;
            } else if (typeof result === "object") {
                log(`The dependency '${ModuleName}' was found as an object`, "log");
                return true;
            } else {
                log(`The dependency '${ModuleName}' was neither a loaded object nor function! Please check if the module was correctly loaded.`, "warn");
            }
        } else {
            log(`The dependency '${ModuleName}' was not defined. Some functionality may not work!`, "error");
        }

        // Return default false
        return false;
    };

    /**
     * Make HTML Element draggable
     * code from W3Schools
     * src: https://www.w3schools.com/howto/howto_js_draggable.asp
     *
     * @param {HTMLElement} element
     */
    _.makeElementDraggable = function(element, dragHandle) {
        var previousMouseX = 0;
        var previousMouseY = 0;

        if(dragHandle) {
            dragHandle.onmousedown = dragMouseDown;
        } else {
            element.onmousedown = dragMouseDown;
        }
      
        function dragMouseDown(e) {
          e = e || window.event;
          e.preventDefault();
          // get the mouse cursor position at startup:
          previousMouseX = e.clientX;
          previousMouseY = e.clientY;
          document.onmouseup = closeDragElement;
          // call a function whenever the cursor moves:
          document.onmousemove = elementDrag;
        }
      
        function elementDrag(e) {
          e = e || window.event;
          e.preventDefault();
          // calculate the new cursor position:
          let movementX = previousMouseX - e.clientX;
          let movementY = previousMouseY - e.clientY;
          previousMouseX = e.clientX;
          previousMouseY = e.clientY;
          // set the element's new position:
          element.style.top = (element.style.top.substr(0, element.style.top.length - 2) - movementY) + "px";
          element.style.left = (element.style.left.substr(0, element.style.left.length - 2) - movementX) + "px";
        }
      
        function closeDragElement() {
          // stop moving when mouse button is released:
          document.onmouseup = null;
          document.onmousemove = null;
        }
      }


      var rotation;
        var radians;
        var length;
        var createBlobX;
        var createBlobY;
        var rdata;
        var deg;
        var loop_index;
        var limited_length;
        _.drawBlob = function(shape, data, strength, minLength, heightLimit) {
            rdata = [];

            deg = 360 / (data.length || 1);

            for (loop_index = 0; loop_index < data.length; loop_index++) {

                rotation = deg * 0.5 + (loop_index * deg);
                radians = Math.PI / 180 * rotation;
                limited_length = (data[loop_index] * strength);

                if(heightLimit && limited_length > heightLimit) {
                    limited_length = heightLimit;
                }

                length = limited_length + minLength;

                createBlobX = length * Math.cos(radians);
                createBlobY = length * Math.sin(radians);

                rdata.push({ x: createBlobX, y: createBlobY });
            }
            
            _.drawPoints(shape, rdata);

            return shape;
        }

        var drawxc = 0;
        var drawyc = 0;
        _.drawPoints = function(s, points) {   
            for (i = 0; i < points.length; i++) {
                
                if(i == 0) {
                    drawxc = (points[0].x + points[1].x) / 2;
                    drawyc = (points[0].y + points[1].y) / 2;
                    s.graphics.moveTo(drawxc, drawyc);
                } else if(i == points.length - 1) {
                    drawxc = (points[0].x + points[points.length - 1].x) / 2;
                    drawyc = (points[0].y + points[points.length - 1].y) / 2;

                    s.graphics.quadraticCurveTo(points[points.length -1].x, points[points.length -1].y, drawxc, drawyc);

                    drawxc = (points[0].x + points[1].x) / 2;
                    drawyc = (points[0].y + points[1].y) / 2;
                    s.graphics.quadraticCurveTo(points[0].x, points[0].y, drawxc, drawyc);
                    
                } else {
                    drawxc = (points[i].x + points[i + 1].x) / 2;
                    drawyc = (points[i].y + points[i + 1].y) / 2;
                    s.graphics.quadraticCurveTo(points[i].x, points[i].y, drawxc, drawyc);
                }
            }
        }

    /**
     * @private
     *
     * Private log function, that tries to log using the ARTHESIAN Log module, or through console
     *
     * @param {string} string Message to log
     * @param {string} level Log level (use : 'log', 'warn', 'error')
     */
    var log = function (string, level) {
        if (console && typeof console[level] === "function") {
            console[level](string);
        } else if (typeof console[level] === "function") {
            console[level](string);
        } else {
            console.error(string);
            console.error(`The Helper module could not successfully log with the selected level: '${level}' to the console nor Console!`);
        }
    };

    // return the scope
    return _;
})();