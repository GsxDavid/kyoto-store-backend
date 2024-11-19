import mongoose from 'mongoose'

// Definición del esquema y modelo
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  category: String
})

const Product = mongoose.model('Product', productSchema)

export { Product }
