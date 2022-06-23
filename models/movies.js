const Joi = require("joi")
const { genreSchema } = require('./genre')
const mongoose = require("mongoose")

const schema = Joi.object({
    title: Joi.string().min(5).required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRates: Joi.number().min(0).required()
})

const validate = (movie) => {
    return schema.validate(movie)
}

// Modelling relationships between related data. Linked movie to a respective genre here(Hybrid method)
const Movie = mongoose.model("Movie", mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRates: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
}))

module.exports = {
    validate,
    Movie
}
    