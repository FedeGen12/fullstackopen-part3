const express = require('express')
const app = express()

const baseUrl = '/api/persons'

const persons = [
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

const PORT = 3001
app.listen(PORT)