import { setupNavbarScroll, setupThemeToggle, updateCart, checkUsername } from "./functions.js";

const productsPerPage = 12; // Cambia esto según la cantidad de productos por página

function init() {
    checkUsername('catalogo')

    // Carga inicial de productos y carrito
    filter();
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

    document.getElementById('page-next').addEventListener('click', function() {
        updatePagination(1);
    });

    document.getElementById('page-prev').addEventListener('click', function() {
        updatePagination(-1);
    });

    // Evento para ordenar por precio
    document.querySelectorAll('input[name="price-order"]').forEach(radio => {
        radio.addEventListener('change', filter);
    });

    // Evento para rango de precio
    document.getElementById('apply-price').addEventListener('click', filter);

    localStorage.setItem('page', 1)
}

function updatePagination(change = false) {
    let page = Number(localStorage.getItem('page'))
    if(change){
        page += change
    } else {
        page = 1
    }
    localStorage.setItem('page', page)
    filter(true)
}

// Funcion de filtro
async function filter(changePage = false) {
    let checkedLabel = document.querySelector('.filter-section input[name="category"]:checked');
    
    if (!checkedLabel) { 
        checkedLabel = { value: "todas" }; 
    }
    const order = document.querySelector('input[name="price-order"]:checked')?.value;
    let min = parseFloat(document.getElementById('price-min').value);
    let max = parseFloat(document.getElementById('price-max').value);

    if (isNaN(min)) min = 0;
    if (isNaN(max)) max = Infinity;

    loadProducts(
        document.getElementsByClassName('search-bar')[0].value, // filtro
        checkedLabel.value,                                     // categoria
        min,                                                    // min
        max,                                                    // max
        order,                                                  // orden
        localStorage.getItem('page'),                           // página actual
        changePage                                              // se esta cambiando de pag?
    );
}

// Carga de productos
async function loadProducts(filter, category, min, max, order, page = 1, changePage = false) {    
    if(changePage == false){
        localStorage.setItem('page', 1)
        updatePagination()
        return
    }
    const offset = (page - 1) * productsPerPage;
    const response = await fetch(`http://localhost:3000/api/productos?offset=${offset}&limit=${productsPerPage}&category=${category}&name=${filter}&min=${min}&max=${max}&order=${order}`)

    let result = await response.json()
    const count = result['count']
    result = result['products']


    numbers(Math.ceil(count / productsPerPage))

    if(page == 1){
        document.getElementById('page-prev').style.display = 'none'
    } else {
        document.getElementById('page-prev').style.display = 'block'
    }

    if(page*productsPerPage >= count){
        document.getElementById('page-next').style.display = 'none'
    } else {
        document.getElementById('page-next').style.display = 'block'
    }

    const productsList = document.getElementsByClassName('product-grid')[0]
    productsList.innerHTML = ''

    for (let i = 0; i < result.length; i++) {
        const product = document.createElement('div')
        product.className = 'product-card'

        const title = document.createElement('h3')
        title.innerHTML = result[i].name
        title.className = 'card-name'
        product.appendChild(title)

        const img = document.createElement('img')
        img.src = 'http://localhost:3000/Public/images/' + result[i].name + '.webp'
        img.alt = result[i].name
        product.appendChild(img)

        const description = document.createElement('p')
        description.innerHTML = result[i].description
        product.appendChild(description)

        const price = document.createElement('p')
        price.className = 'product-price'
        price.innerHTML = '$' + Number(result[i].price).toFixed(2)
        product.appendChild(price)

        const button = document.createElement('button')
        button.innerHTML = 'Agregar a carrito'
        button.classList.add('add-to-cart')
        button.onclick = function() {
            extendButton(button, product, result, i);
        }
        product.appendChild(button)
        productsList.appendChild(product)

        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const cartItem = cart.find(item => item.id === result[i].id);
        if (cartItem) {
            extendButton(button, product, result, i, cartItem.count);
        }
    }
}

function numbers(maxPage) {
    const page = Number(localStorage.getItem('page'));
    maxPage = Number(maxPage);

    const pagination = document.getElementById('pagination-numbers');
    if (pagination) pagination.innerHTML = '';

    let start = Math.max(1, page - 2);
    let end = Math.min(maxPage, page + 2);

    if (end - start < 4) {
        if (start === 1) {
            end = Math.min(maxPage, start + 4);
        } else if (end === maxPage) {
            start = Math.max(1, end - 4);
        }
    }

    for (let i = start; i <= end; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = 'page-btn' + (i === page ? ' active' : '');
        btn.addEventListener('click', () => {
            updatePagination(i - page);
            localStorage.setItem('page', i);
            filter(true);
        });
        if (pagination) pagination.appendChild(btn);
    }
}

// Doy el evento para el buscador
document.getElementsByClassName('search-bar')[0].addEventListener('keyup', filter);

// Doy el evento para los filtros de categoria
document.querySelectorAll('.filter-section input[name="category"]').forEach(radio => {
    radio.addEventListener('change', function() {
        filter();
    });
})

function extendButton(button, product, result, i, cantidad = 1) {
    // Oculta el botón
    button.style.display = 'none'

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
    const inputCount = document.createElement('input')
    inputCount.type = 'number'
    inputCount.value = cantidad
    inputCount.min = 1
    inputCount.className = 'qty-input'
    inputCount.readOnly = true

    // Lógica para sumar/restar y actualizar carrito
    btnRestar.onclick = () => {
        let val = parseInt(inputCount.value)
        if (val > 1) {
            inputCount.value = val - 1
            updateCart(result[i], parseInt(inputCount.value))
            ///
        } else if (val === 1) {
            product.removeChild(qtyWrapper); // Elimina el contenedor de cantidad
            button.style.display = ''; // Muestra nuevamente el botón
            button.disabled = true; // Deshabilita el botón
            updateCart(result[i], 0); // Actualiza el carrito a 0

            button.style.backgroundColor = 'var(--color-accent-dark)';

            setTimeout(() => {
                button.disabled = false;
                button.style.backgroundColor = ''; 
            }, 500); // Espera 0.5 segundos antes de habilitar el boton nuevamente
        }
    }
    btnSumar.onclick = () => {
        let val = parseInt(inputCount.value)
        inputCount.value = val + 1
        updateCart(result[i], parseInt(inputCount.value))
    }

    qtyWrapper.appendChild(btnRestar)
    qtyWrapper.appendChild(inputCount)
    qtyWrapper.appendChild(btnSumar)
    product.appendChild(qtyWrapper)

    // Agrega al carrito con cantidad 1
    if(cantidad == 1){
        updateCart(result[i], 1)
    }
}

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

init();
