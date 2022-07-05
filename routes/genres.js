const auth = require("../middleware/auth")
const admin = require("../middleware/admin")
const express = require("express")
const router = express.Router()
const { Genre, validate } = require("../models/genre")

router.get("/", async(_req, res) => { 
    res.status(200).send(await Genre.find())  
})

router.post("/", auth, async(req, res) => { 
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message) 
    
    const genre = new Genre ({ name: req.body.name })
    res.status(200).send(await genre.save())
})

router.put("/:id", auth, async(req, res) => { 
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message) 

    const genre = await Genre.findById(req.params.id)
    if(!genre) return res.status(404).send("Sorry! No such genre was found")

    genre.name = req.body.name
    res.status(200).send(await genre.save())
})

router.delete("/:id", [auth, admin], async (req, res) => { 
    const genre = await Genre.findById(req.params.id)

    if(!genre) return res.status(404).send("Sorry! No such genre was found")
    res.status(200).send(await  Genre.findByIdAndRemove(req.params.id))  
})

module.exports = router
