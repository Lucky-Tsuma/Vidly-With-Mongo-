const express = require("express")
const router = express.Router()
const Joi = require("joi")
const mongose = require("mongoose")

    // INPUT VALIDATION WITH JOI
const schema = Joi.object({
    name: Joi.string().min(5).required()
})

const validateGenre = (genre) => {
    return schema.validate(genre)
}

// MONGO_DB

// We created a schema and compiled it into a model at the same time to make clean code
const Genre = mongose.model("Genre", mongose.Schema({
    name: {
        type: String,
        required: true,
        min: 5,
        max: 50
    }
}))

router.get("/", (_req, res) => {
    res.send("You are on vidly homepage.")
})

router.get("/genres", async (_req, res) => { 
    try {
        res.status(200).send(await Genre.find())  
    } catch (error) {
        res.status(500).send("Error getting genres" + error)
    }
})

router.post("/genres", async (req, res) => { 
    const { error } = validateGenre(req.body)
    if (error) { return res.status(400).send(error.details[0].message) }
    
    try {
        const genre = new Genre ({ name: req.body.name })
        res.status(200).send(await genre.save())
    } catch (err) {
        res.status(500).send("Error saving genre" + err) 
    }
})

router.put("/genres/:id", async (req, res) => { 
    const { error } = validateGenre(req.body)
    if (error) { return res.status(400).send(error.details[0].message) }

    try {
        const genre = await Genre.findById(req.params.id)

        if(!genre) { return res.status(200).send("Sorry! No such genre was found")}

        genre.name = req.body.name
        res.status(200).send(await genre.save())
    } catch (err) {
        res.status(500).send("Error updating genre " + err)
    }
})

router.delete("/genres/:id", async (req, res) => { 
    try {
        const genre = await Genre.findById(req.params.id)

        if(!genre) { return res.status(200).send("Sorry! No such genre was found")}
        res.status(200).send(await  Genre.findByIdAndRemove(req.params.id))
    } catch (error) {
        res.status(500).send("Error deleting genre " + error)
    }
})

module.exports = router
