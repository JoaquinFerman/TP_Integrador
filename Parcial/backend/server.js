const express = require('express')
const cors = require('cors')
const app = express()
const productosRouter = require('./routes/productos')

app.use(cors())
app.use('/api/productos', productosRouter)

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000')
})
