const Person = ({ person }) => {
    return (
        <p className={"personParagraph"}>{person.name} {person.number}</p>
    )
}

export default Person