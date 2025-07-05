const express = require('express')
const cors = require('cors')
const path = require('path');
const app = express()
const methodOverride = require('method-override')

const productsRouter = require('./routes/products')
const salesRouter = require('./routes/sales')
const usersRouter = require('./routes/users')
const adminRouter = require('./routes/admin')


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

app.use('/frontend', express.static(path.join(__dirname, '..', 'frontend')));
app.use('/images', express.static(path.join(__dirname, 'images')))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/api/productos', productsRouter)
app.use('/api/ventas', salesRouter)
app.use('/api/usuarios', usersRouter)
app.use('/api/admin', adminRouter)

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000')
})
