const auth = require('../middleware/auth')
const express = require('express')
const multer = require('multer')
const router = new express.Router()
const User = require('../models/user')

// LOGIN /users/login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    }
    catch (e) {
        res.status(400).send()
    }
})

// LOGOUT - One Token
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)

        await req.user.save()
        res.send()
    }
    catch (e) {
        res.status(500).send()
    }
})

// LOGOUT - All Tokens
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    }
    catch (e) {
        res.status(500).send()
    }
})

// GET /users/me
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// POST /users
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        await user.generateAuthToken()
        res.status(201).send(user)
    }
    catch (e) {
        res.status(400).send(e)
    }
})


// PATCH /users
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'password', 'email']
    const isValidOperation = updates.every(update => {
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation) return res.status(400).send({
        error: 'Invalid update'
    })

    try {
        updates.forEach(update => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    }
    catch (e) {
        res.status(400).send(e)
    }
})

// DELETE /users
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    }
    catch (e) {
        res.status(500).send()
    }
})

// OLD GET /users
router.get('/users', async (req, res) => {

    try {
        const users = await User.find({})
        res.send(users)
    }
    catch (e) {
        res.status(500).send(e)
    }
})

// OLD GET /users/ID
router.get('/users/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)
        if (!user) return res.status(404).send()

        res.send(user)
    }
    catch (e) {
        res.status(500).send(e)
    }
})


// GET /users/:id/avatar
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    }
    catch (e) {
        res.status(404).send()
    }
})

// POST /users/me/avatar
const avatar = multer({
    limits: {
        fileSize: 1000000 // 1 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/g)) {
            return cb(new Error('File type must be either PNG, JPG or JPEG'))
        }

        cb(undefined, true)
    }
})
router.post('/users/me/avatar', auth, avatar.single('avatar'), async (req, res) => {
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    })
})


// DELETE /users/me/avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

module.exports = router