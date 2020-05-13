var chroma = window.chroma;
var TweenMax = window.TweenMax;

// General variables
var running = false;
var turnSpeed = 0.1;
var rainbowRotation = 0;
var audioArray = [];
var totalPeak = {value: 0};
var leftPeak = {value: 0};
var rightPeak = {value: 0};
var audioScale = chroma.scale([
    chroma('white'),
    chroma('black')]
);
var logo = document.getElementById('logo');
var ring1 = document.getElementById('ring1');
var ring2 = document.getElementById('ring2');
var ring3 = document.getElementById('ring3');

var colorStops = [
    {stopPercent: 0.1428571428571429, color: '#ff0000'},
    {stopPercent: 0.2857142857142857, color: '#ffea00'},
    {stopPercent: 0.4285714285714286, color: '#6fff00'},
    {stopPercent: 0.5714285714285715, color: '#00fbff'},
    {stopPercent: 0.7142857142857144, color: '#0001ff'},
    {stopPercent: 0.8571428571428573, color: '#ff00f5'},
    {stopPercent: 1, color: '#ff0000'}
];

// CUE variables
var cue = null;
var cueKeyboardIndex = null;
var cueMouseMatIndex = null;
var cueNodeIndices = null;
var cueOtherIndices = null;

// Settings
var fps = 60;
var backgroundColor = chroma('white');
var barColor = chroma('black');
var bottomColor = chroma('#8c8c8c');
var useRainbow = false;
var cycleRainbow = false;
var barHeight = 250;
var barSpacing = 6;
var sensitivity = 1.0;
var peakSensitivity = 1.0;
var bottomHeight = 150;
var calculationType = 'max';

// Get the canvas
var canvas = document.getElementById('renderCanvas');
var keyboardCanvas = document.getElementById('keyboardCanvas');
var mousematCanvas = document.getElementById('mousematCanvas');
var nodeCanvas = document.getElementById('nodeCanvas');
var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

// window.devicePixelRatio doesn't seem reliable in CEF
var scale = window.devicePixelRatio;
if (scale === 1) {
    // 1080p
    if (h === 1080) {
        scale = 1;
    }
    // 1440p
    else if (h === 1440) {
        scale = 1.25;
    }
    // 4k
    else if (h >= 2160) {
        scale = 1.5;
    }
    canvas.width = w;
    canvas.height = h;
} else {
    canvas.width = w * scale;
    canvas.height = h * scale;
}

// Robot div
var robot = document.getElementById('robot');

function start() {
    if (running) {
        return;
    }

    renderLoop = setInterval(onTimerTick, 1000 / fps);
    running = true;
}

function stop() {
    if (!running) {
        return;
    }

    clearInterval(renderLoop);
    running = false;
}

