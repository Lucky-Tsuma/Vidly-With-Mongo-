const express = require("express")
const router = express.Router()
const {validate, Customer} = require("../models/customer")

router.get("/", async (_req, res) => { 
    res.status(200).send(await Customer.find())  
})

router.post("/", async (req, res) => { 
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message) 
    
    const customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    })
    res.status(200).send(await customer.save())
})

router.put("/:id", async (req, res) => { 
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message) 

    const customer = await Customer.findById(req.params.id)
    if(!customer) return res.status(200).send("Sorry! No such customer was found")

    customer.name = req.body.name
    customer.phone = req.body.phone
    customer.isGold = req.body.isGold
    res.status(200).send(await customer.save())
})

router.delete("/:id", async (req, res) => { 
    const customer = await Customer.findById(req.params.id)
    if(!customer) return res.status(200).send("Sorry! No such customer was found")
    res.status(200).send(await  Customer.findByIdAndRemove(req.params.id))
})

module.exports = router
