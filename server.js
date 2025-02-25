const express = require("express")
const mongoose = require("mongoose")
const {getMongoUri, stopMongoServer} = require("./config/db")
const {faker} = require("@faker-js/faker")

const app = express();
const PORT = 3000;

//Serve static files from the public directory
app.use(express.static('public'));

//Parse url-encoded data
app.use(express.urlencoded({extended: true}))

//Connect to MongoDB
getMongoUri().then((mongoUri) => {
    mongoose.connect(mongoUri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(async () => {
        console.log(`Connected to in-memory MongoDB`)
        //Fetch some document count from db e.g Student.countDocuments();
    })
    .catch(err => console.error(`Failed to connect to in-memory db`, err))
})

/* app.get("/", (req, res) => {
    res.send("index.html")
}) */

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