function onTimerTick() {
    var context = canvas.getContext('2d');
    // context.scale(scale, scale);
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = backgroundColor.hex();
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Debug info in the top left, can be useful
    // context.fillStyle = 'white';
    // context.font = '30px Arial';
    // context.fillText(totalPeak.value.toString(), 50, 50);

    if (useRainbow) {
        context.fillStyle = getRainbowGradient(canvas, context);
    } else {
        context.fillStyle = barColor.hex();
    }

    var scaledBottomHeight = bottomHeight * scale;
    // Render bars along the full width of the canvas with 5 pixels of space between them
    var barWidth = Math.round(1 / 64 * canvas.width);
    for (var i = 0; i < 64; i++) {
        var x = ((barWidth) * i) + (barSpacing / 2);
        var y = canvas.height - scaledBottomHeight;
        if (audioArray[i]) {
            var height = barHeight * scale * audioArray[i].value;
            context.fillRect(x, y - height, barWidth - barSpacing, height);
        }
    }

    // Render the bottom
    context.fillStyle = bottomColor.hex();
    context.fillRect(0, canvas.height - scaledBottomHeight, canvas.width, scaledBottomHeight);

    if (cycleRainbow) {
        if (rainbowRotation > 360) {
            rainbowRotation = 0;
        }
        rainbowRotation = rainbowRotation + (turnSpeed * 30 / fps);
    }

    // If CUE not detected the update is done here
    if (cue === null) {
        return;
    }

    // Update CUE devices
    // Render all bars to the keyboard just like on the wallpaper
    var imageData = null;
    if (cueKeyboardIndex !== null) {
        // Take samples of the audio data
        var sampleSize = Math.round(audioArray.length / keyboardCanvas.width);
        var samplesLeft = audioArray.length;
        var count = 0;

        var keyboardContext = keyboardCanvas.getContext('2d');
        keyboardContext.clearRect(0, 0, keyboardCanvas.width, keyboardCanvas.height);
        keyboardContext.fillStyle = backgroundColor.hex();
        keyboardContext.fillRect(0, 0, keyboardCanvas.width, keyboardCanvas.height);
        if (useRainbow) {
            keyboardContext.fillStyle = getRainbowGradient(keyboardCanvas, keyboardContext);
        } else {
            keyboardContext.fillStyle = barColor.hex();
        }

        while (samplesLeft > 0) {
            var sampleSum = 0;
            for (var s = 0; s < Math.min(sampleSize, samplesLeft); ++s) {
                sampleSum = sampleSum + audioArray[s + (count * sampleSize)].value;
            }
            var sampleRes = sampleSum / Math.min(sampleSize, samplesLeft);
            var keyboardBarHeight = keyboardCanvas.height * sampleRes;
            keyboardContext.fillRect(count, keyboardCanvas.height - keyboardBarHeight, 1, keyboardBarHeight);
            samplesLeft = samplesLeft - sampleSize;
            count++;
        }
        // Map the image data to keyboard
        imageData = getEncodedCanvasImageData(keyboardCanvas);
        cue.setLedColorsByImageData(cueKeyboardIndex, imageData, keyboardCanvas.width, keyboardCanvas.height);
    }
    // Render two side bars for mousemats, for left and right channel
    if (cueMouseMatIndex !== null) {
        var mousematContext = mousematCanvas.getContext('2d');
        mousematContext.clearRect(0, 0, mousematCanvas.width, mousematCanvas.height);
        mousematContext.fillStyle = backgroundColor.hex();
        mousematContext.fillRect(0, 0, mousematCanvas.width, mousematCanvas.height);
        if (useRainbow) {
            mousematContext.fillStyle = getRainbowGradient(mousematCanvas, mousematContext);
        } else {
            mousematContext.fillStyle = barColor.hex();
        }

        var leftBarHeight = mousematCanvas.height * leftPeak.value;
        var rightBarHeight = mousematCanvas.height * rightPeak.value;
        mousematContext.fillRect(0, mousematCanvas.height - leftBarHeight, mousematCanvas.width / 2, leftBarHeight);
        mousematContext.fillRect(mousematCanvas.width / 2, mousematCanvas.height - rightBarHeight, mousematCanvas.width / 2, rightBarHeight);
        imageData = getEncodedCanvasImageData(mousematCanvas);
        cue.setLedColorsByImageData(cueMouseMatIndex, imageData, mousematCanvas.width, mousematCanvas.height);
    }
    if (cueNodeIndices !== null && cueNodeIndices.length) {
        var nodeContext = nodeCanvas.getContext('2d');
        nodeContext.clearRect(0, 0, nodeCanvas.width, nodeCanvas.height);
        nodeContext.fillStyle = backgroundColor.hex();
        nodeContext.fillRect(0, 0, nodeCanvas.width, nodeCanvas.height);
        if (useRainbow) {
            nodeContext.fillStyle = getRainbowGradient(nodeCanvas, nodeContext);
        } else {
            nodeContext.fillStyle = barColor.hex();
        }

        nodeContext.fillRect(0, 0, nodeCanvas.width * totalPeak.value, 2);
        imageData = getEncodedCanvasImageData(nodeCanvas);

        cueNodeIndices.forEach(function (index) {
            cue.setLedColorsByImageData(index, imageData, nodeCanvas.width, nodeCanvas.height);
        });
    }
    // Assign the color scaled to the peak to all other LEDs
    cueOtherIndices.forEach(function (index) {
        var peakColor;
        if (useRainbow) {
            peakColor = chroma((totalPeak.value * 60) + (index * 45) + rainbowRotation, 1, 0.5, 'hsl').rgb();
        } else {
            peakColor = audioScale(totalPeak.value).rgb();
        }
        var corsairColor = {r: peakColor[0], g: peakColor[1], b: peakColor[2]};
        window.cue.setAllLedsColorsAsync(index, corsairColor);
    });
}

