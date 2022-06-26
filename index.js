const Joi = require("joi")
Joi.objectId = require("joi-objectid")(Joi)
const express = require("express")
const app = express()
const genres = require("./routes/genres")
const customers = require("./routes/customers")
const movies = require("./routes/movies")
const rentals = require("./routes/rental")
const register = require("./routes/users")
const auth = require("./routes/auth")
const mongoose = require("mongoose")
const config = require("config")
require("dotenv").config()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use("/vidly.com/api/genres", genres)
app.use("/vidly.com/api/customers", customers)
app.use("/vidly.com/api/movies", movies)
app.use("/vidly.com/api/rentals", rentals)
app.use("/vidly.com/api/users", register)
app.use("/vidly.com/api/auth", auth)

mongoose.connect("mongodb://localhost/vidly")
    .then(() => console.log("Connected to database..."))
    .catch(err => console.error("Error connecting to database: ", err))

const port = process.env.VIDLY_PORT || 3000 

if (!config.get("jwtPrivateKey")) {
    console.log("FATAL ERROR: jwtPrivateKey not defined")
    process.exit(1)
    
}

app.use("/", (_req, res) => {
    res.send("You are on vidly homepage.")
})

app.use((_req, res) => {
    res.status(404).send("Page not found!")
})

app.listen(port, () => {
    console.log(`Vidly listening on port ${port}...`)
})
