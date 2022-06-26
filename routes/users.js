const bcrypt = require("bcrypt")
const _ = require("lodash")
const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const { validate, User } = require("../models/user")

router.get("/", async (_req, res) => { 
    try {
        res.status(200).send(await User.find())  
    } catch (error) {
        res.status(500).send("Error getting users" + error)
    }
})

router.get("/me", auth, async(req, res) => {
    const user = await User.findById(req.user._id).select("-password")
    res.status(200).send(user)
})

router.post("/", async (req, res) => { 
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message) 
    
    try {
        let user = await User.findOne({email: req.body.email})
        if(user) return res.status(400).send("User already exists")

        user = new User(_.pick(req.body, ["name", "email", "password"]))
        
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)

        await user.save()

        const token = user.generateAuthToken()
        res.header("x-auth-token", token).status(200).send(_.pick(user, ["_id", "name", "email"]))
    } catch (err) {
        res.status(500).send("Error saving user" + err) 
    }
})

module.exports = router
