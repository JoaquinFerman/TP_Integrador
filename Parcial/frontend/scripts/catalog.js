function init() {

    // Carga inicial de productos y carrito
    cargarProductos();

    let cart = localStorage.getItem('cart')
    if(cart == null){
        localStorage.setItem('cart', JSON.stringify([]))
    }

    const toggleBtn = document.getElementById('toggleBtn');
    toggleBtn.addEventListener('click', () => {
        const lightMode = document.body.classList.toggle('light-mode');
        document.querySelectorAll('.theme-img').forEach(img => {
        const newSrc = lightMode ? img.dataset.srcLight : img.dataset.srcDark;
        if (newSrc) img.setAttribute('src', newSrc);})
    });
}

// Funcion de filtro
async function filtro() {
    // Llamo la carga de productos con filtros incluidos
    const checkedLabel = document.querySelector('.filter-section input[type="radio"]:checked');
    cargarProductos(document.getElementsByClassName('search-bar')[0].value, checkedLabel.value)
}

// Carga de productos
async function cargarProductos(filtro, categoria) {
    const response = await fetch('http://localhost:3000/api/productos')
    
    let result = await response.json()
    result = result['productos']

    // Aplicar filtro si existe
    if (filtro) {
        result = result.filter(producto =>
            producto.nombre.toLowerCase().includes(filtro.toLowerCase())
        )
    }

    if(categoria && categoria != "todas") {
        categoria
        result = result.filter(producto =>
            producto.categoria == categoria
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
        img.src = '../images/' + result[i].nombre + '.jpg'
        img.alt = result[i].nombre
        producto.appendChild(img)

        const descripcion = document.createElement('p')
        descripcion.innerHTML = result[i].descripcion
        producto.appendChild(descripcion)

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

            cargarCarrito()
        }

        producto.appendChild(boton)
        listaProductos.appendChild(producto)
    }
}

// Doy el evento para el buscador
document.getElementsByClassName('search-bar')[0].addEventListener('keyup', filtro);

document.querySelectorAll('.filter-section input[name="categoria"]').forEach(radio => {
    radio.addEventListener('change', function() {
        filtro();
    });
})
// Inicializo
init()
