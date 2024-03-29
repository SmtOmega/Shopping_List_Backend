const express = require('express')
const Item = require('../../models/Items')
const auth = require('../../middleware/auth')

const router = new express.Router()

//Get all api/items 

router.get('/items', auth, async(req, res)=>{
    try {
        const item = await Item.find({owner: req.user._id}).sort({date: -1})
        res.status(200).json({item})
    } catch (error) {
     res.status(404).json({error})   
    }
})


// create a post route

router.post('/items', auth, async(req, res) =>{
    const item = new Item({...req.body, owner: req.user._id})
    try {
        await item.save()
        res.status(201).json({item})
    } catch (error) {
        res.status(400).json({error})
    }
})

// deleting an item from the database

router.delete('/items/:id', auth, async(req, res) => {
    const _id = req.params.id
    try {
        const item = await Item.findByIdAndDelete(_id)
        if(!item){
           return res.status(404).json({msg: "Item can not be found"})
        }
        res.status(200).json({item})
    } catch (error) {
        res.status(404).json({error})
    }
})


module.exports = router