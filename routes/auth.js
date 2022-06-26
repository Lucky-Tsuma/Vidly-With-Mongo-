const bcrypt = require("bcrypt")
const Joi = require("joi")
const express = require("express")
const router = express.Router()
const { User } = require("../models/user")

router.post("/", async (req, res) => { 
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message) 
    
    try {
        let user = await User.findOne({email: req.body.email})
        if(!user) return res.status(400).send("Invalid email or password")

        const isValid = await bcrypt.compare(req.body.password, user.password)
        if(!isValid) return res.status(400).send("Invalid email or password")

        const token = user.generateAuthToken()

        res.status(200).send(`${token}`)
    } catch (err) {
        res.status(500).send("Error logging in" + err) 
    }
})

function validate(req) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)(?=.*?[#?!@$ %^&*-]).{5,}$/).required(),
    })

    return schema.validate(req)
}

module.exports = router
