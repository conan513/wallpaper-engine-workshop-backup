/**
 * Arthesian's helper module
 * 
 * @returns {ArrayHelper} Helper instance
 */
var ARTHESIAN = ARTHESIAN || {};
ARTHESIAN.Helper = ARTHESIAN.Helper || {};
ARTHESIAN.Helper.Logger = (function () {

    // Scope object
    var _ = {}

    var log = [];

    var init = function() {
        createLogWindowStyle();
        createLogWindow();
    }

    var baseLogFunction = console.log;
    console.log = function(){
        baseLogFunction.apply(console, arguments);

        var args = Array.prototype.slice.call(arguments);
        for(var i=0;i<args.length;i++){
            createLogNode(args[i], 'log');
        }

        renderLog();
    }

    function createLogNode(message, level){
        var node = document.createElement("div");

        let time = new Date();
        var timeString = toDigitString(time.getHours(), 2) + ':' + toDigitString(time.getMinutes(), 2) + "." + toDigitString(time.getSeconds(), 2);

        var textNode = document.createTextNode(timeString + ' - ' + level + ' - ' + message);
        node.appendChild(textNode);

        log.push(node);

        trimLog();
    }

    function renderLog() {
        let logs = logWindowContent || document.querySelector(".logWindow-content");

        if(logs) { 

            logs.innerHTML = '';

            for(let entry of log) {
                logs.prepend(entry);
            }
        }
    }

    window.onerror = function(message, url, linenumber) {
        

        // console.log("JavaScript error: " + message + " on line " +
        //     linenumber + " for " + url);

        createLogNode("JavaScript error: " + message + " on line " + linenumber + " for " + url, 'error');
    }

    var trimLog = function() {
        while(log.length > 100) {
            log.shift();
        }
    }

    var toDigitString = function(number, length) {
        
        var numberString = "" + number;
        
        while(numberString.length < length) {
            numberString = "0" + numberString;
        }

        return numberString;
    }

    var logWindowObject;
    var logWindowContent;
    var createLogWindow = function(){
        var logWindow = $('<div />').addClass('logWindow');

        var header = $('<div />').addClass('logWindow-header');
        
        var title = $('<span>').addClass('logWindow-title');
        title.append("Log");

        var closeButton = $('<span>').addClass('logWindow-close');
        closeButton.html('X');

        $(header).append(title);
        //$(header).append(closeButton);

        var body = $('<div />').addClass('logWindow-body');
        var content = $('<div />').addClass('logWindow-content');

        $(body).append(content);
        
        $(logWindow).append(header);
        $(logWindow).append(body);
        
        logWindowObject = logWindow;
        logWindowContent = content;

        //$(logWindowObject).draggable();
        
        $(document).ready(() => {
            $(document.body).append(logWindowObject);

            ARTHESIAN.Helper.makeElementDraggable(logWindowObject[0], header[0]);

            _.showLogWindow(false);
        }); 
    }

    var styleSheet;
    var createLogWindowStyle = function(){
        if(!styleSheet){
            createStyleSheet();
            setStyles();
        }
    }

    /**
     * Create a stylesheet in the body to append custom CSS rules to
     * @private
     *
     */
    var createStyleSheet = function() {
        // Create the <style> tag
        var style = document.createElement("style");

        // WebKit hack :(
        style.appendChild(document.createTextNode(""));

        // Add the <style> element to the page
        document.head.appendChild(style);

        styleSheet = style;
    };

    /**
     * Create logwindow styles programmatically without CSS file
     *
     */
    var setStyles = function() {

        styleSheet.sheet.addRule(".logWindow", "font-family: monospace; left:0px; top:0px; border-radius:3px; border: 1px solid #aaa; background: rgba(255,255,255,0.75); box-sizing: border-box; position:absolute; width: 600px;");
        styleSheet.sheet.addRule(".logWindow.hidden", "display:none;");
        styleSheet.sheet.addRule(".logWindow .logWindow-header", "height: 30px; padding-left: 1em; border-bottom: 1px solid #aaa; background(255,255,255,0.1);");
        styleSheet.sheet.addRule(".logWindow .logWindow-title", "line-height: 30px;");
        styleSheet.sheet.addRule(".logWindow .logWindow-close", "margin: 2px; line-height: 26px; float:right; height: 26px; width: 26px; border-radius: 3px; border: 1px solid #A00; background(175,0,0, 0.5); transition: background 0.2s linear, border 0.2s linear;");
        styleSheet.sheet.addRule(".logWindow .logWindow-close:hover", "border: 1px solid #D00; background(220,0,0, 0.75);");
        styleSheet.sheet.addRule(".logWindow .logWindow-body", "overflow-y: scroll; width: 100%");
        styleSheet.sheet.addRule(".logWindow .logWindow-content", "padding: 10px 20px; max-height: 400px; word-break: break-word;");
    };

    _.showLogWindow = function(boolean) {
        if(boolean) {
            $(logWindowObject).removeClass('hidden');
            $(logWindowObject).removeAttr('style');
        } else {
            $(logWindowObject).addClass('hidden');
        }
    }

    init();

    // return the scope
    return _;

})();