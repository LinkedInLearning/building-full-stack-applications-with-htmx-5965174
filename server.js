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
async function connectDB(){
    const uri = await getMongoUri();
    await mongoose.connect(uri, {})
    console.log(`Connected to in-memory MongoDB`)
}

async function seed(){
    
}

async function start(){
    await connectDB()
    await seed()
    //Run the server
    app.listen(PORT, () => {
        console.log(`Server running at port:${PORT}`)
    })
}

//Handle graceful shutdown
process.on("SIGINT", async () => {
    await mongoose.disconnect();
    await stopMongoServer();
    process.exit(0)
})

start()