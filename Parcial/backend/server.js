const express = require('express')
const cors = require('cors')
const path = require('path');
const app = express()
const productosRouter = require('./routes/productos')
const ventasRouter = require('./routes/ventas')
const usuariosRouter = require('./routes/usuarios')


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/api/productos', productosRouter)
app.use('/api/ventas', ventasRouter)
app.use('/api/usuarios', usuariosRouter)

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000')
})