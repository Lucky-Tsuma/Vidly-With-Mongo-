const Joi = require("joi")
const mongoose = require("mongoose")

const schema = Joi.object({
    isGold: Joi.boolean(),
    phone: Joi.string().min(10).max(13).required(),
    name: Joi.string().min(5).required()
})

const validateCustomer = (customer) => {
    return schema.validate(customer)
}

const Customer = mongoose.model("Customer", mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 5,
        max: 50
    },
    isGold: {
        type: Boolean,
        default: false
    }, 
    phone: {
        type: Number,
        required: true
    }
}))

module.exports = {
    validateCustomer,
    Customer
}
