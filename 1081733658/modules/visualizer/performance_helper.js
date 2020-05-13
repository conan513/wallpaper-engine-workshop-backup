var PerformanceHelper = function () {
    
    var _ = {};

    _.enabled = false;
    _.trackedObjects = [];

    var init = function () {

        //// NEW APPROACH : CANVAS DRAW
        _.canvas = document.createElement('canvas');
        _.canvas.height = 0;
        _.canvas.width = 300;

        _.canvas.style.position = "absolute";
        _.canvas.style.right = 0;
        _.canvas.style.background = "white";

        _.ctx = _.canvas.getContext('2d');

        document.body.appendChild(_.canvas);

        // 10 times a second update
        setInterval(() => { _.draw(); }, 200);
    }

    _.addVisualizer = function (visualizer) {

        _.trackedObjects[visualizer.id] = {
            fps: 0,
            current: 0,
            target: 0,
            name: visualizer.id,
            object: visualizer
        };

        visualizer.performanceCallback = () => { _.update(visualizer); };
    }
    
    _.addTicker = function (ticker, id) {

        _.trackedObjects[id] = {
            fps: 0,
            current: 0,
            target: 0,
            name: id,
            object: ticker
        };

        ticker.addEventListener('tick', () => { _.tick(ticker, id); });
    }

    _.tick = function (ticker, id) {
        if (!_.enabled) { return;}

        var fps = ticker.getMeasuredFPS();
        var fpstarget = ticker.framerate;

        var obj = _.trackedObjects[id];

        obj.current = fps;
        obj.target = fpstarget;
    }

    _.update = function (visualizer) {

        if (!_.enabled) { return;}

        var obj = _.trackedObjects[visualizer.id];
        var now = performance.now();
        if(!obj.prevTimes) { obj.prevTimes = [now]; return; }

        obj.prevTimes = obj.prevTimes.filter((t) => t > (now - 1000));

        var td = obj.prevTimes[obj.prevTimes.length - 1] - obj.prevTimes[0];

        if(!td) { obj.prevTimes.push(now); return; }

        obj.current = (1000 / td) * obj.prevTimes.length;
        obj.target = createjs.Ticker.framerate;
        obj.resolution = visualizer.variables.resolutionText

        obj.prevTimes.push(now);
    }

    var _offset = 1;
    _.draw = function() {
        
        if(!_.enabled) {
            _.canvas.height = 0;
            return; 
        }
        
        _offset = 1;
        
        let keys = Object.keys(_.trackedObjects);
        
        // Clear
        _.canvas.height = keys.length * 25 + 20;
        
        // Write initial text
        _.ctx.fillText("Performance:", 10, 10);
        
        // Write every added module
        for (let k of keys) {

            _offset++;

            // let obj = _.trackedObjects[k];
            _.ctx.fillText(`${_.trackedObjects[k].name} @${_.trackedObjects[k].resolution} : ${_.trackedObjects[k].current.toFixed(2)} / ${_.trackedObjects[k].target.toFixed(2)} fps`, 10, _offset * 20);
        }
    }

    _.Enable = function (enabled) {
        _.enabled = enabled;
    }

    init();

    return _;
};