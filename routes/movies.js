const express = require("express")
const router = express.Router()
const { Movie, validate } = require('../models/movies')
const { Genre } = require('../models/genre')

router.get("/", async (_req, res) => { 
    try {
        res.status(200).send(await Movie.find())  
    } catch (error) {
        res.status(500).send("Error getting genres" + error)
    }
})

router.post("/", async (req, res) => { 
    const { error } = validate(req.body)
    if (error) { return res.status(400).send(error.details[0].message) }
    
    try {
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
            dailyRentalRates: req.body.dailyRentalRates
        })
        res.status(200).send(await movie.save())
    } catch (err) {
        res.status(500).send("Error saving movie" + err) 
    }
})

router.put("/:id", async (req, res) => { 
    const { error } = validate(req.body)
    if (error) { return res.status(400).send(error.details[0].message) }

    try {
        const movie = await Movie.findById(req.params.id)
        const genre = await Genre.findById(req.body.genreId)

        if(!movie) { return res.status(200).send("Sorry! No such movie was found")}
        if(!genre) { return res.status(200).send("Invalid genre")}

        movie.title = req.body.title
        movie.genre = {
            _id: genre._id,
            name: genre.name
        }
        movie.numberInStock = req.body.numberInStock
        movie.dailyRentalRates = req.body.dailyRentalRates
        res.status(200).send(await movie.save())
    } catch (err) {
        res.status(500).send("Error updating movie " + err)
    }
})

router.delete("/:id", async (req, res) => { 
    try {
        const movie = await Movie.findById(req.params.id)

        if(!movie) { return res.status(200).send("Sorry! No such movie was found")}
        res.status(200).send(await  Movie.findByIdAndRemove(req.params.id))
    } catch (error) {
        res.status(500).send("Error deleting movie " + error)
    }
})

module.exports = router
