let currentPage = 1;    
const productsPerPage = 12; // Cambia esto según la cantidad de productos por página

function init() {
    // Carga inicial de productos y carrito
    filtro();
    setupNavbarScroll();
    setupThemeToggle();

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

    // Eventos de paginación
    document.getElementById('page-1').addEventListener('click', function() {
        if (currentPage !== 1) {
            currentPage = 1;
            filtro();
            updatePagination();
        }
    });

    document.getElementById('page-next').addEventListener('click', function() {
        currentPage++;
        filtro();
        updatePagination();
    });
}

function updatePagination() {
    document.getElementById('page-1').classList.toggle('active', currentPage === 1);
    // Puedes agregar más lógica si tienes más páginas
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
        orden,                                                  // orden
        currentPage                                             // página actual
    );
}

// Carga de productos
async function cargarProductos(filtro, categoria, min, max, orden, page = 1) {
    const offset = (page - 1) * productsPerPage;
    const response = await fetch(`http://localhost:3000/api/productos?offset=${offset}&limit=${productsPerPage}&category=${categoria}&name=${filtro}&min=${min}&max=${max}&order=${orden}`)
    
    let result = await response.json()
    result = result['products']

    const listaProductos = document.getElementsByClassName('product-grid')[0]
    listaProductos.innerHTML = ''

    for (let i = 0; i < result.length; i++) {
        const producto = document.createElement('div')
        producto.className = 'product-card'

        const titulo = document.createElement('h3')
        titulo.innerHTML = result[i].name
        titulo.className = 'card-nombre'
        producto.appendChild(titulo)

        const img = document.createElement('img')
        img.src = 'http://localhost:3000/images/' + result[i].name + '.jpg'
        img.alt = result[i].name
        producto.appendChild(img)

        const descripcion = document.createElement('p')
        descripcion.innerHTML = result[i].description
        producto.appendChild(descripcion)

        const precio = document.createElement('p')
        precio.className = 'precio-producto'
        precio.innerHTML = '$' + Number(result[i].price).toFixed(2)
        producto.appendChild(precio)

        const boton = document.createElement('button')
        boton.innerHTML = 'Agregar a carrito'
        boton.classList.add('add-to-cart')
        boton.onclick = function() {
            extendButton(boton, producto, result, i);
        }
        producto.appendChild(boton)
        listaProductos.appendChild(producto)

        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const cartItem = cart.find(item => item.id === result[i].id);
        if (cartItem) {
            extendButton(boton, producto, result, i, cartItem.count);
        }
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

function setupThemeToggle() {
    const toggleBtn = document.getElementById('toggleBtn');
    const darkClass = 'dark-mode';

    // Al cargar, aplica el tema guardado y emoji correcto
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add(darkClass);
        toggleBtn.textContent = '☀️';
    } else {
        toggleBtn.textContent = '🌙';
    }

    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle(darkClass);
        const isDark = document.body.classList.contains(darkClass);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        toggleBtn.textContent = isDark ? '☀️' : '🌙';
    });
}


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

function setupNavbarScroll() {
    let isShrunk = false;
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('nav');
        if(window.scrollY > 60 && !isShrunk) {
            nav.style.padding = '8px 40px 24px 40px';
            nav.style.minHeight = '70px';
            nav.style.backgroundSize = 'cover 110%'; 
            isShrunk = true; // Marca que el navbar está reducido
        } else if (window.scrollY <= 60 && isShrunk) {
            nav.style.padding = '28px 40px 60px 40px';
            nav.style.minHeight = '180px';
            nav.style.backgroundSize = 'cover 50%';
            isShrunk = false; // Resetea el estado
        }
    });
}

function extendButton(boton, producto, result, i, cantidad = 1) {
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
    inputCantidad.value = cantidad
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
    if(cantidad == 1){
        updateCart(result[i], 1)
    }
}

init();