const express = require("express")
const mongoose = require("mongoose")
const {getMongoUri, stopMongoServer} = require("./config/db")
const {faker} = require("@faker-js/faker")
const Post = require("./models/post")

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

app.get("/seed", async (req, res) => {

    try{
        const posts = Array.from({length: 100}, () => ({
            title: faker.lorem.sentence(),
            content: faker.lorem.paragraphs(3, '<br/>\n'), // 3 paragraphs, with line breaks 
        }));

        await Post.insertMany(posts)
        console.log(`Database seeded with 100 posts`)
        res.status(200).send(`Database seeded with 100 posts`)
    }catch(error){
        console.error(`Error seeding database:`, error)
        res.status(500).send(`Error seeding database`)
    }
})

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