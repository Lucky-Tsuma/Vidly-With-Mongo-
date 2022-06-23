const express = require("express")
const app = express()
const genreRoutes = require("./routes/genres")
const customerRoutes = require("./routes/customers")
const movieRoutes = require("./routes/movies")
const mongose = require("mongoose")
require("dotenv").config()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use("/vidly.com/api/genres", genreRoutes)
app.use("/vidly.com/api/customers", customerRoutes)
app.use("/vidly.com/api/movies", movieRoutes)

mongose.connect("mongodb://localhost/vidly")
    .then(() => console.log("Connected to database..."))
    .catch(err => console.error("Error connecting to database: ", err))

const port = process.env.VIDLY_PORT || 3000 

app.use("/", (_req, res) => {
    res.send("You are on vidly homepage.")
})

app.use((_req, res) => {
    res.status(404).send("Page not found!")
})

app.listen(port, () => {
    console.log(`Vidly listening on port ${port}...`)
})
