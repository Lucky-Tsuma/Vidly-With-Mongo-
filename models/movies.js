const Joi = require("joi")
Joi.objectId = require('joi-objectid')(Joi)
const { genreSchema } = require('./genre')
const mongoose = require("mongoose")

const schema = Joi.object({
    title: Joi.string().min(5).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required()
})

const validate = (movie) => {
    return schema.validate(movie)
}

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
    dailyRentalRate: {
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
    