const express = require('express')
const Item = require('../../models/Items')

const router = new express.Router()

//Get all api/items 

router.get('/items', async(req, res)=>{
    try {
        const item = await Item.find({}).sort({date: -1})
        res.status(201).send(item)
    } catch (error) {
     res.status(404).send(error)   
    }
})


// create a post route

router.post('/items', async(req, res) =>{
    const item = new Item(req.body)
    try {
        await item.save()
        res.status(201).send(item)
    } catch (error) {
        res.status(400).send(error)
    }
})

// deleting an item from the database

router.delete('/items/:id', async(req, res) => {
    const _id = req.params.id
    try {
        const item = await Item.findByIdAndDelete(_id)
        if(!item){
            res.status(404).send()
        }
        res.status(201).send(item)
    } catch (error) {
        res.status(404).send(error)
    }
})


module.exports = router