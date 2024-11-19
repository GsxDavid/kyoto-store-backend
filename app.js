import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import { getProducts, createProduct } from './controllers/ProductController.js'
import { connectToDatabase } from './database.js'
import dotenv from 'dotenv'

dotenv.config()
const PORT = process.env.PORT
const app = express()

const password = encodeURIComponent(process.env.MONGO_PASSWORD)
const uri = `mongodb+srv://davidmancerarm:${password}@cluster0.7pr0x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

connectToDatabase(uri)

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage })

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configurar carpeta estática
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*') // Permitir cualquier origen
  res.header('Access-Control-Allow-Methods', 'GET, POST') // Métodos permitidos
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

app
  .route('/products')
  .get(async (req, res) => {
    try {
      const products = await getProducts()
      res.send({ success: true, data: products })
    } catch (err) {
      console.error('Error al obtener los productos:', err)
      res
        .status(500)
        .send({ success: false, message: 'Error al obtener los productos' })
    }
  })
  .post(upload.single('image'), async (req, res) => {
    const relativePath = req.file.path.replace(/\\/g, '/')
    const image = `${req.protocol}://${req.get('host')}/${relativePath}`

    const { name, price, category } = req.body
    const data = { name, price, category, image }

    try {
      const product = await createProduct(data)
      res.send({ success: true, product: product })
    } catch (err) {
      console.log('Error al crear el producto: ', err)

      res
        .status(500)
        .send({ success: false, message: 'Error al crear el producto' })
    }
  })

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
