const Joi = require("joi")
const mongoose = require("mongoose")

const schema = Joi.object({
    name: Joi.string().min(5).required()
})

const validate = (genre) => {
    return schema.validate(genre)
}

const genreSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 5,
        max: 50
    }
})
const Genre = mongoose.model("Genre", genreSchema)

module.exports = {
    validate,
    genreSchema,
    Genre
}
    