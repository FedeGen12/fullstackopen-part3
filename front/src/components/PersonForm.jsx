import {useState} from "react";
import personService from '../services/persons.jsx'

const timeout = 5000

const PersonForm = ({ persons, updatePersons, showMessage }) => {
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')

    const updateState = (personsUpdated) => {
        updatePersons(personsUpdated)
        setNewName('')
        setNewNumber('')
    }

    const addPerson = (event) => {
        event.preventDefault()

        let newNameFormatted = newName.trim()

        const newPerson= {
            name: newNameFormatted,
            number: newNumber
        }

        for (const person of persons) {
            if (person.name.toLowerCase() === newNameFormatted.toLowerCase()) {
                const confimedUpdated = window.confirm(`${newNameFormatted} is already added to phonebook, replace the old number with a new one?`)
                if (confimedUpdated) {
                    personService
                        .updatePhonePerson({...newPerson, id:person.id})
                        .then((personUpdated) => {
                            const personsUpdated = persons.map(person => person.id !== personUpdated.id ? person : personUpdated)
                            updateState(personsUpdated)
                            showMessage(`Updated ${personUpdated.name}`, "success", timeout)
                        })
                        .catch(() => {
                            showMessage(`Information of ${newNameFormatted} has already been removed from server`, "error", timeout)
                        })
                }
                return
            }
        }

        personService
            .createPerson(newPerson)
            .then(createdPerson => {
                updateState(persons.concat(createdPerson))
                showMessage(`Added ${createdPerson.name}`, "success", timeout)
            })
    }


    const handlerInputChange = (event, setNewValue) => {
        // event is the input field ==> target.value = newName or newNumber
        setNewValue(event.target.value)
    }

    return (
        <form onSubmit={addPerson}>
            <div>
                name: <input value={newName}
                             onChange={(event) => handlerInputChange(event, setNewName)}
                             required />
            </div>

            <div>
                number: <input value={newNumber}
                               onChange={(event) => handlerInputChange(event, setNewNumber)}
                               required />
            </div>

            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

export default PersonForm