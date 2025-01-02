const Filter = ({ persons, setPersonsFilter, filter, setFilter }) => {
    const handlerFilterChange = (event) => {
        const currFilter = event.target.value
        setFilter(currFilter)

        // Check the currFilter without the spaces behind the word
        if (currFilter.trimStart().length === 0) {
            setPersonsFilter(persons)    // shows the original persons list
            return true;
        }

        setPersonsFilter(persons.filter(person => {
            const words = person.name.split(' ').map(word => word.toLowerCase())

            let matchesFilter = false
            words.forEach(word => word.startsWith(currFilter.toLowerCase()) ? matchesFilter = true : false)
            return matchesFilter
        }))
    }

    return (
        <div>
            filter shown with name or surname: <input value={filter}
                                                      onChange={handlerFilterChange} />
        </div>
    )
}

export default Filter