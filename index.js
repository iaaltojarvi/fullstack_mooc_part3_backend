const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

morgan.token('body', function getBody (req) {
    return JSON.stringify(req.body)
  })

app.use(express.static('build'))
app.use(express.json()) 
app.use(morgan(':method :url :response-time :body'))
app.use(cors())

let persons = [
    {
        name: "Inari Aaltojärvi",
        number: "044-3317004",
        id: 1
    },
    {
        name: "Pipsa Possu",
        number: "999-112112",
        id: 2
    },
    {
        name: "Sylvanian Families",
        number: "1000-112112",
        id: 3
    },
    {
        name: "Toivo Salli",
        number: "444-444444",
        id: 4
    }
];

app.get('/', (req, res) => {
    res.send('<h1>Numbers</h1>')
})

app.get('/info', (req, res) => {
    res.send(`<h3>Phonebook has info for ${persons.length} people</h3>
    ${new Date()}`)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const randomId = Math.floor(Math.random() * 1001);
    return randomId
  }

  
  app.post('/api/persons', (request, response) => {
    const body = request.body
    const inList = persons.find(person => person.name.toLowerCase() === body.name.toLowerCase()) !== undefined;
  
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'Name or number missing' 
      })
    }

    if (inList) {
        return response.status(400).json({
          error: 'Name already in the list'
        })
    }
  
    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
  
    persons = persons.concat(person)
    response.json(person)
  })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})