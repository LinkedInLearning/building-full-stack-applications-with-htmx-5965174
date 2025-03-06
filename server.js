const express = require("express")
const mongoose = require("mongoose")
const {getMongoUri, stopMongoServer} = require("./config/db")
const {faker} = require("@faker-js/faker")
const forms = require("./templates/forms")
const ProfileData = require("./models/profiledata");

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

app.get("/begin-form", (req, res) => {

    return res.send(forms.renderStep1([], {}))
})

app.post("/submit-step1", async (req, res) => {

    const {firstName, lastName, email } = req.body;
    const errors = []

    //Check for errors
    if (!firstName) errors.push('First name is required');
    if (!lastName) errors.push('Last name is required');
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.push('Valid email is required');

    if(errors.length > 0){
        return res.send(forms.renderStep1(errors, req.body))
    }

    const profileData = await ProfileData.findByIdAndUpdate(
        req.body.formId || new mongoose.Types.ObjectId(),
        {personalInfo : {firstName, lastName, email}},
        {upsert: true, new: true}
    );

    return res.send(forms.renderStep2(profileData._id, [], {}))

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