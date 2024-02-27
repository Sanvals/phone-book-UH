require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()
app.use(cors())
app.use(express.static('dist'))

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

// Backend STEP 1 & Databse STEP 1
app.get('/api/persons', (request, response) => {
    Person.find({}).then(p => {
        response.json(p)
        // console.log("All phonebook retrieved")
    })
})


// Backend STEP 2 & Database STEP 1
app.get('/info', (request, response) => {
    const amount = Person.countDocuments({}).then(count => 
        response.send(
            `
            <p>Phonebook has info for ${count} people</p>
            <p>${Date()}
            `
        )
        )
})

// Backend STEP 3 & Database STEP 1
app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(p => {
            if (p) {
                response.json(p)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({ error: 'malformatted id'})
        })
})

// Backend STEP 4 & Database STEP 3
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            // console.log(`Deleted id ${request.params.id}`)
            response.status(204).end()
        })
        .catch(error => next(error))
})


// Backend STEP 5 & STEP 6 & Database STEP 2
app.post('/api/persons', (request, response, next) => {
    const name = request.body.name
    const number = request.body.number

    if (!name || !number) {
        return response.status(400).json({ error: 'name and number are necessary'})
    }

    const person = new Person({
        name: name,
        number: number
    })
    
    person.save()
        .then(p => response.json(p))
        // Database STEP 7
        .catch(error => next(error))
})

// Database STEP 5
app.put('/api/persons/:id', (request, response, next) => {
    const name = request.body.name
    const number = request.body.number

    const person = {
        name: name,
        number: number
    }

    Person.findByIdAndUpdate(
        request.params.id, 
        person, 
        {new: true, runValidators: true, context: 'query'}
        )
        .then(update => {
            response.json(update)
        })
        .catch(error => next(error))
})

app.use(unknownEndpoint)


// Database STEP 4
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({error : 'malformatted id'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    }
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})