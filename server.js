const express = require("express")
const mongoose = require("mongoose")
const {getMongoUri, stopMongoServer} = require("./config/db")
const {faker} = require("@faker-js/faker")
const Article = require("./models/Article")

const app = express();
const PORT = 3000;

//Serve static files from the public directory
app.use(express.static('public'));

//Parse url-encoded data
app.use(express.urlencoded({extended: true}))

async function connectDB(){
    const uri = await getMongoUri();
    await mongoose.connect(uri, {})
    console.log(`Connected to in-memory MongoDB`)
}

async function seed(){

    try{
        const articles = Array.from({length: 100}, () => ({
            title: faker.lorem.sentence(),
            content: faker.lorem.paragraphs(3, '<br/>\n')
        }));

        await Article.insertMany(articles)
        console.log(`Database seeded with 100 articles`)
    }catch(error){
        console.error(`Error seeding database:`, error)
    }
}

//Templates
const templates = {
    index: require("./templates/index"),
    articleForm: require("./templates/articleForm"),
    articleList: require("./templates/articleList"),
    articleDetail: require("./templates/articleDetail")
}

//Routes
app.get("/", (req, res) => {
    res.send(templates.index())
})

app.get("/articles", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const searchQuery = req.query.q;

    let query = {};
    if(searchQuery) {
        const regex = new RegExp(searchQuery, 'i');
        query = { $or : [{title: regex}, {content: regex}] };
    }

    const articles = await Article.find(query)
    .sort({createdAt: -1})
    .skip(skip)
    .limit(limit)
    .lean();

    const html = templates.articleList(articles, page, searchQuery)
    res.send(html)
})


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