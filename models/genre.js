const Joi = require("joi")
const mongose = require("mongoose")

const schema = Joi.object({
    name: Joi.string().min(5).required()
})

const validate = (genre) => {
    return schema.validate(genre)
}

const genreSchema = mongose.Schema({
    name: {
        type: String,
        required: true,
        min: 5,
        max: 50
    }
})
const Genre = mongose.model("Genre", genreSchema)

module.exports = {
    validate,
    genreSchema,
    Genre
}
    