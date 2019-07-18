const auth = require('../middleware/auth')
const express = require('express')
const router = new express.Router()
const Task = require('../models/task')

// GET /tasks
router.get('/tasks', auth, async (req, res) => {

    try {
        const tasks = await Task.find({ owner: req.user._id })
        res.send(req.user.tasks)
    }
    catch (e) {
        res.status(500).send(e)
    }
})


// GET /tasks/ID
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({_id, owner: req.user._id})
        if (!task) return res.status(404).send()

        res.send(task)
    }
    catch (e) {
        res.status(500).send(e)
    }
})


// POST /tasks
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    }
    catch (e) {
        res.status(400).send(e)
    }
})


// PATCH /tasks/:id
router.patch('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every(update => {
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation) return res.status(400).send({
        error: 'Invalid update'
    })

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        if (!task) return res.status(404).send()

        updates.forEach(update => task[update] = req.body[update])
        await task.save()
        res.send(task)
    }
    catch (e) {
        res.status(400).send(e)
    }
})


// DELETE /tasks
router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOneAndDelete({_id, owner: req.user._id})
        if (!task) return res.status(404).send()

        res.send(task)
    }
    catch (e) {
        res.status(500).send()
    }
})

module.exports = router