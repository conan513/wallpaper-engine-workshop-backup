var Ticker = function(){

    var frames = [];
    var timer;

    var _ = {
        get framerate() {
            return this.fps || 1;
        },
        set framerate(fps) {
            this.fps = fps;
            if(timer) { clearInterval(timer); }
            timer = setInterval(() => {
                tick();
            }, 1000 / this.fps);
        },
        get measuredFramerate() {
            if(frames.length < 2) { return 0; }

            var duration = frames[frames.length - 1] - frames[0];  
            return (1000 / (duration || 1000)) * frames.length;
        }
    };
    
    _.onTick;

    var init = function() {
        frames.push(new Date());
        _.framerate = 10;
    }

    var reduceFrames = function(){
        var now = new Date();
        frames = frames.filter((f) => f > (now - 1000));
    }

    var tick = function(){
        frames.push(new Date());
        reduceFrames();

        if(_.onTick) {
            _.onTick();
        }
    }

    init();

    return _;
}