const express = require('express')
const cors = require('cors')
const path = require('path');
const app = express()
const methodOverride = require('method-override')

const productsRouter = require('./src/routes/products')
const salesRouter = require('./src/routes/sales')
const usersRouter = require('./src/routes/users')
const adminRouter = require('./src/routes/admin')
const loginRouter = require('./src/routes/auth')


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

app.use('/frontend', express.static(path.join(__dirname, '..', 'frontend')));
app.use('/Public', express.static(path.join(__dirname, 'Public')))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/api/productos', productsRouter)
app.use('/api/ventas', salesRouter)
app.use('/api/usuarios', usersRouter)
app.use('/api/admin', adminRouter)
app.use('/api/login', loginRouter)

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000')
})
