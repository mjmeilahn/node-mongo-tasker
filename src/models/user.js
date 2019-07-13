const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate (val) {
            if (!validator.isEmail(val)) {
                throw new Error('email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate (val) {
            if (val.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain the phrase "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate (val) {
            if (val < 0) {
                throw new Error('age must be a positive number')
            }
        }
    }
})

// ES6 ARROW FUNCTIONS NOT ALLOWED
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User