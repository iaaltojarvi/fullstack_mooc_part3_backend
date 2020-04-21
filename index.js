require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

morgan.token('body', function getBody(req) {
    return JSON.stringify(req.body)
})

app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :response-time :status :body'))
app.use(cors())

// const mongoose = require('mongoose')

// if (process.argv.length<3) {
//   console.log('give password as argument')
//   process.exit(1)
// }

// const password = process.argv[2]

// const url =
//   `mongodb+srv://fullstack:${password}@cluster0-hqalu.mongodb.net/person-app?retryWrites=true&w=majority`

// mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

// const personSchema = new mongoose.Schema({
//   name: String,
//   number: String
// })

// const Person = mongoose.model('person', personSchema)

// personSchema.set('toJSON', {
//     transform: (document, returnedObject) => {
//       returnedObject.id = returnedObject._id.toString()
//       delete returnedObject._id
//       delete returnedObject.__v
//     }
//   })

app.get('/', (req, res) => {
    res.send('<h1>Numbers</h1>')
})

app.get('/info', (req, res) => {
    res.send(`<h3>Phonebook has info for ${persons.length} people</h3>
    ${new Date()}`)
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(people => {
        res.json(people.map(person => person.toJSON()))
    })
})

// app.get('/api/persons/:id', (request, response) => {
//     const id = Number(request.params.id)
//     const person = persons.find(person => person.id === id)

//     if (person) {
//         response.json(person)
//     } else {
//         response.status(404).end()
//     }
// })

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person.toJSON())
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({ error: 'malformatted id' })
        })
})

app.delete('/api/persons/:id', (request, response) => {
    // const id = Number(request.params.id)
    // persons = persons.filter(person => person.id !== id)

    // response.status(204).end()
    Person.findById(request.params.id)
        .then(person => {
            person.remove()
            response.status(204).end()
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({ error: 'could not delete' })
        })
})

// const generateId = () => {
//     const randomId = Math.floor(Math.random() * 1001);
//     return randomId
//   }


//   app.post('/api/persons', (request, response) => {
//     const body = request.body
//     const inList = persons.find(person => person.name.toLowerCase() === body.name.toLowerCase()) !== undefined;

//     if (!body.name || !body.number) {
//       return response.status(400).json({ 
//         error: 'Name or number missing' 
//       })
//     }

//     if (inList) {
//         return response.status(400).json({
//           error: 'Name already in the list'
//         })
//     }

//     const person = {
//       name: body.name,
//       number: body.number,
//       id: generateId(),
//     }

//     persons = persons.concat(person)
//     response.json(person)
//   })

app.post('/api/persons', (request, response) => {
    const body = request.body

    // const inList = persons.find(person => person.name.toLowerCase() === body.name.toLowerCase()) !== undefined;

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'Name or number missing'
        })
    }

    // if (inList) {
    //     return response.status(400).json({
    //       error: 'Name already in the list'
    //     })
    // }

    // if (body.name === undefined) {
    //   return response.status(400).json({ error: 'content missing' })
    // }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson.toJSON())
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})