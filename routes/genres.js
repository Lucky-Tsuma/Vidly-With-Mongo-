const express = require("express")
const router = express.Router()
const Joi = require("joi")
const mongose = require("mongoose")

mongose.connect("mongodb://localhost/vidly")
    .then(() => console.log("Connected to database..."))
    .catch(err => console.error("Error connecting to database: ", err))

    // INPUT VALIDATION WITH JOI
const schema = Joi.object({
    name: Joi.string().min(5).required()
})

const validateGenre = (genre) => {
    return schema.validate(genre)
}

// MONGO_DB
// Create schema. Template for out document
const genreSchema = mongose.Schema({
    name: {
        type: String,
        required: true,
        min: 5,
        max: 50
    }
})

// Compile schema into model (which is similar to a class)
const Genre = mongose.model("Genre", genreSchema)

async function createGenre (gnr) {
    try {
        const genre = new Genre ({
            name: gnr
        })
    
        return await genre.save()
    } catch (error) {
        return "Error saving genre" + error
    }
}

async function getGenres() {
    try {
        return await Genre.find()  
    } catch (error) {
        return "Error getting genres" + error
    }
    
}

async function updateGenre(id, name) {
    try {
        const genre = await Genre.findById(id)

        if(!genre) { return "Sorry! No such genre was found"}

        genre.name = name
        return await genre.save()
    } catch (error) {
        return "Error updating genre " + error
    }
}

async function removeGenre(id) {
    try {
        const genre = await Genre.findById(id)

        if(!genre) { return "Sorry! No such genre was found"}
        return await  Genre.findByIdAndRemove(id)
    } catch (error) {
        return "Error deleting genre " + error
    }
}

router.get("/", (_req, res) => {
    res.send("You are on vidly homepage.")
})

router.get("/genres", async (_req, res) => { 
    const genres = await getGenres()
    res.send(genres)
})

router.post("/genres", async (req, res) => { 
    const { error } = validateGenre(req.body)
    if (error) { return res.status(400).send(error.details[0].message) }
    const response = await createGenre(req.body.name)
    res.send(response)
})

router.put("/genres/:id", async (req, res) => { 
    const { error } = validateGenre(req.body)
    if (error) { return res.status(400).send(error.details[0].message) }

    const result = await updateGenre(req.params.id, req.body.name)
    res.send(result)  
})

router.delete("/genres/:id", async (req, res) => { 

    const result = await removeGenre(req.params.id)
    res.send(result)
})

module.exports = router
