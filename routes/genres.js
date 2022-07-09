const auth = require("../middleware/auth")
const admin = require("../middleware/admin")
const express = require("express")
const router = express.Router()
const { Genre, validateGenre } = require("../models/genre")
const validateId = require("../middleware/validateObjectId")
const validate = require('../middleware/validate')

router.get("/", async(_req, res) => { 
    res.status(200).send(await Genre.find())  
})

router.get("/:id", validateId, async(req, res) => { 
    const genre = await Genre.findById(req.params.id)  

    if(!genre) return res.status(404).send("Sorry! No such genre was found.")

    res.status(200).send(genre)
})

router.post("/", [auth, validate(validateGenre)], async(req, res) => { 
    const genre = new Genre ({ name: req.body.name })
    res.status(200).send(await genre.save())
})

router.put("/:id", [validateId, validate(validateGenre), auth], async(req, res) => { 
    const genre = await Genre.findById(req.params.id)
    if(!genre) return res.status(404).send("Sorry! No such genre was found")

    genre.name = req.body.name
    res.status(200).send(await genre.save())
})

router.delete("/:id", [validateId, auth, admin], async (req, res) => { 
    const genre = await Genre.findById(req.params.id)

    if(!genre) return res.status(404).send("Sorry! No such genre was found")
    res.status(200).send(await  Genre.findByIdAndRemove(req.params.id))  
})

module.exports = router
