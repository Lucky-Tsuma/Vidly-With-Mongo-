const express = require("express")
const router = express.Router()
const { Rental, validateRental } = require("../models/rental")
const { Customer } = require("../models/customer")
const { Movie } = require("../models/movies")
const Fawn = require("fawn")
const validate = require("../middleware/validate")

Fawn.init("mongodb://localhost/vidly")

router.get("/", async (_req, res) => { 
    res.status(200).send(await Rental.find().sort("-dateOut"))  
})

router.post("/", validate(validateRental), async (req, res) => { 
    const customer = await Customer.findById(req.body.customerId)
    if(!customer) return res.status(404).send("No such customer was found")

    const movie = await Movie.findById(req.body.movieId)
    if(!movie) return res.status(404).send("No such movie was found")

    if(movie.numberInStock === 0) return res.status(404).send("Movie not in stock")

    let rental = new Rental ({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    })

    // We use the fawn library to simulate transcations on mongodb
    new Fawn.Task()
        .save("rentals", rental)
        .update("movies", { _id: movie._id }, {
            $inc: { numberInStock: -1 }
        })
        .run()

    res.status(200).send(rental)
})

module.exports = router
