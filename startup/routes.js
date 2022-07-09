
const express = require("express")
const genres = require("../routes/genres")
const customers = require("../routes/customers")
const movies = require("../routes/movies")
const rentals = require("../routes/rental")
const register = require("../routes/users")
const auth = require("../routes/auth")
const returns = require("../routes/returns")
const error = require("../middleware/error")

module.exports = function (app) {
    app.use(express.json())
    app.use(express.urlencoded({extended:true}))
    app.use("/vidly.com/api/genres", genres)
    app.use("/vidly.com/api/customers", customers)
    app.use("/vidly.com/api/movies", movies)
    app.use("/vidly.com/api/rentals", rentals)
    app.use("/vidly.com/api/users", register)
    app.use("/vidly.com/api/auth", auth)
    app.use("/vidly.com/api/returns", returns)
    app.use(error)
}