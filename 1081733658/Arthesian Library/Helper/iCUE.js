/**
 * Arthesian's iCUE helper module
 * 
 * @returns {iCUEHelper} Helper instance for iCUEs
 */
var ARTHESIAN = ARTHESIAN || {};
ARTHESIAN.Helper = ARTHESIAN.Helper || {}
ARTHESIAN.Helper.iCUE = (function () {

    var _enabled = false;

    var _hueRotationEnabled = false;
    var _hueRotationDuration = 10000;

    var devices = [];

    // Scope object
    var _ = {
        set enabled(val) {
            _enabled = val;

            if(_enabled && !window.cue) {
                console.log(`iCUE was not loaded as a module, can't enable iCUE!`);

            } else if(!devices.length) {

                console.log(`No iCUE enabled devices where found...`);

            } else {
                console.log(`iCUE helper has been set to 'Enabled' ${_enabled}`);

                startUpdateLoop();
            }
        },
        get enabled() { return _enabled; },

        set hueRotationEnabled(val) { 
            _hueRotationEnabled = val;
            _.startHueRotationTween(val);
        },
        get hueRotationEnabled() { return _hueRotationEnabled; },

        set hueRotationDuration(val) {
            _hueRotationDuration = val;
            _.startHueRotationTween(_hueRotationEnabled);
        },
        get hueRotationDuration() { return _hueRotationDuration; }
    }

    _.settings = {

        hsl: ARTHESIAN.Helper.Colour.rgbToHsl(200, 0, 0),
        brightnessDecrease: 0
    }

    _.init = async function() {
        
        await loadDevices();

        startUpdateLoop();
    }

    var loadDevices = async function() {

        let deviceCount = await getDeviceCount();

        for(let x = 0; x < deviceCount; x++) {

            let device = await loadDevice(x);
            device.index = x;
            
            devices.push(device);
        }

        devices = devices.filter(x => x.ledCount > 0);
    }

    var getDeviceCount = function() {
        return new Promise((resolve) => {
            window.cue.getDeviceCount((count) => {
                resolve(count);
            });
        });
    }

    var loadDevice = function(index) {
        return new Promise((resolve) => {
            window.cue.getDeviceInfo(index, (info) => {
                resolve(info);
            });
        });
    }

    var _updateInterval = null;
    var startUpdateLoop = function() {

        stopUpdateLoop();

        if(!_enabled) { return; }

        _updateInterval = setInterval(() => {

            //_.setLightsToCanvasData(WALLPAPER.visualizer.canvas);
            _.setLightsToColor();

        }, 1000 / 60);
    }

    var stopUpdateLoop = function() {
        if(_updateInterval) { clearInterval(_updateInterval); }
    }

    var hueRotation = { offset: 0 };
    /**
     * Enable or disable rotation tween for Hue offset.
     * 
     * @param {any} enabled 
     */
    _.startHueRotationTween = function(enabled) {
        if (enabled) {
            hueRotation.offset %= 360;
            createjs.Tween.get(hueRotation, { override: true, loop: true }).to({ offset: hueRotation.offset + 360 }, _.hueRotationDuration);
        } else {
            createjs.Tween.get(hueRotation, { override: true }).set({ offset: 0 });
        }
    }

    var getEncodedCanvasImageData = function(canvas) {
        var context = canvas.getContext('2d');
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

        var colorArray = [];
    
        for (var d = 0; d < imageData.data.length; d += 4) {
            var write = d / 4 * 3;
            colorArray[write] = imageData.data[d];
            colorArray[write + 1] = imageData.data[d + 1];
            colorArray[write + 2] = imageData.data[d + 2];
        }
        return String.fromCharCode.apply(null, colorArray);
    }

    _.setLightsToColor = function() {

        let bm = ARTHESIAN.Audio.Source.getBaseMultiplier(0, 6);

        bm -= 0.1;

        if(bm > 0) {

            let tmpColor = _.settings.hsl;
            
            let h = tmpColor[0] + hueRotation.offset;
            h %= 360;

            let s = tmpColor[1]
            let l = tmpColor[2] * bm;
            
            if(_.settings.brightnessDecrease) {
                //s -= _.settings.brightnessDecrease + (_.settings.brightnessDecrease / 2) * bm;
                l -= _.settings.brightnessDecrease
            }

            let rgb = ARTHESIAN.Helper.Colour.hslToRgb(h, s, l);
    
            if(window.cue) {

                devices.forEach(device => {
                    window.cue.setAllLedsColorsAsync(device.index, {r: rgb[0], g: rgb[1], b: rgb[2] });
                })

            }
        }
    }

    _.setLightsToCanvasData = function(canvas) {

        // get context from main canvas
        var context = canvas.getContext('2d');

        // create tmp canvas element
        var tmpCanvas = document.createElement('canvas');
        var tmpCtx = tmpCanvas.getContext('2d');

        // size of tmp canvas
        let width = 100;
        let height = 20;

        // calculate scale for x/y to get 100x20 res image
        let scalex = width / canvas.width;
        let scaley = height / canvas.height;

        // set width and height of tmp canvas
        tmpCanvas.width = width;
        tmpCanvas.height = height;

        // Scale before drawing to draw at correct size
        tmpCtx.scale(scalex, scaley);

        // draw on temp to get the image data
        tmpCtx.drawImage(canvas, 0, 0);

        // Draw back on main for test
        context.drawImage(tmpCanvas, 0, 0);

        // get encoded data
        var encodedImageData = getEncodedCanvasImageData(tmpCanvas);

        // Set all led colors???
        if(window.cue) {
            window.cue.setLedColorsByImageData(0, encodedImageData, tmpCanvas.width, tmpCanvas.height);
        }
    }
   
    // return the scope
    return _;

})();