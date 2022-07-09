const express = require("express")
const router = express.Router()
const {validateCustomer, Customer} = require("../models/customer")
const validateId = require("../middleware/validateObjectId")
const validate = require('../middleware/validate')

router.get("/", async (_req, res) => { 
    res.status(200).send(await Customer.find())  
})

router.post("/", validate(validateCustomer), async (req, res) => { 
    const customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    })
    res.status(200).send(await customer.save())
})

router.put("/:id", [validateId, validate(validateCustomer)], async (req, res) => { 
    const customer = await Customer.findById(req.params.id)
    if(!customer) return res.status(404).send("Sorry! No such customer was found")

    customer.name = req.body.name
    customer.phone = req.body.phone
    customer.isGold = req.body.isGold
    res.status(200).send(await customer.save())
})

router.delete("/:id", validateId, async (req, res) => { 
    const customer = await Customer.findById(req.params.id)
    if(!customer) return res.status(404).send("Sorry! No such customer was found")
    res.status(200).send(await  Customer.findByIdAndRemove(req.params.id))
})

module.exports = router
