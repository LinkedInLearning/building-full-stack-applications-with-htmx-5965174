const express = require("express")
const mongoose = require("mongoose")
const {getMongoUri, stopMongoServer} = require("./config/db")
const {faker} = require("@faker-js/faker")
const Student = require("./models/student")

const app = express();
const PORT = 3000;

//Serve static files from the public directory
app.use(express.static('public'));

//Parse url-encoded data
app.use(express.urlencoded({extended: true}))

//Connect to MongoDB
getMongoUri().then((mongoUri) => {
    mongoose.connect(mongoUri, {})
    .then(async () => {
        console.log(`Connected to in-memory MongoDB`)
        //Fetch some document count from db e.g Student.countDocuments();
    })
    .catch(err => console.error(`Failed to connect to in-memory db`, err))
})

app.get('/seed', async (req, res) => {
    
    try{
        const students = [];

        for (let i = 0; i < 100; i++){
            const student = new Student({
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                email: faker.internet.email()
            })

            students.push(student)
        }

        await Student.insertMany(students)
        console.log(`Database seeded with 100 students`)
        res.status(200).send(`Database seeded with 100 students`)
    }catch(error){
        console.error(`Error seeding database:`, error)
        res.status(500).send(`Error seeding database`)
    }
})

app.get('/search-students', async (req, res)=> {

    try{
        //Get the search term
        const {searchterm} = req.query
        let students = [];

        if(searchterm){
            const regex = new RegExp(searchterm, 'i')
            students = await Student.find({
                $or: [
                    {firstName: regex},
                    {lastName: regex},
                    {email : regex}
                ]
            })
        }

        res.send(renderSearchResults(students))
    }catch(error){
        res.status(500).json({
            error: `Internal Server Error ${error}`
        })
    }


})

function renderSearchResults(students){
    if(students.length === 0){
        return `<div class="result-item">No results found</div>`
    }

    const studentDivs =  students.map(item => `
        <div class="result-item">
            ${item.firstName} ${item.lastName} (${item.email})
        </div>
    `)

    returnedFragment = studentDivs.join('');

    return returnedFragment;
}

//Run the server
app.listen(PORT, () => {
    console.log(`Server running at port:${PORT}`)
})

//Handle graceful shutdown
process.on("SIGINT", async () => {
    await mongoose.disconnect();
    await stopMongoServer();
    process.exit(0)
})