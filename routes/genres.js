const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const express = require("express")
const router = express.Router()
const { Genre, validate } = require('../models/genre')

router.get("/", async (_req, res) => { 
    try {
        res.status(200).send(await Genre.find())  
    } catch (error) {
        res.status(500).send("Error getting genres" + error)
    }
})

router.post("/", auth, async (req, res) => { 
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message) 
    
    try {
        const genre = new Genre ({ name: req.body.name })
        res.status(200).send(await genre.save())
    } catch (err) {
        res.status(500).send("Error saving genre" + err) 
    }
})

router.put("/:id", auth, async (req, res) => { 
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message) 

    try {
        const genre = await Genre.findById(req.params.id)

        if(!genre) return res.status(200).send("Sorry! No such genre was found")

        genre.name = req.body.name
        res.status(200).send(await genre.save())
    } catch (err) {
        res.status(500).send("Error updating genre " + err)
    }
})

router.delete("/:id", [auth, admin], async (req, res) => { 
    try {
        const genre = await Genre.findById(req.params.id)

        if(!genre) return res.status(200).send("Sorry! No such genre was found")
        res.status(200).send(await  Genre.findByIdAndRemove(req.params.id))
    } catch (error) {
        res.status(500).send("Error deleting genre " + error)
    }
})

module.exports = router
