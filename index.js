require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

morgan.token('body', function getBody(req) {
    return JSON.stringify(req.body)
})

app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :response-time :status :body'))
app.use(cors())

app.get('/', (req, res) => {
    res.send('<h1>Numbers</h1>')
})

const personCount = () => {
    Person.countDocuments({})
        .then(count => {
            return count
        })
}
app.get('/info', (req, res) => {
    const persons = personCount()
    res.send(`<h3>Phonebook has info for ${persons} people</h3>
    ${new Date()}`)
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(people => {
        res.json(people.map(person => person.toJSON()))
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person.toJSON())
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'Name or number missing'
        })
    }
    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save()
    .then(savedPerson => {
        response.json(savedPerson.toJSON())
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id, (error, person) => {
        person.name = request.body.name,
        person.number = request.body.number
        person.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error))
    })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'Unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'Malformatted id' })
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})