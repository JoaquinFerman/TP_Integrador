function init() {

    // Carga inicial de productos y carrito
    cargarProductos('', 'todas', 0, Infinity, undefined);

    let cart = localStorage.getItem('cart')
    if(cart == null){
        localStorage.setItem('cart', JSON.stringify([]))
    }

    const toggleBtn = document.getElementById('toggleBtn');
    toggleBtn.addEventListener('click', () => {
        const lightMode = document.body.classList.toggle('light-mode');
        document.querySelectorAll('.theme-img').forEach(img => {
            const newSrc = lightMode ? img.dataset.srcLight : img.dataset.srcDark;
            if (newSrc) img.setAttribute('src', newSrc);
        })
    });

    // Evento para ordenar por precio
    document.querySelectorAll('input[name="orden-precio"]').forEach(radio => {
        radio.addEventListener('change', filtro);
    });

    // Evento para rango de precio
    document.getElementById('aplicar-precio').addEventListener('click', filtro);
}

// Funcion de filtro
async function filtro() {
    let checkedLabel = document.querySelector('.filter-section input[name="categoria"]:checked'); 
    if (!checkedLabel) { 
        checkedLabel = { value: "todas" }; 
    }
    const orden = document.querySelector('input[name="orden-precio"]:checked')?.value;
    let min = parseFloat(document.getElementById('precio-min').value);
    let max = parseFloat(document.getElementById('precio-max').value);

    if (isNaN(min)) min = 0;
    if (isNaN(max)) max = Infinity;

    cargarProductos(
        document.getElementsByClassName('search-bar')[0].value, // filtro
        checkedLabel.value,                                     // categoria
        min,                                                    // min
        max,                                                    // max
        orden                                                   // orden
    );
}

// Carga de productos
async function cargarProductos(filtro, categoria, min, max, orden) {
    const response = await fetch('http://localhost:3000/api/productos')
    
    let result = await response.json()
    result = result['productos']

    // Aplicar filtro si existe
    if (filtro) {
        result = result.filter(producto =>
            producto.nombre.toLowerCase().includes(filtro.toLowerCase())
        )
    }

    // Filtrar por rango de precio
    result = result.filter(producto => producto.precio >= min && producto.precio <= max);

    if (orden === 'mayor') result.sort((a, b) => b.precio - a.precio);
    if (orden === 'menor') result.sort((a, b) => a.precio - b.precio);

    if(categoria && categoria != "todas") {
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

        const precio = document.createElement('p')
        precio.className = 'precio-producto'
        precio.innerHTML = '$' + Number(result[i].precio).toFixed(2)
        producto.appendChild(precio)

        const boton = document.createElement('button')
        boton.innerHTML = 'Agregar a carrito'
        boton.classList.add('add-to-cart')
        boton.onclick = function () {
            // Oculta el botón
            boton.style.display = 'none'

            // Crea el contenedor de cantidad
            const qtyWrapper = document.createElement('div')
            qtyWrapper.className = 'qty-wrapper'

            // Botón restar
            const btnRestar = document.createElement('button')
            btnRestar.textContent = '-'
            btnRestar.className = 'qty-button qty-button-minus'
            // Botón sumar
            const btnSumar = document.createElement('button')
            btnSumar.textContent = '+'
            btnSumar.className = 'qty-button qty-button-plus'
            // Input cantidad
            const inputCantidad = document.createElement('input')
            inputCantidad.type = 'number'
            inputCantidad.value = 1
            inputCantidad.min = 1
            inputCantidad.className = 'qty-input'
            inputCantidad.readOnly = true

            // Lógica para sumar/restar y actualizar carrito
            btnRestar.onclick = () => {
                let val = parseInt(inputCantidad.value)
                if (val > 1) {
                    inputCantidad.value = val - 1
                    updateCart(result[i], parseInt(inputCantidad.value))
                } else if (val === 1) {
                    producto.removeChild(qtyWrapper); // Elimina el contenedor de cantidad
                    boton.style.display = ''; // Muestra nuevamente el botón
                    boton.disabled = true; // Deshabilita el botón
                    updateCart(result[i], 0); // Actualiza el carrito a 0

                    boton.style.backgroundColor = 'var(--color-accent-dark)';

                    setTimeout(() => {
                        boton.disabled = false;
                        boton.style.backgroundColor = ''; 
                    }, 500); // Espera 0.5 segundos antes de habilitar el boton nuevamente
                }
            }
            btnSumar.onclick = () => {
                let val = parseInt(inputCantidad.value)
                inputCantidad.value = val + 1
                updateCart(result[i], parseInt(inputCantidad.value))
            }

            qtyWrapper.appendChild(btnRestar)
            qtyWrapper.appendChild(inputCantidad)
            qtyWrapper.appendChild(btnSumar)
            producto.appendChild(qtyWrapper)

            // Agrega al carrito con cantidad 1
            updateCart(result[i], 1)
        }
        producto.appendChild(boton)
        listaProductos.appendChild(producto)
    }
}

// Doy el evento para el buscador
document.getElementsByClassName('search-bar')[0].addEventListener('keyup', filtro);

// Doy el evento para los filtros de categoria
document.querySelectorAll('.filter-section input[name="categoria"]').forEach(radio => {
    radio.addEventListener('change', function() {
        filtro();
    });
})

// Evento para el botón de modo oscuro
const toggleBtn = document.getElementById('toggleBtn');
const darkClass = 'dark-mode';

// Verifica el tema guardado en localStorage y aplica la clase correspondiente
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add(darkClass);
}

// Si el tema es oscuro, actualiza las imágenes
toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle(darkClass);
    const isDark = document.body.classList.contains(darkClass);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Actualiza el carrito en el localStorage
function updateCart(producto, cantidad) {
    let cart = JSON.parse(localStorage.getItem('cart')) || []
    const idx = cart.findIndex(p => p.id === producto.id)
    if (idx !== -1) {
        cart[idx].count = cantidad
    } else {
        cart.push({ ...producto, count: cantidad })
    }
    localStorage.setItem('cart', JSON.stringify(cart))
}

init();