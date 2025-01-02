const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const baseUrl = '/api/persons'

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
require('dotenv').config()

morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :body`))

const Person = require('./models/person')

app.get(baseUrl, (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    const formattedDate = new Date().toString();

    Person.find({}).then(persons => {
        const divInfo =
            `<div>
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${formattedDate}</p>
        </div>`;

        response.send(divInfo);
    })
})

app.get(`${baseUrl}/:id`, (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete(`${baseUrl}/:id`, (request, response) => {
    Person.findByIdAndDelete(request.params.id)
        .then(() => {
            response.status(204).end()
        })
})

app.post(baseUrl, (request, response, next) => {
    const personToAdd = request.body;

    const newPerson = new Person({
        name: personToAdd.name,
        number: personToAdd.number
    })

    newPerson.save()
        .then(savedPerson => {
            response.status(201).json(savedPerson)
        })
        .catch(error => next(error))
})

app.put(`${baseUrl}/:id`, (request, response, next) => {
    const newPerson = {
        name: request.body.name,
        number: request.body.number
    }

    Person.findByIdAndUpdate(
        request.params.id,
        newPerson,
        { new: true, runValidators: true, context: 'query' }
    )
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError' || error.name === 'MongoServerError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})