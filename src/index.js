const express = require('express')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
require('./db/mongoose')

const app = express()
const port = 3000

// CUSTOM MIDDLEWARE
app.use((req, res, next) => {
    if (req.method === 'GET') {
        res.send('GET requests are disabled')
    }
    else {
        next()
    }
})

// PARSE ALL INCOMING JSON AS JS OBJECTS
app.use(express.json())

// INCLUDE ROUTERS
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
})