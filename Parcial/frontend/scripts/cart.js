import { checkUsername, setupNavbarScroll, setupThemeToggle} from "./functions.js";

function init() {
    // Check de username de vuelta
    checkUsername('carrito')

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

let pendingDeleteIndex = null;
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

        // Nombre del producto
        const titulo = document.createElement('p');
        titulo.textContent = producto.name;
        titulo.className = 'item-name';
        titulo.style.minWidth = '160px'; // Puedes ajustar el ancho
        titulo.style.textAlign = 'left';
        item.appendChild(titulo);

        // Boton -
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
            producto.count = nuevaCantidad;
            carrito[i] = producto;
            localStorage.setItem('cart', JSON.stringify(carrito));
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
            cargarCarrito();
        };
        item.appendChild(btnMas);

        // Botón 🗑️
        const btnBorrar = document.createElement('button');
        btnBorrar.textContent = '🗑️';
        btnBorrar.classList.add('qty-button');
        btnBorrar.onclick = () => {
            pendingDeleteIndex = i;
            document.getElementById('modal-delete').style.display = 'flex';
        };
        item.appendChild(btnBorrar);

        total += producto.price * producto.count;
        listaCarrito.appendChild(item);
    }

    const totalCarrito = document.getElementsByClassName('cart-total')[0];
    totalCarrito.innerHTML = 'Total: $' + total.toFixed(2);
    listaCarrito.classList.remove('row');
}

// function actualizarContador(cambio) {
//     let contador = parseInt(localStorage.getItem('cart-count')) || 0;
//     contador = Math.max(0, contador + cambio);
//     localStorage.setItem('cart-count', contador);
// }

document.getElementsByClassName('search-bar')[0].addEventListener('keyup', filtro);

window.addEventListener('DOMContentLoaded', function() {
    // Mostrar el modal al hacer click en "Finalizar compra"
    document.getElementById('finalizar-compra').onclick = function(e) {
        e.preventDefault();
        const carrito = JSON.parse(localStorage.getItem('cart') || '[]');
        if (carrito.length === 0) {
            alert('El carrito está vacío.');
            return;
        }
        document.getElementById('modal-confirm').style.display = 'flex';
    };

    // Confirmar la compra
    document.getElementById('btn-confirmar').onclick = async function() {
        document.getElementById('modal-confirm').style.display = 'none';

        // Lógica de finalizar compra:
        const carrito = JSON.parse(localStorage.getItem('cart') || '[]');
        let total = 0;
        carrito.forEach(item => {
            total += item.price * item.count;
        });

        const usuario = localStorage.getItem('username') || localStorage.getItem('user');

        
        localStorage.setItem('cart', JSON.stringify([]));
        const response = await fetch('http://localhost:3000/api/ventas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                products: carrito,
                name: usuario
            })
        });

        const result = await response.json()

        if(response.ok) {
            localStorage.setItem('ticket', JSON.stringify({
                id: result.id,
                usuario: usuario,
                items: carrito,
                total: total
            }));
            window.location.href = "./ticket.html";
        } else {
            alert('Error durante la compra')
        }
    };

    // Cancelar la compra
    document.getElementById('btn-cancelar').onclick = function() {
        document.getElementById('modal-confirm').style.display = 'none';
    };
});

document.addEventListener('DOMContentLoaded', () => {
    const modalDelete = document.getElementById('modal-delete');
    const btnDeleteConfirm = document.getElementById('btn-delete-confirm');
    const btnDeleteCancel = document.getElementById('btn-delete-cancel');

    btnDeleteConfirm.onclick = () => {
        if (pendingDeleteIndex !== null) {
            let carrito = JSON.parse(localStorage.getItem('cart') || '[]');
            carrito.splice(pendingDeleteIndex, 1);
            localStorage.setItem('cart', JSON.stringify(carrito));
            cargarCarrito();
            pendingDeleteIndex = null;
        }
        modalDelete.style.display = 'none';
    };

    btnDeleteCancel.onclick = () => {
        pendingDeleteIndex = null;
        modalDelete.style.display = 'none';
    };
});

// Inicializo
init()
