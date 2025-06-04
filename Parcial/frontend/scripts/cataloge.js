function init() {

    const contador = parseInt(localStorage.getItem('cart-count'))
    const contadorCarrito = document.getElementById('cart-count')
    contadorCarrito.innerHTML = contador

    // Carga inicial de productos y carrito
    cargarProductos();
    cargarCarrito();

    let cart = localStorage.getItem('cart')
    if(cart == null){
        localStorage.setItem('cart', JSON.stringify([]))
    }

}

// Funcion de filtro
async function filtro() {
    // Llamo la carga de productos con un filtro incluido
    cargarProductos(document.getElementsByClassName('search-bar')[0].value)
}

// Carga de productos
async function cargarProductos(filtro) {
    const response = await fetch('http://localhost:3000/api/productos')
    let result = await response.json()
    result = result['productos']

    // Aplicar filtro si existe
    if (filtro != null) {
        result = result.filter(producto =>
            producto.nombre.toLowerCase().includes(filtro.toLowerCase())
        )
    }

    const listaProductos = document.getElementsByClassName('product-grid')[0]
    listaProductos.innerHTML = ''

    for (let i = 0; i < result.length; i++) {
        const producto = document.createElement('div')
        producto.className = 'product-card'


        const titulo = document.createElement('h3')
        titulo.innerHTML = result[i].nombre
        titulo.className = 'card-nombre'
        producto.appendChild(titulo)

        const img = document.createElement('img')
        console.log('dasd' + result[i].nombre)
        img.src = '../images/' + result[i].nombre + '.jpg'
        img.alt = result[i].nombre
        producto.appendChild(img)

        const boton = document.createElement('button')
        boton.innerHTML = 'Agregar a carrito'
        boton.classList.add('add-to-cart')

        boton.onclick = function () {
            // Obtener el carrito o inicializar
            let carrito = JSON.parse(localStorage.getItem('cart') || '[]')
            const index = carrito.findIndex(p => p.id === result[i].id)

            if (index !== -1) {
                carrito[index].count += 1
            } else {
                const productoConCount = { ...result[i], count: 1 }
                carrito.push(productoConCount)
            }

            localStorage.setItem('cart', JSON.stringify(carrito))

            // Actualizar contador
            let contador = parseInt(localStorage.getItem('cart-count') || '0')
            contador += 1
            localStorage.setItem('cart-count', contador)
            document.getElementById('cart-count').innerHTML = contador

            cargarCarrito()
        }

        producto.appendChild(boton)
        listaProductos.appendChild(producto)
    }
}


// Carga de carrito
async function cargarCarrito() {
    // Empiezo de 0 el carrito y el total
    const listaCarrito = document.getElementById('cart-items')
    listaCarrito.innerHTML = ''
    let total = 0
    let carrito = JSON.parse(localStorage.getItem('cart') || '[]')

    // Para cada item del carrito por id, reviso si el id es un int (si lo es, significa que es una fruta, si no, no)
    for(let i = 0; i < carrito.length; i++) {
        // Agarro el producto por su key (id)
        const producto = carrito[i]
        
        // Creo el item como se indica
        const item = document.createElement('li')
        item.className = 'item-block'
        
        // Le doy titulo precio y cantidad (la cantidad no esta estipulada pero me parecio razonable)
        const titulo = document.createElement('p')
        titulo.innerHTML = producto['nombre'] + ' x' + producto.count
        titulo.className = 'item-name'
        item.appendChild(titulo)
        
        // Creo su boton para que sean borrados (de a 1)
        const boton = document.createElement('button')
        boton.innerHTML = 'Eliminar 1'
        boton.onclick = function () {
            let carrito = JSON.parse(localStorage.getItem('cart') || '[]')
            const index = carrito.findIndex(p => p.id === producto.id)

            if (index !== -1) {
                if (carrito[index].count > 1) {
                    carrito[index].count -= 1
                } else {
                    carrito.splice(index, 1)
                }

                localStorage.setItem('cart', JSON.stringify(carrito))

                // Actualizar contador
                let contador = parseInt(localStorage.getItem('cart-count')) || 0
                contador = Math.max(0, contador - 1)
                localStorage.setItem('cart-count', contador)
                document.getElementById('cart-count').innerHTML = contador

                cargarCarrito()
            }
        }
        boton.classList.add('delete-button')
        
        // Agrego boton a la carta
        item.appendChild(boton)
        
        // Actualizo total
        total += producto['precio'] * producto.count
        
        // Agrego item al carrito
        listaCarrito.appendChild(item)
    }
    const totalCarrito = document.getElementsByClassName('cart-total')[0]
    totalCarrito.innerHTML = 'Total: $' + total.toFixed(2)
    listaCarrito.classList.remove('row')
}

// Doy el evento para el buscador
document.getElementsByClassName('search-bar')[0].addEventListener('keyup', filtro);

// Inicializo
init()
