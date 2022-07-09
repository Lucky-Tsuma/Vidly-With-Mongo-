const winston = require("winston")
const express = require("express")
const app = express()
require("dotenv").config()

require("./startup/logging")() 
require("./startup/routes")(app)
require("./startup/db")()
require("./startup/config")()
require("./startup/validation")()

const port = process.env.VIDLY_PORT || 3000 

const server = app.listen(port, () => {
    winston.info(`Vidly listening on port ${port}...`)
})

module.exports = server
