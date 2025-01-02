import axios from "axios";
const personsURL = '/api/persons'

const getAllPersons = () => {
    const request= axios.get(personsURL)
    return request.then(response => response.data)
}

const createPerson = (newPerson) => {
    const request= axios.post(personsURL, newPerson)
    return request.then(response => response.data)
}

const deletePerson = (idPerson) => {
    const request = axios.delete(`${personsURL}/${idPerson}`)
    return request.then(response => response.data)
}

const updatePhonePerson = (personUpdated) => {
    const request= axios.put(`${personsURL}/${personUpdated.id}`, personUpdated)
    return request.then(response => response.data)
}

export default {getAllPersons, createPerson, deletePerson, updatePhonePerson}