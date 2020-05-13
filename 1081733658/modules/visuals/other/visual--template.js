;(function( $, createjs, document, undefined ) {
 
    $.fn.visual = function(settings) {
 
        // Declare a scope for Visualizer
        var scope = {};

        // Bind 'this'
        var _this = this;

        // Private variables for within the plugin only ( no user/ code interaction )
        _this.variables = {
            gameobject : null,
            analyser : null,
        }

        // The default values ( which can be overriden by supplied settings )
        var _DEFAULTS = {
            precision : 128,                                                        // Number of 'samples' taken from the song each frame ( lower this if you have issues with performance )
            mirror : false ,                                                        // Mirror all frequency data ( so left is equal to right visually )
            type : "line",                                                          // "line" or "spline" allowed ( default : line )
            fade : false,                                                           // when fade set to 'true', the line will 'ghost'
            fadeDuration : 1000,                                                    // number in miliseconds         
            rotate : false,                                                         // when rotate set to 'true', the line will rotate steadily ( clockwise )
            rotateSpeed : 30000,                                                    // number in miliseconds for full rotation ( default : 30 seconds )
            colours : [                                                             // Array of HEX, RGB, RGBA or css color name codes
                "red", 
                "orange", 
                "#FFF", 
                "#00ffff", 
                "rgb(0,0,255)", 
                "rgba(0,255,0,1)", 
                "rgba(255,0,255,0.5)"
            ],     
            blurAmount : 3,                                                         // Lower this value if you have performance issues ( a higer blur is very performance heavy )
        }

        scope.settings = $.extend(_DEFAULTS, settings);

        _this.init = function(){

            if(!createjs) { console.error("This visual requires CreateJS to operate!");}

            _this.bind();
        }

        _this.bind = function(){

        }

        _this.update = function(analyzer){

        }

        _this.init();

        return scope;
    };
 
}( jQuery, createjs, document ));