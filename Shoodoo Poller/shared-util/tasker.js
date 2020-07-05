var util = require('util');
var EventEmitter = require('events').EventEmitter;


/**
 * Creates a Tasker object, used to run a target function as a loop as non-blocking (asynchronous).
 */
var Tasker = function()
{
    EventEmitter.call(this);

    this.m_target = null;
    this.m_args = [];
    this.m_run = false;
    this.m_interval = 0;
};
util.inherits(Tasker, EventEmitter);

/**
 * Targets the passed function.
 * @param {function} target The target function.
 * @param {...} arg The passed arguments.
 */
Tasker.prototype.target = function()
{
    if(typeof arguments[0] === 'function')
    {
        this.m_target = arguments[0];

        var args = Array.prototype.slice.call(arguments, 1);
        if(args.length > 0)
        {
            this.m_args = args;
        }
    }
    else
    {
        this.emit('error', new Error('Tasker.Target receives the targeting function as the first argument.'));
        return 0;
    }

    return this;
};

/**
 * Starts the Tasker, runs the target at the fixed interval.
 * @param {int} interval The interval between target runs.
 */
Tasker.prototype.run = function( interval )
{
    var _target = this.m_target;
    var args = this.m_args;
    var self = this;

    this.m_run = true;
    this.m_interval = interval;

    function _execute_internal()
    {
        try {
            if (self.m_run) {
                execute();
            }
        }
        catch (e) {
            console.log("Tasker-run exception: " + e + "\n" + e.stack);
        }
    }

    function execute()
    {
        if(typeof _target === 'function')
        {
            switch(args.length)
            {
            case 0:
                _target.call(self);
                break;
            case 1:
                _target.call(self, args[0]);
                break;
            case 2:
                _target.call(self, args[0], args[1]);
                break;
            default:
                _target.apply(self, args);
                break;
            }

            self.m_timeout = setTimeout(_execute_internal, self.m_interval);
        }
        else
        {
            self.emit('error', new Error('Target is invalid.'));
        }
    }

    self.m_timeout = setTimeout(_execute_internal, this.m_interval);
}

/**
 * Stops the Tasker.
 */
Tasker.prototype.stop = function()
{
    clearTimeout(this.m_timeout);
    this.m_run = false;
}

/**
 * Tasker's error handler setter.
 */
Tasker.prototype.onError = function( handler_function )
{
    if(typeof handler_function === 'function')
    {
        this.on('error', handler_function);
    }
    else
    {
        console.log('Unable to set error handler, passed argument is not a function.');
    }

    return this;
}


module.exports = Tasker;
