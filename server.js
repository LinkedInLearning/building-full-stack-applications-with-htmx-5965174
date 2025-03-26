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
    articleForm: require("./templates/articleForm"),
    articleList: require("./templates/articleList"),
    articleDetail: require("./templates/articleDetail")
}



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

app.get("/articles/new", (req, res) => {
    res.send(templates.articleForm(null, {}))
})

app.post("/articles", async (req, res) => {
    try{
        const {title, content} = req.body;

        const errors = []

        //Check for errors
        if (!title) errors.push('A title is required');
        if (!content) errors.push('Blog content is required');

        if(errors.length > 0){
            return res.send(templates.articleForm(errors, req.body))
        }

        const newArticle = await Article.create({
            title, 
            content
        })

        res.send(templates.articleDetail(newArticle))
    }catch(error){
        res.send(templates.articleForm([error.message], {}))
    }
})

app.get("/articles/:id", async (req, res) => {
    const article = await Article.findById(req.params.id).lean()

    res.send(templates.articleDetail(article))
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