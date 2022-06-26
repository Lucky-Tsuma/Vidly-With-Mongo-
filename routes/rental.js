const express = require("express")
const router = express.Router()
const { Rental, validate } = require('../models/rental')
const { Customer } = require('../models/customer')
const { Movie } = require('../models/movies')
const Fawn = require('fawn')

Fawn.init('mongodb://localhost/vidly')

router.get("/", async (_req, res) => { 
    try {
        res.status(200).send(await Rental.find().sort('-dateOut'))  
    } catch (error) {
        res.status(500).send("Error getting rental data" + error)
    }
})

router.post("/", async (req, res) => { 
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message) 
    
    try {
        const customer = await Customer.findById(req.body.customerId)
        if(!customer) return res.status(400).send("No such customer was found")

        const movie = await Movie.findById(req.body.movieId)
        if(!movie) return res.status(400).send("No such movie was found")

        if(movie.numberInStock === 0) return res.status(400).send("Movie not in stock")

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
            .save('rentals', rental)
            .update('movies', { _id: movie._id }, {
                $inc: { numberInStock: -1 }
            })
            .run()

        res.status(200).send(rental)
    } catch (err) {
        res.status(500).send("Error saving rental data" + err) 
    }
})

module.exports = router