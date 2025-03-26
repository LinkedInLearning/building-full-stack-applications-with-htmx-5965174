const express = require("express")
const mongoose = require("mongoose")
const {getMongoUri, stopMongoServer} = require("./config/db")
const {faker} = require("@faker-js/faker")
const Product = require("./models/product")

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
        const products = Array.from({length: 100}, () => ({
            id: faker.string.uuid(),
            productName: faker.commerce.productName(),
            price: parseFloat(faker.commerce.price()),
            description: faker.commerce.productDescription()
        }))
        

        await Product.insertMany(products)
        console.log(`Database seeded with 100 products`)
    }catch(error){
        console.error(`Error seeding database:`, error)
    }
}

app.get("/products", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const fetchOptions = {
        page,
        limit,
        sort: {productName: 1},
        lean: true
    }

    const result = await Product.paginate({}, fetchOptions)

    return res.send(renderResults(result))
})

function renderResults (result){
    let html = '';

    //Table Body
    //html += '<tbody>';

    result.docs.forEach(product => {
        html += `
            <tr>
                <td scope="row">${product.id}</td>
                <td>${product.productName}</td>
                <td>${product.price}</td>
                <td>${product.description}</td>
            </tr>
        `
    });

    html += '<div id="pagination-controls">';

    if(result.hasPrevPage){
        html += `
            <button hx-get="/products?page=${result.prevPage}" 
            hx-target="#products-table tbody" hx-swap="innerHTML" 
            class="btn btn-warning">
                Previous
            </button>`;
    }

    if(result.hasNextPage){
        html += `
            <button hx-get="/products?page=${result.nextPage}" 
            hx-target="#products-table tbody" hx-swap="innerHTML" 
            class="btn btn-primary">
                Next
            </button>`;
    }

    html += '</div>'

    //html += '</tbody>';

    // Pagination Controls
    

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