start();

function getRainbowGradient(canvas, context) {
    var gradient = context.createLinearGradient((canvas.width * 0.2) * -1, 0, canvas.width * 1.4, canvas.height);

    for (var i = 0; i < colorStops.length; i++) {
        var tempColorStop = colorStops[i];
        var tempColor = tempColorStop.color;
        var tempStopPercent = tempColorStop.stopPercent;
        gradient.addColorStop(tempStopPercent, tempColor);
        if (cycleRainbow) {
            tempStopPercent += (0.0001 * fps / 60);
            if (tempStopPercent > 1) {
                tempStopPercent = 0;
            }
            tempColorStop.stopPercent = tempStopPercent;
        }
        colorStops[i] = tempColorStop;
    }
    return gradient;
}

function getEncodedCanvasImageData(canvas) {
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

function wallpaperAudioListener(audioData) {
    var newTotalPeak = 0;
    var newLeftPeak = 0;
    var newRightPeak = 0;
    var audioDataAverage = [];

    var halfWayThough = Math.floor(audioData.length / 2);

    var left = audioData.slice(0, halfWayThough);
    var right = audioData.slice(halfWayThough, audioData.length);

    // Calculate according to calculation type, default to max
    if (calculationType === 'median') {
        newTotalPeak = math.median(audioData);
        newLeftPeak = math.median(left);
        newRightPeak = math.median(right);
    } else if (calculationType === 'mean') {
        newTotalPeak = math.mean(audioData);
        newLeftPeak = math.mean(left);
        newRightPeak = math.mean(right);
    } else if (calculationType === 'average') {
        newTotalPeak = math.sum(audioData) / audioData.length;
        newLeftPeak = math.sum(left) / left.length;
        newRightPeak = math.sum(right) / right.length;
    } else {
        newTotalPeak = math.max(audioData);
        newLeftPeak = math.max(left);
        newRightPeak = math.max(right);
    }

    for (var i = 0; i < audioData.length; ++i) {
        // Average out two values
        if (i % 2) {
            audioDataAverage.push((audioData[i - 1] + audioData[i]) / 2 * sensitivity)
        }
    }

    // Assign the new audio peak
    TweenMax.to(totalPeak, 0.2, {value: newTotalPeak * peakSensitivity});
    TweenMax.to(leftPeak, 0.2, {value: newLeftPeak * sensitivity});
    TweenMax.to(rightPeak, 0.2, {value: newRightPeak * sensitivity});

    // Transform the old data into the new
    for (var j = 0; j < audioDataAverage.length; ++j) {
        // If this is a fresh set of data, apply it
        if (!audioArray[j]) {
            audioArray.push({value: audioDataAverage[j]});
        }
        // If updating, tween between old and new
        else {
            TweenMax.to(audioArray[j], 0.2, {value: audioDataAverage[j]});
        }
    }
}

window.wallpaperPropertyListener = {
    applyGeneralProperties: function (properties) {
        if (properties.fps) {
            // Restart the render loop at the new FPS if it is changed
            if (fps !== properties.fps) {
                fps = properties.fps;
                stop();
                start();
            }
        }
    },
    applyUserProperties: function (properties) {
        if (properties.schemecolor) {
            var barColors = properties.schemecolor.value.split(' ');
            barColor = chroma(barColors[0], barColors[1], barColors[2], 'gl');
        }
        if (properties.logocolor) {
            var logoColors = properties.logocolor.value.split(' ');
            var logoColor = chroma(logoColors[0], logoColors[1], logoColors[2], 'gl');

            logo.style.backgroundColor = logoColor.css();
            ring1.style.backgroundColor = logoColor.css();
            ring2.style.backgroundColor = logoColor.css();
            ring3.style.backgroundColor = logoColor.css();
        }
        if (properties.logorings) {
            if (properties.logorings.value === true) {
                logo.style.width = '38%';
                logo.style.height = '38%';
                ring1.style.display = 'block';
                ring2.style.display = 'block';
                ring3.style.display = 'block';
            } else {
                logo.style.width = '60%';
                logo.style.height = '60%';
                ring1.style.display = 'none';
                ring2.style.display = 'none';
                ring3.style.display = 'none';
            }
        }
        if (properties.backgroundcolor) {
            var bgColors = properties.backgroundcolor.value.split(' ');
            backgroundColor = chroma(bgColors[0], bgColors[1], bgColors[2], 'gl');
        }
        if (properties.showbottom) {
            bottomHeight = properties.showbottom.value;
        }
        if (properties.bottomcolor) {
            var bottomColors = properties.bottomcolor.value.split(' ');
            bottomColor = chroma(bottomColors[0], bottomColors[1], bottomColors[2], 'gl');
        }
        if (properties.rainbowscheme) {
            useRainbow = properties.rainbowscheme.value;
        }
        if (properties.cyclerainbow) {
            cycleRainbow = properties.cyclerainbow.value;
        }
        if (properties.colorized) {
            if (properties.colorized.value === true) {
                robot.style.backgroundImage = 'url(images/bot_color.png)';
            } else {
                robot.style.backgroundImage = 'url(images/bot_bw.png)';
            }
        }
        if (properties.sensitivity) {
            sensitivity = properties.sensitivity.value;
        }
        if (properties.peaksensitivity) {
            peakSensitivity = properties.peaksensitivity.value;
        }
        if (properties.calculationtype) {
            calculationType = properties.calculationtype.value;
        }
    },
    setPaused: function (isPaused) {
        if (isPaused) {
            stop();
        }
        else {
            start();
        }
    }
};


window.wallpaperRegisterAudioListener(wallpaperAudioListener);

window.wallpaperPluginListener = {
    onPluginLoaded: function (name, version) {
        if (name === 'cue') {
            cueOtherIndices = [];
            cueNodeIndices = [];
            var onDeviceInfoReceived = function (deviceIndex, deviceInfo) {
                if (deviceInfo.type === 'CDT_Keyboard') {
                    // Create a canvas that matches the keyboard's physical key columns and rows
                    switch (deviceInfo.model) {
                        case 'K95 RGB':
                            keyboardCanvas.height = 7;
                            keyboardCanvas.width = 25;
                            break;
                        case 'K95 RGB PLATINUM':
                            keyboardCanvas.height = 9;
                            keyboardCanvas.width = 22;
                            break;
                        case 'K70 RGB':
                        case 'K70 RGB RAPIDFIRE':
                        case 'K70 LUX RGB':
                            keyboardCanvas.height = 7;
                            keyboardCanvas.width = 21;
                            break;
                        case 'K65 RGB':
                        case 'CGK65 RGB':
                        case 'K65 LUX RGB':
                        case 'K65 RGB RAPIDFIRE':
                            keyboardCanvas.height = 7;
                            keyboardCanvas.width = 18;
                            break;
                        case 'STRAFE RGB':
                            keyboardCanvas.height = 8;
                            keyboardCanvas.width = 22;
                            break;
                        // Default to the K70 since that's a standard keyboard
                        default:
                            keyboardCanvas.height = 7;
                            keyboardCanvas.width = 21;
                            break;
                    }
                    cueKeyboardIndex = deviceIndex;
                } else if (deviceInfo.type === 'CDT_MouseMat') {
                    mousematCanvas.height = 10;
                    mousematCanvas.width = 10;
                    cueMouseMatIndex = deviceIndex;
                } else if (deviceInfo.type === 'CDT_LightingNodePro' || deviceInfo.type === 'CDT_CommanderPro') {
                    nodeCanvas.height = 2;
                    nodeCanvas.width = 25;
                    cueNodeIndices.push(deviceIndex);
                }
                else {
                    cueOtherIndices.push(deviceIndex);
                }
                console.log(deviceInfo.type);
            };

            window.cue.getDeviceCount(function (deviceCount) {
                for (var d = 0; d < deviceCount; ++d) {
                    (function (d) {
                        window.cue.getDeviceInfo(d, function (deviceInfo) {
                            onDeviceInfoReceived(d, deviceInfo);
                        });
                    }(d));
                }
            });

            cue = window.cue;
        }
    }
};
