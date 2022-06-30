const winston = require('winston')
const express = require("express")
const app = express()
require("dotenv").config()

require('./startup/logging')() 
require('./startup/routes')(app)
require('./startup/db')()
require('./startup/config')()
require('./startup/validation')()

const port = process.env.VIDLY_PORT || 3000 

app.use("/", (_req, res) => {
    res.send("You are on vidly homepage.")
})

app.use((_req, res) => {
    res.status(404).send("Page not found!")
})

app.listen(port, () => {
    winston.info(`Vidly listening on port ${port}...`)
})
