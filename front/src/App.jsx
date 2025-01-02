import { useState, useEffect } from 'react'
import personService from './services/persons.jsx'
import deletionService from "./components/Delete.jsx";
import Filter from "./components/Filter.jsx";
import PersonForm from "./components/PersonForm.jsx";
import PersonList from "./components/PersonList.jsx";
import Notification from "./components/Notification.jsx";


const App = () => {
    const [persons, setPersons] = useState([])
    const [personsFilter, setPersonsFilter] = useState([])
    const [filter, setFilter] = useState('')
    const [message, setMessage] = useState(null)
    const [typeMessage, setTypeMessage] = useState('')

    const updatePersons = (newPersons) => {
        setPersons(newPersons)
        setPersonsFilter(newPersons)
        setFilter('')   // Restart filter
    }

    const showMessage = (message, typeMessage, timeout) => {
        setMessage(message)
        setTypeMessage(typeMessage)
        setTimeout(() => {setMessage(null)}, timeout)
    }

    useEffect(() => {
        personService
            .getAllPersons()
            .then(initalPersons => {
                updatePersons(initalPersons)
                return initalPersons
            })
    }, []);

    return (
        <div>
            <h2>Phonebook</h2>

            <Notification message={message}
                          typeMessage={typeMessage.concat(" message")}
            />

            <Filter persons={persons}
                    setPersonsFilter={setPersonsFilter}
                    filter={filter}
                    setFilter={setFilter}
            />

            <h2>Add a new</h2>

            <PersonForm persons={persons}
                        updatePersons={updatePersons}
                        showMessage={showMessage}
            />

            <h2>Numbers</h2>

            <PersonList persons={personsFilter}
                        handlerDelete={(personToDelete) => (
                            deletionService.handlerDelete(persons, personToDelete, updatePersons, showMessage)
                        )}
            />
        </div>
    )
}

export default App