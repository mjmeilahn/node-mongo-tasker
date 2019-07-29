const express = require('express')
const multer = require('multer')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
require('./db/mongoose')

const app = express()
const port = 3000

const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 1000000 // 1 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.endsWith('.pdf')) {
            return cb(new Error('File must be in PDF format'))
        }

        cb(undefined, true)
    }
})

app.post('/upload', upload.single('file'), (req, res) => {
    res.send()
})

// CUSTOM MIDDLEWARE
// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET requests are disabled')
//     }
//     else {
//         next()
//     }
// })

// PARSE ALL INCOMING JSON AS JS OBJECTS
app.use(express.json())

// INCLUDE ROUTERS
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
})