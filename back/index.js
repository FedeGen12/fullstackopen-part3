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

app.get(`${baseUrl}/:id`, (request, response) => {
    Person.findById(request.params.id)
        .then(person => {
            response.json(person)
        })
        .catch(() => {
            response.status(404).end()
        })
})

app.delete(`${baseUrl}/:id`, (request, response) => {
    Person.findByIdAndDelete(request.params.id)
        .then(() => {
            response.status(204).end()
        })
})

const responseWithError = (response, errorMsg) => {
    return response.status(400).json({
        error: errorMsg
    })
}

app.post(baseUrl, (request, response) => {
    const personToAdd = request.body;

    if (!personToAdd.name || !personToAdd.number) {
        return responseWithError(response, 'content missing')
    }

    Person.find({ name: personToAdd.name })
        .then(() => {
            return responseWithError(response, 'name must be unique')
        })

    const newPerson = new Person({
        name: personToAdd.name,
        number: personToAdd.number
    })

    newPerson.save().then(savedPerson => {
        response.status(201).json(savedPerson)
    })
})

app.put(`${baseUrl}/:id`, (request, response) => {
    const newPerson = {
        name: request.body.name,
        number: request.body.number
    }

    Person.findByIdAndUpdate(request.params.id, newPerson, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})