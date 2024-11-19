import mongoose from 'mongoose'

const clientOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true }
}

async function connectToDatabase(uri) {
  try {
    await mongoose.connect(uri, clientOptions)
    return 'Conexión establecida'
  } catch (error) {
    throw new Error('Error al conectar con la base de datos: ' + error.message)
  }
}

export { connectToDatabase }
