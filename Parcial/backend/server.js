const express = require('express')
const cors = require('cors')
const app = express()
const productosRouter = require('./routes/productos')
const ventasRouter = require('./routes/ventas')

app.use(cors())
app.use(express.json())
app.use('/api/productos', productosRouter)
app.use('/api/ventas', ventasRouter)

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000')
})