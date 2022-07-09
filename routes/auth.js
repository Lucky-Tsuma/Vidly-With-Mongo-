const bcrypt = require("bcrypt")
const Joi = require("joi")
const express = require("express")
const router = express.Router()
const { User } = require("../models/user")
const validate = require("../middleware/validate")

router.post("/", validate(validateAuth), async (req, res) => { 
    let user = await User.findOne({email: req.body.email})
    if(!user) return res.status(400).send("Invalid email or password")

    const isValid = await bcrypt.compare(req.body.password, user.password)
    if(!isValid) return res.status(400).send("Invalid email or password")

    const token = user.generateAuthToken()

    res.status(200).send(`${token}`)
})

function validateAuth(req) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)(?=.*?[#?!@$ %^&*-]).{5,}$/).required(),
    })

    return schema.validate(req)
}

module.exports = router
