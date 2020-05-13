;

var modules = (function(ns, $, document, window) {

    /**
     * Animated grid of dots and lines that will light up when the cursor hovers them.
     * Can specify color and amount of dots that should be on screen.
     * 
     * @param {any} settings 
     * @returns 
     */
    ns.animatedGrid = function(settings) {

        var scope = {};

        var _DEFAULTS = {
            color: '255,255,255',
            gridAmountX: 20,
            gridAmountY: 20,
            selector: "#canvas",
            maxActive: 0.8,
            minActive: 0,
            enabled: true,
            type: 'circle'
        }

        scope.settings = $.extend({}, _DEFAULTS, settings);

        var variables = {
            points: [],
            width: 0,
            height: 0,
            paused: false,
            canvas: null,
            context: null,
            cursorPosition: null
        }

        /**
         * Init function for the Grid
         * 
         * @returns 
         */
        var init = function() {

            //if (!TweenLite) { console.error("Could not start animatedGrid. TweenLite library was not found! It is required for animatedGrid.js..."); return; }

            variables.width = $(window).innerWidth();
            variables.height = $(window).innerHeight();

            // Main
            initGrid();
            bind();
        }

        /**
         * Start animating the grid
         * 
         */
        scope.start = function() {
            variables.paused = false;
            startAnimation();
        }

        /**
         * Pause the animation of the Grid
         * 
         * @returns 
         */
        scope.pause = function() {
            if (variables.paused) { console.log("can't pause moving grid, because grid was already paused ;)!"); return; }

            variables.paused = true;
        }

        /**
         * Resume the grid after pausing the animation
         * 
         * @returns 
         */
        scope.resume = function() {
            if (!variables.paused) { console.log("can't resume moving grid, because grid was already playing ;)!"); return; }

            scope.start();
        }

        /**
         * Enable or Disable grid
         * 
         * @param {any} enable 
         */
        scope.Enable = function (enable) {
            scope.settings.enabled = enable;
            if (enable) {
                scope.reload();
            } else {
                variables.context.clearRect(0, 0, variables.width, variables.height);
                scope.pause();
            }
        }

        /**
         * Reload the grid when changes have been made ( like number of dots )
         * 
         */
        scope.reload = function() {
            initGrid();
        }

        /**
         * Start the animation ( if not paused )
         * 
         * @returns 
         */
        var startAnimation = function() {
            for (let point of variables.points) {
                shiftPoint(point);
            }
        }

        var _diff, _lineDiff;
        /**
         * Update the grid (this method can be called from the outside)
         * 
         */
        scope.update = function () {

            if (variables.paused) { return; }

            variables.context.clearRect(0, 0, variables.width, variables.height);

            _diff = (scope.settings.maxActive - scope.settings.minActive) / 3;
            _lineDiff = _diff / 2;

            // Set the transparency based on cusor position (target)
            for (let point of variables.points) {
                // detect variables.points in range
                if (Math.abs(getDistance(variables.cursorPosition, point)) < 4000) {
                    point.active = scope.settings.minActive + (3 * _lineDiff);
                    point.circle.active = scope.settings.minActive + (3 * _diff);
                } else if (Math.abs(getDistance(variables.cursorPosition, point)) < 20000) {
                    point.active = scope.settings.minActive + (2 * _lineDiff);
                    point.circle.active = scope.settings.minActive + (2 * _diff);
                } else if (Math.abs(getDistance(variables.cursorPosition, point)) < 40000) {
                    point.active = scope.settings.minActive + (1 * _lineDiff);
                    point.circle.active = scope.settings.minActive + (1 * _diff);
                } else {
                    point.active = scope.settings.minActive;
                    point.circle.active = scope.settings.minActive;
                }

                drawLines(point);
                point.circle.draw();
            }
        }

        /**
         * Initialize the grid. Creates the points that will be moved across the screen and
         * calculate the closest neighbours for each point. Will 'start' the Grid when done
         * 
         */
        var initGrid = function() {

            variables.cursorPosition = variables.cursorPosition || { x: variables.width / 2, y: variables.height / 2 };

            variables.canvas = $(scope.settings.selector)[0];
            variables.canvas.width = variables.width;
            variables.canvas.height = variables.height;
            variables.context = variables.canvas.getContext('2d');

            // create variables.points
            variables.points = [];
            for (var x = 0; x < variables.width; x = x + variables.width / scope.settings.gridAmountX) {
                for (var y = 0; y < variables.height; y = y + variables.height / scope.settings.gridAmountY) {
                    var px = x + Math.random() * variables.width / scope.settings.gridAmountX;
                    var py = y + Math.random() * variables.height / scope.settings.gridAmountY;
                    var p = { x: px, originX: px, y: py, originY: py };
                    variables.points.push(p);
                }
            }

            // for each point find the 5 closest variables.points
            for (var i = 0; i < variables.points.length; i++) {
                var closest = [];
                var p1 = variables.points[i];
                for (var j = 0; j < variables.points.length; j++) {
                    var p2 = variables.points[j]
                    if (!(p1 == p2)) {
                        var placed = false;
                        for (var k = 0; k < 5; k++) {
                            if (!placed) {
                                if (closest[k] == undefined) {
                                    closest[k] = p2;
                                    placed = true;
                                }
                            }
                        }

                        for (var k = 0; k < 5; k++) {
                            if (!placed) {
                                if (getDistance(p1, p2) < getDistance(p1, closest[k])) {
                                    closest[k] = p2;
                                    placed = true;
                                }
                            }
                        }
                    }
                }
                p1.closest = closest;
            }

            // assign a circle to each point
            for (var i in variables.points) {
                var c = new Circle(variables.points[i], 2 + Math.random() * 2, scope.settings.type);
                variables.points[i].circle = c;
            }

            if (scope.settings.enabled) {
                scope.start();
            }
        }

        /**
         * Bind event listeners
         * 
         */
        var bind = function() {
            window.addEventListener('mousemove', mouseMove);
            window.addEventListener('resize', resize);

            document.body.addEventListener('mouseover', function () {
                if (scope.settings.enabled) {
                    scope.start();
                }
            });
            document.body.addEventListener('mouseleave', function () {
                variables.context.clearRect(0, 0, variables.width, variables.height);
                
                if (scope.settings.enabled) {
                    scope.pause();
                }
            });
        }

        /**
         * Get the distance between two points
         * 
         * @param {any} p1 
         * @param {any} p2 
         * @returns 
         */
        var getDistance = function(p1, p2) {
            return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
        }

        /**
         * Returns a function, that, as long as it continues to be invokes, will not be triggered.
         * The function will be called after it stops being called for N miliseconds.
         * If 'immediate' is passed, trigger the function instantly, not waiting for the timeout
         * 
         * @param {any} func 
         * @param {any} wait 
         * @param {any} immediate 
         * @returns 
         */
        var debounce = function(func, wait, immediate) {
            var timeout;
            return function() {
                var context = this,
                    args = arguments;
                var later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        };

        /**
         * On mouse move, capture the location of the cursor
         * 
         * @param {any} e 
         */
        var mouseMove = function(e) {
            var posx = posy = 0;
            if (e.pageX || e.pageY) {
                posx = e.pageX;
                posy = e.pageY;
            } else if (e.clientX || e.clientY) {
                posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }
            variables.cursorPosition.x = posx;
            variables.cursorPosition.y = posy;
        }

        /**
         * Resize method ( with debounce ) to capture the new width and height of the screen 
         * 
         */
        var resize = debounce(function () {
            variables.width = window.innerWidth;
            variables.height = window.innerHeight;
            variables.canvas.width = variables.width;
            variables.canvas.height = variables.height;

            // create grid anew after resize
            initGrid();
        }, 100);

        /**
         * Move target Point p to a new random location over time
         * 
         * @param {any} p 
         * @returns 
         */
        var shiftPoint = function(p) {

            if (variables.paused) { return; }

            createjs.Tween.get(p, { override : true }).to({ 
                x: p.originX - Math.random() * (variables.width / scope.settings.gridAmountX), // + (variables.width / scope.settings.gridAmountX) / 2,
                y: p.originY - Math.random() * (variables.height / scope.settings.gridAmountY) // + (variables.height / scope.settings.gridAmountY) / 2
            }, (1 + 1 * Math.random()) * 1000).call(function() { 
                shiftPoint(p); 
            });
        }

       
        /**
         * Draws lines to the closest points, relative to Point p
         * 
         * @param {any} p 
         * @returns 
         */
        var drawLines = function(p) {

            if (!p.active) return;

            for (let closestPoint of p.closest) {
                variables.context.beginPath();
                variables.context.moveTo(p.x, p.y);
                variables.context.lineTo(closestPoint.x, closestPoint.y);
                variables.context.strokeStyle = 'rgba(' + scope.settings.color + ',' + p.active + ')';
                variables.context.stroke();
            }
        }

        
        /**
         * Circle (sub)class, drawable object
         * 
         * @param {any} pos 
         * @param {any} rad 
         * @param {String} [type]
         */
        var Circle = function(pos, rad, type) {
            var _this = this;

            // constructor
            (function() {
                _this.type = type || 'circle';
                _this.pos = pos || null;
                _this.radius = rad || null;
            })();

            this.draw = function() {
                if (!_this.active) return;

                if(_this.type == 'circle') {
                    variables.context.beginPath();
                    variables.context.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
                    variables.context.fillStyle = 'rgba(' + scope.settings.color + ',' + _this.active + ')';
                    variables.context.fill();
                } else if (_this.type == 'square') {
                    variables.context.beginPath();
                    variables.context.fillStyle = 'rgba(' + scope.settings.color + ',' + _this.active + ')';
                    variables.context.fillRect(_this.pos.x - _this.radius, _this.pos.y - _this.radius, _this.radius * 2, _this.radius * 2);
                }
            };
        }

        init();

        return scope;
    }

    return ns;

})(modules || {}, jQuery, document, window);