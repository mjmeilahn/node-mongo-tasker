const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const Task = require('./task')
const validator = require('validator')
const webToken = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
    // RESPONSE IN WHAT IS SHOWN TO FRONT END
    const user = this
    const userObj = user.toObject()

    // FRONT END DOES NOT NEED THIS INFORMATION
    delete userObj.password
    delete userObj.tokens

    return userObj
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = webToken.sign({ _id: user._id.toString() }, 'thisismynewcourse')

    user.tokens = user.tokens.concat({ token })

    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    // USE GENERIC ERROR MESSAGES TO PREVENT HACKER ABUSE

    const user = await User.findOne({ email })
    if (!user) throw new Error('Unable to login')

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new Error('Unable to login')

    return user
}

// ES6 ARROW FUNCTIONS NOT ALLOWED
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

// DELETE USER TASKS WHEN USER IS DELETED
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User