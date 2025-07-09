import { checkUsername, setupNavbarScroll, setupThemeToggle, } from "./functions.js";

function init() {
    // Check de username de vuelta
    checkUsername('carrito')

    // Carga inicial de carrito
    loadCart();
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

async function filter() {
    // Llamo la carga de productos con filtros incluidos
    loadCart(document.getElementsByClassName('search-bar')[0].value)
}

// Carga de carrito

let pendingDeleteIndex = null;
async function loadCart(filter) {
    const cartList = document.getElementById('cart-items');
    cartList.innerHTML = '';
    let total = 0;
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');

    if (filter) {
        cart = cart.filter(product =>
            product.name.toLowerCase().includes(filter.toLowerCase())
        )
    }

    for (let i = 0; i < cart.length; i++) {
        const product = cart[i];

        const item = document.createElement('li');
        item.className = 'item-block';

        // Nombre del producto
        const title = document.createElement('p');
        title.textContent = product.name;
        title.className = 'item-name';
        title.style.minWidth = '160px'; // Puedes ajustar el ancho
        title.style.textAlign = 'left';
        item.appendChild(title);

        // Boton -
        const btnMinus = document.createElement('button');
        btnMinus.textContent = '➖';
        btnMinus.classList.add('qty-button');
        btnMinus.onclick = () => {
            if (product.count > 1) {
                product.count--;
            } else {
                cart.splice(i, 1);
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            loadCart();
        };
        item.appendChild(btnMinus);

        // Caja de cantidad editable
        const inputCount = document.createElement('input');
        inputCount.type = 'number';
        inputCount.min = 1;
        inputCount.value = product.count;
        inputCount.classList.add('qty-input');
        inputCount.onchange = () => {
            let newCount = parseInt(inputCount.value);
            if (isNaN(newCount) || newCount < 1) newCount = 1;
            product.count = newCount;
            cart[i] = product;
            localStorage.setItem('cart', JSON.stringify(cart));
            loadCart();
        };
        item.appendChild(inputCount);

        // Botón ➕
        const btnPlus = document.createElement('button');
        btnPlus.textContent = '➕';
        btnPlus.classList.add('qty-button');
        btnPlus.onclick = () => {
            product.count++;
            cart[i] = product;
            localStorage.setItem('cart', JSON.stringify(cart));
            loadCart();
        };
        item.appendChild(btnPlus);

        // Botón 🗑️
        const btnDelete = document.createElement('button');
        btnDelete.textContent = '🗑️';
        btnDelete.classList.add('qty-button');
        btnDelete.onclick = () => {
            pendingDeleteIndex = i;
            document.getElementById('modal-delete').style.display = 'flex';
        };
        item.appendChild(btnDelete);

        total += product.price * product.count;
        cartList.appendChild(item);
    }

    const totalCart = document.getElementsByClassName('cart-total')[0];
    totalCart.innerHTML = 'Total: $' + total.toFixed(2);
    cartList.classList.remove('row');
}

document.getElementsByClassName('search-bar')[0].addEventListener('keyup', filter);

window.addEventListener('DOMContentLoaded', function() {
    // Mostrar el modal al hacer click en "Finalizar compra"
    document.getElementById('finish-sale').onclick = function(e) {
        e.preventDefault();
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (cart.length === 0) {
            alert('El carrito está vacío.');
            return;
        }
        document.getElementById('modal-confirm').style.display = 'flex';
    };

    // Confirmar la compra
    document.getElementById('btn-confirm').onclick = async function() {
        document.getElementById('modal-confirm').style.display = 'none';

        // Lógica de finalizar compra:
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        let total = 0;
        cart.forEach(item => {
            total += item.price * item.count;
        });

        const username = localStorage.getItem('username') || localStorage.getItem('user');

        localStorage.setItem('cart', JSON.stringify([]));
        const response = await fetch('http://localhost:3000/api/ventas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                products: cart,
                name: username
            })
        });

        const result = await response.json()

        if(response.ok) {
            localStorage.setItem('ticket', JSON.stringify({
                id: result.id,
                username: username,
                items: cart,
                total: total
            }));
            window.location.href = "./ticket.html";
        } else {
            alert('Error durante la compra')
        }
    };

    // Cancelar la compra
    document.getElementById('btn-cancel').onclick = function() {
        document.getElementById('modal-confirm').style.display = 'none';
    };
});

document.addEventListener('DOMContentLoaded', () => {
    const modalDelete = document.getElementById('modal-delete');
    const btnDeleteConfirm = document.getElementById('btn-delete-confirm');
    const btnDeleteCancel = document.getElementById('btn-delete-cancel');

    btnDeleteConfirm.onclick = () => {
        if (pendingDeleteIndex !== null) {
            let cart = JSON.parse(localStorage.getItem('cart') || '[]');
            cart.splice(pendingDeleteIndex, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            loadCart();
            pendingDeleteIndex = null;
        }
        modalDelete.style.display = 'none';
    };

    btnDeleteCancel.onclick = () => {
        pendingDeleteIndex = null;
        modalDelete.style.display = 'none';
    };
});

document.addEventListener('DOMContentLoaded', function() {
    const homeBtn = document.querySelector('.navbar-bttn > a[href="/Parcial/frontend/index.html"]');
    const modalHome = document.getElementById('modal-home');
    const btnHomeConfirm = document.getElementById('btn-home-confirm');
    const btnHomeCancel = document.getElementById('btn-home-cancel');

    if (homeBtn && modalHome) {
        homeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            modalHome.style.display = 'flex';
        });
    }

    if (btnHomeConfirm) {
        btnHomeConfirm.onclick = function() {
            localStorage.removeItem('cart');
            localStorage.removeItem('username');
            localStorage.removeItem('theme');
            window.location.href = "/Parcial/frontend/index.html";
        };
    }

    if (btnHomeCancel) {
        btnHomeCancel.onclick = function() {
            modalHome.style.display = 'none';
        };
    }
});

// Inicializo
init()
