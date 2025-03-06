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

function renderStep1 (errors){
    let html = '';
    html += `
        <form hx-post="/submit-step1">
            <div class="mb-3">
                <label class="form-label">First Name</label>
                <input type="text" name="firstName">
            </div>
            <div class="mb-3">
                <label class="form-label">Last Name</label>
                <input type="text" name="lastName">
            </div>
            <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="text" name="email">
            </div>

            <div class="d-flex justify-content-end">
                <button type="submit" class="btn btn-primary">
                    Next <span class="ms-2">&rarr;</span>
                </button>
            </div>

        </form>
    `;

    return html;

}

function renderStep2(formId, errors){

    let html = '';

    html += `
        <form hx-post="submit-step2">
            <input type="hidden" name="formId" value="${formId}">
            <div class="mb-3">
                <label class="form-label">Street Address</label>
                <input type="text" name="street">
            </div>

            <div class="mb-3">
                <label class="form-label">City</label>
                <input type="text" name="city">
            </div>

            <div class="mb-4">
                <label class="form-label">ZIP Code</label>
                <input type="text" name="zip">
            </div>

            <div class="d-flex justify-content-between">
                <button type="button" 
                        hx-get="/" 
                        hx-target="#step2"
                        class="btn btn-outline-secondary">
                    &larr; Previous
                </button>
                <button type="submit" class="btn btn-primary">
                    Next &rarr;
                </button>
            </div>
        </form>
    `;

    return html;
}

function renderStep3(formId, errors){
    let html = '';

    html += `
        <form hx-post="/submit-complete-form">
            <input type="hidden" name="formId" value="${formId}">
            <div class="mb-4">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" name="newsletter" id="newsletter">
                    <label class="form-check-label" for="newsletter">
                        Subscribe to newsletter
                    </label>
                </div>
                
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" name="notifications" id="notifications">
                    <label class="form-check-label" for="notifications">
                        Receive notifications
                    </label>
                </div>
            </div>

            <div class="d-flex justify-content-between">
                <button type="button" 
                        hx-get="/step2" 
                        hx-target="#step3"
                        hx-include="[name='formId']"
                        class="btn btn-outline-secondary">
                    &larr; Previous
                </button>
                <button type="submit" class="btn btn-success">
                    Submit
                </button>
            </div>

        </form>
    `
}

//Connect to MongoDB
getMongoUri().then((mongoUri) => {
    mongoose.connect(mongoUri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(async () => {
        console.log(`Connected to in-memory MongoDB`)
        //Fetch some document count from db e.g Student.countDocuments();
    })
    .catch(err => console.error(`Failed to connect to in-memory db`, err))
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