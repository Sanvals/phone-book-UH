const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.static('dist'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// STEP 8
morgan.token('req-body', (req, res) => {
    return JSON.stringify(req.body)
})

// STEP 7 & 8
app.use(morgan(':method :url :status :res[content-length] - :response-time :req-body'))
app.use(express.json())

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint'})
}

app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>')
})

// STEP 1
app.get('/api/persons', (request, response) => {
    response.send(persons)
})


// STEP 2
app.get('/info', (request, response) => {
    response.send(
    `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${Date()}
    `
    )
})

// STEP 3
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

// STEP 4
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})


// STEP 5 & STEP 6
app.post('/api/persons', (request, response) => {
    const body = request.body
     // console.log(body)

    if (!body.name) {
        return response.status(400).json({ error: 'no name has been added'})
    } else {
        const names = persons.map(p => p.name === body.name)
        if (names.includes(true)) {
            return response.status(400).json({ error: 'this user already exists'})
        }
    }

    if (!body.number){
        return response.status(400).json({ error: 'no number has been given'})
    }

    const person = {
        id: Math.random() * (10000),
        name: body.name,
        number: body.number
    }
    
    persons = persons.concat(person)

    response.json(person)
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})