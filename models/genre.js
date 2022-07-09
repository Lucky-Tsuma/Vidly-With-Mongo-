const Joi = require("joi")
const mongoose = require("mongoose")

const schema = Joi.object({
    name: Joi.string().min(5).max(50).required()
})

const validateGenre = (genre) => {
    return schema.validate(genre)
}

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 5,
        max: 50
    }
})
const Genre = mongoose.model("Genre", genreSchema)

module.exports = {
    validateGenre,
    genreSchema,
    Genre
}
    