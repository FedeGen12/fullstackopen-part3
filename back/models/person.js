const mongoose = require('mongoose')
mongoose.set('strictQuery',false)

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: [3, "The minimum length for the name is 3"],
        required: [true, 'Username required'],
        unique: true
    },
    number: {
        type: String,
        minLength: [8, "The minimum length for the number is 8"],
        validate: {
            validator: function(v) {
                return /^\d{2,3}-\d+$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number`
        },
        required: [true, 'User phone number required']
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)