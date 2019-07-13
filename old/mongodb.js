const { MongoClient, ObjectID } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'
const id = new ObjectID()

console.log(id)

MongoClient.connect(connectionURL, { useNewUrlParser:true }, (err, client) => {
    if (err) return console.log('Unable to connect to database')

    const db = client.db(databaseName)

    // CRUD IN MONGODB

    // db.collection('users').insertOne({
    //     name: 'Matt',
    //     age: 29
    // }, (err, res) => {
    //     // OPTIONAL CALLBACK
    //     if (err) return console.log('Unable to insert user')
    //     console.log(res.ops)
    // })

    // db.collection('users').insertMany([
    //     {
    //         name: 'Roark',
    //         age: 35
    //     },
    //     {
    //         name: 'Ted',
    //         age: 24
    //     }
    // ], (err, res) => {
    //     if (err) console.log('Unable to insert documents')
    //     console.log(res.ops)
    // })

    // db.collection('users').findOne({ name:'Roark' }, (err, res) => {
    //     if (err) return console.log('Cannot find user')
    //     console.log(res)
    // })

    // db.collection('tasks').insertMany([
    //     {
    //         description: 'Read updates',
    //         completed: true
    //     },
    //     {
    //         description: 'Mailed updates',
    //         completed: true
    //     },
    //     {
    //         description: 'Received updates',
    //         completed: false
    //     },
    // ], (err, res) => {
    //     if (err) console.log('Unable to insert documents')
    //     console.log(res.ops)
    // })

    // db.collection('tasks').findOne({ _id: new ObjectID('5d22489d42a33e07496ada7f') }, (err, res) => {
    //     if (err) return console.log('Cannot find document')
    //     console.log(res)
    // })

    // db.collection('tasks').find({ completed: true }).toArray((err, tasks) => {
    //     if (err) return console.log('Cannot find completed tasks')
    //     console.log(tasks)
    // })

    // updateOne() RETURNS A PROMISE
    // db.collection('users').updateOne({
    //     _id: new ObjectID('5d2247e97561de0742c646f2')
    // }, {
    //     $inc: {
    //         age: 5
    //     }
    // })
    // .then(res => {
    //     console.log(res)
    // })
    // .catch(err => {
    //     console.log(err)
    // })

    // updateMany() RETURNS A PROMISE
    // db.collection('users').updateMany({}, {
    //     $set: {
    //         age: 30
    //     }
    // })
    // .then(res => {
    //     console.log(res)
    // })
    // .catch(err => {
    //     console.log(err)
    // })

    // deleteOne() & deleteMany() RETURN A PROMISE
    // PROCEDURE IS THE SAME FOR BOTH METHODS
    // db.collection('users')
    //     .deleteOne({ name: 'Ted' })
    //     .then(res => console.log(res))
    //     .catch(err => console.log(err))
})

