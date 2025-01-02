import personService from '../services/persons.jsx'

const timeout = 5000

const handlerDelete = (persons, personToDelete, updatePersons, showMessage) => {
    const confirmedDeletion = window.confirm(`Delete ${personToDelete.name}?`)
    if (confirmedDeletion) {
        personService
            .deletePerson(personToDelete.id)
            .then(personDeleted => {
                const filteredPersons = persons.filter(person => person.id !== personDeleted.id)
                updatePersons(filteredPersons)
            })
            .catch(() => {
                showMessage(`Information of ${personToDelete.name} has already been removed from server`, "error", timeout)
            })
    }
}

export default {handlerDelete}