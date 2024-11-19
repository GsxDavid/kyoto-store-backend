import { Product } from '../models/Product.js'

async function getProducts() {
  const products = await Product.find({})
  return products
}

async function getProductById(id) {
  const product = await Product.findById(id)
  if (!product) {
    throw new Error('Producto no encontrado')
  }
  return product
}

async function createProduct(data) {
  const { name, price, image, category } = data
  const product = new Product({ name, price, image, category })
  await product.save()
  return product
}

export { getProducts, getProductById, createProduct }
