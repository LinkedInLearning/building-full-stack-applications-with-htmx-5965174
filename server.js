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

async function connectDB(){
    const uri = await getMongoUri();
    await mongoose.connect(uri, {})
    console.log(`Connected to in-memory MongoDB`)
}

async function seed(){
    try{
        const posts = Array.from({length: 100}, () => ({
            title: faker.lorem.sentence(),
            content: faker.lorem.paragraphs(3, '<br/>\n'), // 3 paragraphs, with line breaks 
        }));

        await Post.insertMany(posts)
        console.log(`Database seeded with 100 posts`)
        
    }catch(error){
        console.error(`Error seeding database:`, error)
    }
}

app.get("/posts", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
    .sort({timestamp: -1})
    .skip(skip)
    .limit(limit)
    .lean()

    return res.send(renderResults(posts, page, limit))
})


function renderResults (posts, page, limit) {

    let html = '';

    posts.forEach(post => {
        html += `
            <figure class="post-card">
                <blockquote class="blockquote">
                    <p>${post.title}</p>
                </blockquote>
                <figcaption class="blockquote-footer">
                    ${new Date(post.timestamp).toLocaleDateString()}
                </figcaption>
            </figure>
        `
    })

    // Add trigger for the next page
    if(posts.length === limit){
        html += `
            <div hx-get="/posts?page=${page + 1}" 
                 hx-trigger="revealed delay:1000ms" 
                 hx-swap="afterend" 
                 class="htmx-indicator">
                Loading more posts...
            </div>
        `;
    }

    return html;
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