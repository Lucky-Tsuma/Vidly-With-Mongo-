const express = require("express")
const router = express.Router()
const { Rental, validateRental } = require("../models/rental")
const { Movie } = require("../models/movies")
const auth = require("../middleware/auth")
const validate = require("../middleware/validate")

router.post("/", [auth, validate(validateRental)], async(req, res) => { 
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId)

    if(!rental) return res.status(404).send("Rental not found for customer/movie")
    if(rental.dateReturned) return res.status(400).send("Rental already processed")

    rental.return()
    await rental.save()

    await Movie.updateOne({ _id: rental.movie._id }, {
        $inc: { numberInStock: 1 }
    })
    return res.send(rental)
})

module.exports = router