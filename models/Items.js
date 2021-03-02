const mongoose = require('mongoose')


//creating the item schema

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

const Item = mongoose.model('Item', itemSchema)

module.exports = Item