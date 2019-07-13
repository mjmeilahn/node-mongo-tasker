const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true
})

const User = mongoose.model('User', {
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

const Task = mongoose.model('Task', {
    description: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})

// const me = new User({
//     name: '    Adam   ',
//     email: 'ADAM@ADAM.COM   ',
//     password: 'pa45'
// })

// me.save()
// .then(() => {
//     console.log(me)
// })
// .catch(err => {
//     console.log(err)
// })

// const task = new Task({
//     description: 'Read emails',
//     completed: true
// })

// task.save()
//     .then(() => console.log(task))
//     .catch(err => console.log(err))