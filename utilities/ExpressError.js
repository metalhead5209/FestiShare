class ExpressError extends Error {
    constructor(message, statCode) {
        super();
        this.message = message,
        this.statCode = statCode;
    }
};

module.exports = ExpressError;