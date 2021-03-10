const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required:true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 7
    },
    date: {
        type: Date,
        default: Date.now()
    }, 
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]

})

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    return userObject
}

userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 10)
    }

    next()
})
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Invalid email or password')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('Invalid email or password')
    }
    return user
}
userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    user.save()
    return token
}

// creating a virtual relationship between the user model and item model
userSchema.virtual('item', {
    ref: 'Item',
    localField: '_id',
    foreignField: 'owner'
})

const User = mongoose.model('User', userSchema)

module.exports = User