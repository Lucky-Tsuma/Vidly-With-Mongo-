const Joi = require("joi")
const mongose = require("mongoose")

const schema = Joi.object({
    name: Joi.string().min(5).required()
})

const validate = (genre) => {
    return schema.validate(genre)
}

// We created a schema and compiled it into a model at the same time to make clean code
const Genre = mongose.model("Genre", mongose.Schema({
    name: {
        type: String,
        required: true,
        min: 5,
        max: 50
    }
}))

module.exports = {
    validate,
    Genre
}
    