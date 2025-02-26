const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")

const productSchema = new mongoose.Schema({
    id: String,
    productName: String,
    price: Number,
    description: String
})

productSchema.plugin(mongoosePaginate)
const Product = mongoose.model('Product', productSchema)

module.exports = Product;