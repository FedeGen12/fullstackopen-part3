const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.json())

morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :body`))

const baseUrl = '/api/persons'
const MAX_USERS = 121212

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
    },
    {
        "id": 12,
        "name": "Miguelón Factura",
        "number": "12-12-2012 BOCAAAAAAAAAAAAAAA"
    }
]

app.get(baseUrl, (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const formattedDate = new Date().toString();

    const divInfo =
        `<div>
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${formattedDate}</p>
        </div>`;

    response.send(divInfo);
})

app.get(`${baseUrl}/:id`, (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete(`${baseUrl}/:id`, (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})


const getRandomInt = () => {
    return Math.floor(Math.random() * MAX_USERS);
}

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

    const duplicatedPerson = persons.find(person => person.name === personToAdd.name)

    if (duplicatedPerson) {
        return responseWithError(response, 'name must be unique')
    }

    const newPerson = {
        id: getRandomInt(),
        name: personToAdd.name,
        number: personToAdd.number
    }

    persons = persons.concat(newPerson)
    response.json(newPerson)
})

const PORT = 3001
app.listen(PORT)