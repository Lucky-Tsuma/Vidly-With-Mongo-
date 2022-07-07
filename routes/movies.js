const auth = require("../middleware/auth")
const express = require("express")
const router = express.Router()
const { Movie, validate } = require("../models/movies")
const { Genre } = require("../models/genre")
const validateId = require('../middleware/validateObjectId')

router.get("/", async (_req, res) => { 
    res.status(200).send(await Movie.find())  
})

router.post("/", auth, async (req, res) => { 
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message) 
    
    // We only passed the genreId, we use that to update other properties if the genre exists
    const genre = await Genre.findById(req.body.genreId)
    if(!genre) return res.status(400).send("Invalid genre")

    const movie = new Movie ({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    })
    res.status(200).send(await movie.save())
})

router.put("/:id", [validateId, auth], async (req, res) => { 
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message) 

    const movie = await Movie.findById(req.params.id)
    const genre = await Genre.findById(req.body.genreId)

    if(!movie) return res.status(404).send("Sorry! No such movie was found")
    if(!genre) return res.status(404).send("Invalid genre")

    movie.title = req.body.title
    movie.genre = {
        _id: genre._id,
        name: genre.name
    }
    movie.numberInStock = req.body.numberInStock
    movie.dailyRentalRate = req.body.dailyRentalRate
    res.status(200).send(await movie.save())
})

router.delete("/:id", [validateId,  auth], async (req, res) => { 
    const movie = await Movie.findById(req.params.id)

    if(!movie) return res.status(404).send("Sorry! No such movie was found")
    res.status(200).send(await  Movie.findByIdAndRemove(req.params.id))
})

module.exports = router
