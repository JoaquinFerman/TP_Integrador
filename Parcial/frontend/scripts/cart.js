function init() {

    // Carga inicial de carrito
    cargarCarrito();
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
        if (newSrc) img.setAttribute('src', newSrc);})
    });
}

async function filtro() {
    // Llamo la carga de productos con filtros incluidos
    cargarCarrito(document.getElementsByClassName('search-bar')[0].value)
}

// Carga de carrito
async function cargarCarrito(filtro) {
    const listaCarrito = document.getElementById('cart-items');
    listaCarrito.innerHTML = '';
    let total = 0;
    let carrito = JSON.parse(localStorage.getItem('cart') || '[]');

    if (filtro) {
        carrito = carrito.filter(producto =>
            producto.nombre.toLowerCase().includes(filtro.toLowerCase())
        )
    }

    for (let i = 0; i < carrito.length; i++) {
        const producto = carrito[i];

        const item = document.createElement('li');
        item.className = 'item-block';

        const btnMenos = document.createElement('button');
        btnMenos.textContent = '➖';
        btnMenos.classList.add('qty-button');
        btnMenos.onclick = () => {
            if (producto.count > 1) {
                producto.count--;
            } else {
                carrito.splice(i, 1);
            }
            localStorage.setItem('cart', JSON.stringify(carrito));
            actualizarContador(-1);
            cargarCarrito();
        };
        item.appendChild(btnMenos);

        // Caja de cantidad editable
        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.min = 1;
        inputCantidad.value = producto.count;
        inputCantidad.classList.add('qty-input');
        inputCantidad.onchange = () => {
            let nuevaCantidad = parseInt(inputCantidad.value);
            if (isNaN(nuevaCantidad) || nuevaCantidad < 1) nuevaCantidad = 1;
            const diferencia = nuevaCantidad - producto.count;
            producto.count = nuevaCantidad;
            carrito[i] = producto;
            localStorage.setItem('cart', JSON.stringify(carrito));
            actualizarContador(diferencia);
            cargarCarrito();
        };
        item.appendChild(inputCantidad);

        // Botón ➕
        const btnMas = document.createElement('button');
        btnMas.textContent = '➕';
        btnMas.classList.add('qty-button');
        btnMas.onclick = () => {
            producto.count++;
            carrito[i] = producto;
            localStorage.setItem('cart', JSON.stringify(carrito));
            actualizarContador(1);
            cargarCarrito();
        };
        item.appendChild(btnMas);

        // Nombre del producto
        const titulo = document.createElement('p');
        titulo.textContent = producto.nombre;
        titulo.className = 'item-name';
        item.appendChild(titulo);

        total += producto.precio * producto.count;
        listaCarrito.appendChild(item);
    }

    const totalCarrito = document.getElementsByClassName('cart-total')[0];
    totalCarrito.innerHTML = 'Total: $' + total.toFixed(2);
    listaCarrito.classList.remove('row');
}

document.getElementById('finalizar-compra').addEventListener('click', function() {
    const carrito = JSON.parse(localStorage.getItem('cart') || '[]');
    if (carrito.length === 0) {
        alert('El carrito está vacío.');
        return;
    }

    let total = 0;
    let ticketHTML = '<h3>Ticket de compra</h3><ul style="padding-left:20px;">';
    carrito.forEach(item => {
        const subtotal = (item.price * item.count);
        total += subtotal;
        ticketHTML += `<li>${item.nombre || item.name} x${item.count} - $${subtotal.toFixed(2)}</li>`;
    });
    ticketHTML += `</ul><strong>Total: $${total.toFixed(2)}</strong>`;

    const ticketDiv = document.getElementById('ticket');
    ticketDiv.innerHTML = ticketHTML;
    ticketDiv.style.display = 'block';

    // Limpia el carrito después de mostrar el ticket
    localStorage.setItem('cart', JSON.stringify([]));
    // Opcional: recarga el carrito en pantalla
    cargarCarrito();
});

function actualizarContador(cambio) {
    let contador = parseInt(localStorage.getItem('cart-count')) || 0;
    contador = Math.max(0, contador + cambio);
    localStorage.setItem('cart-count', contador);
}

document.getElementsByClassName('search-bar')[0].addEventListener('keyup', filtro);

function setupThemeToggle() {
    const toggleBtn = document.getElementById('toggleBtn');
    const darkClass = 'dark-mode';

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

function setupNavbarScroll() {
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('nav');
        if(window.scrollY > 60) {
            nav.style.padding = '8px 40px 24px 40px';
            nav.style.minHeight = '70px';
            nav.style.backgroundSize = 'cover 120%'; 
        } else {
            nav.style.padding = '28px 40px 60px 40px';
            nav.style.minHeight = '180px';
            nav.style.backgroundSize = 'cover';
        }
    });
}

// Inicializo
init()
