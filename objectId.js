// We are generating object id explicitly just to prove that this does not rely on mongodb
const mongoose = require('mongoose')

const id = new mongoose.Types.ObjectId()
console.log(id)
console.log(id.getTimestamp())

const isValid = mongoose.Types.ObjectId.isValid('afrq37647')
console.log(isValid)