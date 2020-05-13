/**
 * Base Clock module ( the engine )
 * 
 * @class Clock
 */
class Clock {

    public settings;

    public dateString: string;

    public month: number;
    public year: number;
    public day: number;

    public time: Date;
    public hours: number;
    public minutes: number;
    public seconds: number;

    private interval: number;

    public OnTick: () => void;

    /**
     * Creates an instance of Clock.
     * @memberof Clock
     */
    constructor() {

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

    /**
     * Start the clock
     * 
     * @memberof Clock
     */
    public Start() {
        this._OnTick();

        this.interval = setInterval(() => this._OnTick(), 1000);
    }

    /**
     * Pause the clock
     * 
     * @memberof Clock
     */
    public Pause() {
        clearInterval(this.interval);
    }

    /**
     * Stop ( and reset ) the clock
     * 
     * @memberof Clock
     */
    public Stop() {
        this.Pause();
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
        this.dateString = "";
    }

    /**
     * Check whether this second marks a new day
     * 
     * @returns 
     * @memberof Clock
     */
    public _IsNewDay() {
        // If 00:00:00, return true ( is called every second )
        return this.hours % 12 == 0 && this.minutes % 60 == 0 && this.seconds % 60 == 0;
    }

    /**
     * Enable or disable year in the date string
     * 
     * @param {any} enable 
     * @memberof Clock
     */
    public EnableYear(enable) {
        this.settings.format.year = enable ? "numeric" : null;
        this._OnTick();
    }

    /**
     * Enable or disable month in the date string
     * 
     * @param {any} enable 
     * @memberof Clock
     */
    public EnableMonth(enable) {
        this.settings.format.month = enable ? "long" : null;
        this._OnTick();
    }

    /**
     * Enable or disable day in the date string
     * 
     * @param {any} enable 
     * @memberof Clock
     */
    public EnableDay(enable) {
        this.settings.format.day = enable ? "numeric" : null;
        this._OnTick();
    }

    /**
     * Enable or disable weekday name in the date string
     * 
     * @param {any} enable 
     * @memberof Clock
     */
    public EnableWeekDay(enable) {
        this.settings.format.weekday = enable ? "long" : null;
        this._OnTick();
    }

    /**
     * Set the language/locale of the date string
     * 
     * @param {any} locale 
     * @memberof Clock
     */
    public SetLocale(locale) {
        this.settings.locale = locale;
        this._OnTick();
    }

    /**
     * Tick event that gets called every second
     * 
     * @private
     * @memberof Clock
     */
    private _OnTick() {
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
    }
}