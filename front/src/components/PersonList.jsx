import Person from "./Person.jsx";

const PersonList = ({ persons, handlerDelete }) => {
    return (
        <div>
            {persons.map(person => (
                <div key={person.id}>
                    <Person person={person}/>
                    <button onClick={() => {handlerDelete(person)}}>delete</button>
                </div>
            ))}
        </div>
    )
}

export default PersonList