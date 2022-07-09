const Joi = require("joi")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const config = require("config")

const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)(?=.*?[#?!@$ %^&*-]).{5,}$/).required(),
    confirm_password: Joi.ref("password")
})
    .with("password", "confirm_password")

const validateUser = (user) => {
    return schema.validate(user)
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true
    },
    email: {
        type: String,
        minlength: 5,
        maxlength: 255,
        unique: true
    }, 
    password: {
        type: String,
        minlength: 6,
        maxlength: 1024,
        required: true,
    },
    isAdmin: Boolean
})

userSchema.methods.generateAuthToken = function() {
    return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get("jwtPrivateKey"))
}

const User = mongoose.model("User", userSchema)

module.exports = {
    validateUser,
    User
}
