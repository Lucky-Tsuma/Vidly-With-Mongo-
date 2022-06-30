const winston = require("winston")

module. exports = function(err, _req, res, _next) {
    winston.error(err.message, err)
    res.status(500).send("Sorry, something went wrong.")
}