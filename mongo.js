const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://testeo:${password}@cluster0.bogphdh.mongodb.net/phoneApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log("phonebook:")
        result.map(p => {
            console.log(p.name, "-", p.number)
        })
        mongoose.connection.close()
    }).catch(error => {
        console.error('Error retrieving people: ', error)
        mongoose.connection.close()
    })
}

if (process.argv.length === 5) {
    const person = new Person({
        name: process.argv[3],
        number: String(process.argv[4])
    })
    // console.log(person)

    person.save().then(result => {
        console.log('person saved!')
        mongoose.connection.close()
    })
    
}

